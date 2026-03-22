import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { apiFetch } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";

const { width } = Dimensions.get("window");

type Trip = {
  id: number;
  destination: string;
  description: string;
  imageUrl: string;
  duration: number;
  featured: boolean;
};

const services = [
  { icon: "airplane" as const, label: "رحلات منظمة", route: "/trips" },
  { icon: "document-text" as const, label: "التأشيرات", route: "/visas" },
  { icon: "star" as const, label: "العمرة", route: "/umrah" },
  { icon: "bed" as const, label: "حجوزات", route: "/reservations" },
  { icon: "call" as const, label: "اتصل بنا", route: "/contact" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  useEffect(() => {
    apiFetch("/trips?featured=true")
      .then((r) => r.json())
      .then((d) => setTrips(d.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors.light.background }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroContainer, { paddingTop: insets.top + webTopInset }]}>
        <LinearGradient
          colors={["#1B3A5C", "#2A5580", "#1B3A5C"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>وكالة شويعر</Text>
          <Text style={styles.heroSubtitle}>للسياحة والأسفار</Text>
          <Text style={styles.heroEnglish}>CHOUIAAR TRAVEL AGENCY</Text>
          <View style={styles.heroDivider} />
          <Text style={styles.heroDesc}>رفيقك الموثوق في كل رحلة</Text>

          {!user && (
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => router.push("/login")}
              activeOpacity={0.8}
            >
              <Text style={styles.heroBtnText}>تسجيل الدخول</Text>
              <Ionicons name="log-in-outline" size={18} color="#1B3A5C" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>خدماتنا</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesRow}
        >
          {services.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={styles.serviceCard}
              onPress={() => {
                if (!user && s.route !== "/contact") {
                  router.push("/login");
                  return;
                }
                router.push(s.route as any);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.serviceIconWrap}>
                <Ionicons name={s.icon} size={24} color={Colors.light.primary} />
              </View>
              <Text style={styles.serviceLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.tripsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>رحلات مميزة</Text>
          <TouchableOpacity onPress={() => router.push("/trips")}>
            <Text style={styles.seeAll}>عرض الكل</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 20 }} />
        ) : trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={48} color={Colors.light.textTertiary} />
            <Text style={styles.emptyText}>لا توجد رحلات حالياً</Text>
          </View>
        ) : (
          trips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.tripCard}
              onPress={() => router.push(`/trip/${trip.id}`)}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: trip.imageUrl }}
                style={styles.tripImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.tripOverlay}
              />
              <View style={styles.tripInfo}>
                <Text style={styles.tripDest}>{trip.destination}</Text>
                <View style={styles.tripMeta}>
                  <Ionicons name="time-outline" size={14} color="#fff" />
                  <Text style={styles.tripDuration}>{trip.duration} أيام</Text>
                </View>
              </View>
              {trip.featured && (
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={12} color="#fff" />
                  <Text style={styles.featuredText}>مميز</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.whyUsSection}>
        <Text style={styles.sectionTitle}>لماذا تختارنا؟</Text>
        {[
          { icon: "shield-checkmark", title: "حجز آمن", desc: "نضمن سلامة معاملاتك وبياناتك" },
          { icon: "headset", title: "دعم متواصل", desc: "فريق خدمة العملاء متاح دائماً" },
          { icon: "globe", title: "وجهات متعددة", desc: "نغطي أكثر الوجهات السياحية شهرة" },
        ].map((item, i) => (
          <View key={i} style={styles.whyCard}>
            <View style={styles.whyIconWrap}>
              <Ionicons name={item.icon as any} size={22} color={Colors.light.primary} />
            </View>
            <View style={styles.whyTextWrap}>
              <Text style={styles.whyTitle}>{item.title}</Text>
              <Text style={styles.whyDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: {
    paddingBottom: 30,
    overflow: "hidden",
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.primary,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 20,
    fontFamily: "Cairo_600SemiBold",
    color: "#fff",
    marginTop: -4,
  },
  heroEnglish: {
    fontSize: 12,
    fontFamily: "Cairo_500Medium",
    color: Colors.light.primaryLight,
    letterSpacing: 3,
    marginTop: 4,
  },
  heroDivider: {
    width: 60,
    height: 2,
    backgroundColor: Colors.light.primary,
    marginVertical: 14,
    borderRadius: 1,
  },
  heroDesc: {
    fontSize: 15,
    fontFamily: "Cairo_500Medium",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  heroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 16,
  },
  heroBtnText: {
    fontFamily: "Cairo_600SemiBold",
    fontSize: 14,
    color: "#1B3A5C",
  },
  servicesSection: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.text,
    paddingHorizontal: 20,
    marginBottom: 14,
    writingDirection: "rtl",
    textAlign: "right",
  },
  servicesRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  serviceCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: 90,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  serviceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.light.primaryLight + "30",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 12,
    fontFamily: "Cairo_600SemiBold",
    color: Colors.light.text,
    textAlign: "center",
  },
  tripsSection: {
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: Colors.light.primary,
  },
  tripCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    height: 180,
    backgroundColor: Colors.light.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  tripImage: {
    width: "100%",
    height: "100%",
  },
  tripOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  tripInfo: {
    position: "absolute",
    bottom: 14,
    right: 14,
    left: 14,
  },
  tripDest: {
    fontSize: 18,
    fontFamily: "Cairo_700Bold",
    color: "#fff",
    writingDirection: "rtl",
    textAlign: "right",
  },
  tripMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    justifyContent: "flex-end",
  },
  tripDuration: {
    fontSize: 13,
    fontFamily: "Cairo_500Medium",
    color: "rgba(255,255,255,0.9)",
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  featuredText: {
    fontSize: 11,
    fontFamily: "Cairo_600SemiBold",
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Cairo_500Medium",
    color: Colors.light.textTertiary,
  },
  whyUsSection: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  whyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
    gap: 14,
  },
  whyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.light.primaryLight + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  whyTextWrap: {
    flex: 1,
  },
  whyTitle: {
    fontSize: 15,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.text,
    writingDirection: "rtl",
    textAlign: "right",
  },
  whyDesc: {
    fontSize: 13,
    fontFamily: "Cairo_400Regular",
    color: Colors.light.textSecondary,
    writingDirection: "rtl",
    textAlign: "right",
    marginTop: 2,
  },
});
