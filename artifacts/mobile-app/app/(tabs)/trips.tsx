import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { apiFetch } from "@/constants/api";

type Trip = {
  id: number;
  destination: string;
  description: string;
  imageUrl: string;
  duration: number;
  price: number;
  startDate: string;
  capacity: number;
  availableSpots: number;
  featured: boolean;
};

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filtered, setFiltered] = useState<Trip[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrips = useCallback(async () => {
    try {
      const res = await apiFetch("/trips");
      const data = await res.json();
      setTrips(data);
      setFiltered(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchTrips().finally(() => setLoading(false));
  }, [fetchTrips]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(trips);
    } else {
      setFiltered(trips.filter((t) => t.destination.includes(search.trim())));
    }
  }, [search, trips]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/trip/${item.id}`)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} contentFit="cover" />
      <View style={styles.cardBody}>
        <Text style={styles.cardDest}>{item.destination}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        <View style={styles.cardRow}>
          <View style={styles.cardChip}>
            <Ionicons name="time-outline" size={14} color={Colors.light.primary} />
            <Text style={styles.chipText}>{item.duration} أيام</Text>
          </View>
          <View style={styles.cardChip}>
            <Ionicons name="people-outline" size={14} color={Colors.light.primary} />
            <Text style={styles.chipText}>{item.availableSpots} مقعد</Text>
          </View>
        </View>
        <Text style={styles.contactPrice}>تواصل معنا للحصول على السعر</Text>
      </View>
      {item.featured && (
        <View style={styles.featuredBadge}>
          <Ionicons name="star" size={10} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.header}>
        <Text style={styles.title}>الرحلات المنظمة</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.light.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن وجهة..."
            placeholderTextColor={Colors.light.textTertiary}
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTrip}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.primary} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="airplane-outline" size={48} color={Colors.light.textTertiary} />
              <Text style={styles.emptyText}>لا توجد رحلات</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8 },
  title: {
    fontSize: 24,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.text,
    textAlign: "right",
    marginBottom: 12,
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
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    color: Colors.light.text,
    writingDirection: "rtl",
  },
  list: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 8 },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  cardImage: { width: "100%", height: 160 },
  cardBody: { padding: 14 },
  cardDest: {
    fontSize: 17,
    fontFamily: "Cairo_700Bold",
    color: Colors.light.text,
    textAlign: "right",
    writingDirection: "rtl",
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: "Cairo_400Regular",
    color: Colors.light.textSecondary,
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 4,
    lineHeight: 20,
  },
  cardRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    justifyContent: "flex-end",
  },
  cardChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.primaryLight + "25",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Cairo_500Medium",
    color: Colors.light.primaryDark,
  },
  contactPrice: {
    fontSize: 13,
    fontFamily: "Cairo_600SemiBold",
    color: Colors.light.primary,
    textAlign: "center",
    marginTop: 10,
    paddingVertical: 6,
    backgroundColor: Colors.light.primaryLight + "20",
    borderRadius: 8,
  },
  featuredBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.light.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyText: {
    fontSize: 15,
    fontFamily: "Cairo_500Medium",
    color: Colors.light.textTertiary,
  },
});
