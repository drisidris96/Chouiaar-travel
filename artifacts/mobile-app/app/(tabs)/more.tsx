import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("تسجيل الخروج", "هل أنت متأكد من تسجيل الخروج؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "تسجيل الخروج",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + webTopInset }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>المزيد</Text>

      {user ? (
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={28} color={Colors.light.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.loginCard}
          onPress={() => router.push("/login")}
          activeOpacity={0.8}
        >
          <View style={styles.loginIconWrap}>
            <Ionicons name="log-in-outline" size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.loginTitle}>تسجيل الدخول</Text>
            <Text style={styles.loginDesc}>سجّل دخولك للاستفادة من جميع الخدمات</Text>
          </View>
          <Ionicons name="chevron-back" size={20} color={Colors.light.textTertiary} />
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الخدمات</Text>
        {[
          { icon: "bed-outline" as const, label: "حجز فنادق وطيران", route: "/reservations", requireAuth: true },
          { icon: "call-outline" as const, label: "اتصل بنا", route: "/contact", requireAuth: false },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuItem}
            onPress={() => {
              if (item.requireAuth && !user) {
                router.push("/login");
                return;
              }
              router.push(item.route as any);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={Colors.light.textTertiary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <View style={styles.menuIconWrap}>
              <Ionicons name={item.icon} size={20} color={Colors.light.primary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>تواصل معنا</Text>
        {[
          { icon: "call" as const, label: "+213 74 71 84 96", action: () => Linking.openURL("tel:+21374718496") },
          { icon: "logo-whatsapp" as const, label: "واتساب", action: () => Linking.openURL("https://wa.me/213774718496") },
          { icon: "mail" as const, label: "البريد الإلكتروني", action: () => Linking.openURL("mailto:chouiaartravelagency@gmail.com") },
          { icon: "logo-facebook" as const, label: "فيسبوك", action: () => Linking.openURL("https://www.facebook.com/share/1CEBKfuqDo/") },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuItem}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={Colors.light.textTertiary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <View style={styles.menuIconWrap}>
              <Ionicons name={item.icon} size={20} color={Colors.light.primary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {user && (
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
          <Ionicons name="log-out-outline" size={20} color={Colors.light.error} />
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>وكالة شويعر للسياحة والأسفار</Text>
        <Text style={styles.footerSub}>CHOUIAAR TRAVEL AGENCY</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, paddingHorizontal: 20 },
  title: {
    fontSize: 24,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.text,
    textAlign: "right",
    paddingTop: 10,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
    gap: 14,
    justifyContent: "flex-end",
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.light.primaryLight + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: { flex: 1, alignItems: "flex-end" },
  profileName: {
    fontSize: 17,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.text,
  },
  profileEmail: {
    fontSize: 13,
    fontFamily: "Cairo_400Regular",
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  loginCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  loginIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  loginTitle: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#fff",
    textAlign: "right",
  },
  loginDesc: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.textSecondary,
    textAlign: "right",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
    gap: 12,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.light.primaryLight + "25",
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: 15,
    fontFamily: "Cairo_600SemiBold",
    color: Colors.light.text,
    textAlign: "right",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.error + "10",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.error + "20",
  },
  logoutText: {
    fontSize: 15,
    fontFamily: "Cairo_600SemiBold",
    color: Colors.light.error,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: Colors.light.textTertiary,
  },
  footerSub: {
    fontSize: 11,
    fontFamily: "Cairo_400Regular",
    color: Colors.light.textTertiary,
    letterSpacing: 2,
  },
});
