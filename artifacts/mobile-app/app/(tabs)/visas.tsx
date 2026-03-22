import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { apiFetch } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

const continents: Record<string, string[]> = {
  "آسيا والشرق الأوسط": ["السعودية", "الإمارات", "تركيا", "ماليزيا", "إندونيسيا", "تايلاند", "الهند", "قطر", "البحرين", "الأردن"],
  "أفريقيا": ["مصر", "جنوب أفريقيا", "كينيا", "تنزانيا", "المغرب", "تونس", "السنغال", "إثيوبيا"],
  "أوروبا": ["فرنسا", "إسبانيا", "إيطاليا", "ألمانيا", "بريطانيا", "هولندا", "بلجيكا", "النمسا", "سويسرا"],
  "الأمريكتان": ["الولايات المتحدة", "كندا", "البرازيل", "المكسيك", "الأرجنتين"],
};

type Step = "countries" | "form" | "success";

export default function VisasScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("countries");
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    nationality: "جزائري",
    passportNumber: "",
    visaType: "سياحة",
    notes: "",
  });

  const handleCountrySelect = (country: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setSelectedCountry(country);
    setStep("form");
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.passportNumber) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch("/visa-requests", {
        method: "POST",
        body: JSON.stringify({
          fullName: form.fullName,
          nationality: form.nationality,
          passportNumber: form.passportNumber,
          destination: selectedCountry,
          visaType: form.visaType,
          notes: form.notes,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      setStep("success");
    } catch (err: any) {
      Alert.alert("خطأ", err.message || "فشل إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  const filteredContinents = Object.entries(continents).reduce(
    (acc, [continent, countries]) => {
      const filtered = countries.filter((c) => c.includes(search));
      if (filtered.length > 0) acc[continent] = filtered;
      return acc;
    },
    {} as Record<string, string[]>
  );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + webTopInset }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleRow}>
        {step !== "countries" && (
          <TouchableOpacity onPress={() => setStep("countries")} style={styles.backBtn}>
            <Ionicons name="arrow-forward" size={22} color={Colors.light.text} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>
          {step === "countries" ? "التأشيرات الإلكترونية" : step === "form" ? `تأشيرة ${selectedCountry}` : "تم الإرسال"}
        </Text>
      </View>

      {step === "countries" && (
        <>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={Colors.light.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن دولة..."
              placeholderTextColor={Colors.light.textTertiary}
              value={search}
              onChangeText={setSearch}
              textAlign="right"
            />
          </View>

          {Object.entries(filteredContinents).map(([continent, countries]) => (
            <View key={continent} style={styles.continentBlock}>
              <Text style={styles.continentTitle}>{continent}</Text>
              <View style={styles.countriesGrid}>
                {countries.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={styles.countryChip}
                    onPress={() => handleCountrySelect(c)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.countryText}>{c}</Text>
                    <Ionicons name="globe-outline" size={16} color={Colors.light.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </>
      )}

      {step === "form" && (
        <View style={styles.formContainer}>
          {[
            { label: "الاسم الكامل *", key: "fullName", placeholder: "أدخل اسمك الكامل" },
            { label: "الجنسية", key: "nationality", placeholder: "جزائري" },
            { label: "رقم جواز السفر *", key: "passportNumber", placeholder: "رقم جواز السفر" },
            { label: "نوع التأشيرة", key: "visaType", placeholder: "سياحة" },
            { label: "ملاحظات", key: "notes", placeholder: "ملاحظات إضافية", multiline: true },
          ].map((field) => (
            <View key={field.key} style={styles.formGroup}>
              <Text style={styles.formLabel}>{field.label}</Text>
              <TextInput
                style={[styles.formInput, (field as any).multiline && styles.formTextarea]}
                placeholder={field.placeholder}
                placeholderTextColor={Colors.light.textTertiary}
                value={(form as any)[field.key]}
                onChangeText={(v) => setForm({ ...form, [field.key]: v })}
                textAlign="right"
                multiline={(field as any).multiline}
                numberOfLines={(field as any).multiline ? 3 : 1}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>إرسال الطلب</Text>
                <Ionicons name="send" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {step === "success" && (
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.light.success} />
          </View>
          <Text style={styles.successTitle}>تم إرسال طلبك بنجاح!</Text>
          <Text style={styles.successDesc}>سنتواصل معك قريباً بخصوص تأشيرة {selectedCountry}</Text>
          <TouchableOpacity
            style={styles.newRequestBtn}
            onPress={() => {
              setStep("countries");
              setForm({ fullName: "", nationality: "جزائري", passportNumber: "", visaType: "سياحة", notes: "" });
            }}
          >
            <Text style={styles.newRequestText}>طلب تأشيرة أخرى</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, paddingHorizontal: 20 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 10,
    marginBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.light.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.text,
    textAlign: "right",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    color: Colors.light.text,
    writingDirection: "rtl",
  },
  continentBlock: { marginBottom: 20 },
  continentTitle: {
    fontSize: 17,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.secondary,
    textAlign: "right",
    marginBottom: 10,
  },
  countriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
  },
  countryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  countryText: {
    fontSize: 13,
    fontFamily: "Cairo_500Medium",
    color: Colors.light.text,
  },
  formContainer: { gap: 14, paddingTop: 4 },
  formGroup: {},
  formLabel: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: Colors.light.text,
    textAlign: "right",
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
    writingDirection: "rtl",
  },
  formTextarea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#fff",
  },
  successContainer: {
    alignItems: "center",
    paddingTop: 40,
    gap: 12,
  },
  successIcon: { marginBottom: 8 },
  successTitle: {
    fontSize: 22,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.text,
  },
  successDesc: {
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    color: Colors.light.textSecondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  newRequestBtn: {
    backgroundColor: Colors.light.primaryLight + "30",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 12,
  },
  newRequestText: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: Colors.light.primaryDark,
  },
});
