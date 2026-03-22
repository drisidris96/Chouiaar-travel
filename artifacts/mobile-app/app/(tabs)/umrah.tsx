import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

const packages = [
  {
    name: "العمرة الاقتصادية",
    tier: "economic",
    color: "#8B7355",
    features: [
      "فندق 3 نجوم",
      "على بعد 800 متر من الحرم",
      "إفطار يومي",
      "نقل من وإلى المطار",
      "تأشيرة العمرة",
      "مرشد ديني",
    ],
  },
  {
    name: "العمرة الفضية",
    tier: "silver",
    color: "#8894A0",
    features: [
      "فندق 4 نجوم",
      "على بعد 400 متر من الحرم",
      "إفطار وعشاء يومي",
      "نقل من وإلى المطار",
      "تأشيرة العمرة",
      "مرشد ديني",
      "زيارة المدينة المنورة",
    ],
  },
  {
    name: "العمرة الذهبية",
    tier: "gold",
    color: Colors.light.primary,
    features: [
      "فندق 5 نجوم",
      "إطلالة على الحرم",
      "وجبات كاملة",
      "نقل خاص VIP",
      "تأشيرة العمرة",
      "مرشد ديني خاص",
      "زيارة المدينة المنورة",
      "جولات سياحية",
    ],
  },
];

export default function UmrahScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const handleContact = () => {
    Linking.openURL("https://wa.me/213774718496?text=أريد الاستفسار عن عروض العمرة");
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + webTopInset }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <LinearGradient
          colors={["#1B3A5C", "#2A5580"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Ionicons name="star" size={40} color={Colors.light.primary} />
        <Text style={styles.headerTitle}>باقات العمرة</Text>
        <Text style={styles.headerDesc}>اختر الباقة المناسبة لك واحجز رحلة العمر</Text>
      </View>

      <View style={styles.packagesContainer}>
        {packages.map((pkg, i) => (
          <View key={i} style={[styles.packageCard, { borderTopColor: pkg.color }]}>
            <View style={[styles.packageHeader, { backgroundColor: pkg.color + "15" }]}>
              <Text style={[styles.packageName, { color: pkg.color }]}>{pkg.name}</Text>
            </View>
            <View style={styles.featuresList}>
              {pkg.features.map((f, j) => (
                <View key={j} style={styles.featureRow}>
                  <Text style={styles.featureText}>{f}</Text>
                  <Ionicons name="checkmark-circle" size={18} color={Colors.light.success} />
                </View>
              ))}
            </View>
            <Text style={styles.contactForPrice}>تواصل معنا للحصول على السعر</Text>
            <TouchableOpacity
              style={[styles.packageBtn, { backgroundColor: pkg.color }]}
              onPress={handleContact}
              activeOpacity={0.8}
            >
              <Text style={styles.packageBtnText}>احجز الآن</Text>
              <Ionicons name="arrow-back" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.whySection}>
        <Text style={styles.sectionTitle}>لماذا تختار عمرتنا؟</Text>
        {[
          { icon: "ribbon", text: "15 سنة من الخبرة في تنظيم رحلات العمرة" },
          { icon: "people", text: "مرافقة ومساعدة طوال الرحلة" },
          { icon: "headset", text: "دعم على مدار الساعة" },
        ].map((item, i) => (
          <View key={i} style={styles.whyRow}>
            <View style={styles.whyIcon}>
              <Ionicons name={item.icon as any} size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.whyText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    padding: 24,
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Cairo_700Bold",
    color: "#fff",
  },
  headerDesc: {
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  packagesContainer: { padding: 20, gap: 16 },
  packageCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  packageHeader: {
    padding: 16,
    alignItems: "center",
  },
  packageName: {
    fontSize: 20,
    fontFamily: "Cairo_700Bold",
  },
  featuresList: { paddingHorizontal: 16, paddingBottom: 8 },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  featureText: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: Colors.light.text,
  },
  contactForPrice: {
    fontSize: 13,
    fontFamily: "Cairo_600SemiBold",
    color: Colors.light.primary,
    textAlign: "center",
    paddingVertical: 8,
  },
  packageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: 16,
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: 12,
  },
  packageBtnText: {
    fontSize: 15,
    fontFamily: "Cairo_700Bold",
    color: "#fff",
  },
  whySection: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.text,
    textAlign: "right",
    marginBottom: 14,
  },
  whyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  whyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.light.primaryLight + "25",
    alignItems: "center",
    justifyContent: "center",
  },
  whyText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: Colors.light.text,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
