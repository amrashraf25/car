import { useGetOrders } from "@workspace/api-client-react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const STATUS_FILTERS = [
  "all",
  "pending",
  "confirmed",
  "en_route",
  "in_progress",
  "completed",
  "cancelled",
] as const;

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  pending: { color: "#F59E0B", bg: "#FEF3C7" },
  confirmed: { color: "#3B82F6", bg: "#DBEAFE" },
  en_route: { color: "#8B5CF6", bg: "#EDE9FE" },
  in_progress: { color: "#22C55E", bg: "#DCFCE7" },
  finishing: { color: "#06B6D4", bg: "#CFFAFE" },
  completed: { color: "#6B7280", bg: "#F3F4F6" },
  cancelled: { color: "#EF4444", bg: "#FEE2E2" },
};

export default function AdminOrders() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<string>("all");

  const { data: orders, isLoading } = useGetOrders(
    filter !== "all" ? { status: filter } : undefined,
  );

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    title: { fontSize: 28, fontFamily: "DMSans_700Bold", color: colors.foreground, marginBottom: 16 },
    filterScroll: { flexDirection: "row", gap: 8 },
    filterBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 100,
      backgroundColor: colors.muted,
    },
    filterBtnActive: { backgroundColor: colors.primary },
    filterText: { fontSize: 13, fontFamily: "DMSans_500Medium", color: colors.mutedForeground },
    filterTextActive: { color: colors.primaryForeground },
    scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: insets.bottom + 100 },
    loading: { flex: 1, alignItems: "center", justifyContent: "center" },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    idBadge: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    idText: { fontSize: 12, fontFamily: "DMSans_600SemiBold", color: colors.foreground },
    info: { flex: 1 },
    pkg: { fontSize: 15, fontFamily: "DMSans_600SemiBold", color: colors.foreground },
    meta: { fontSize: 12, fontFamily: "DMSans_400Regular", color: colors.mutedForeground, marginTop: 2 },
    right: { alignItems: "flex-end", gap: 4 },
    price: { fontSize: 15, fontFamily: "DMSans_700Bold", color: colors.foreground },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 100,
    },
    badgeText: { fontSize: 11, fontFamily: "DMSans_600SemiBold" },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Orders</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterScroll}
        >
          {STATUS_FILTERS.map((f) => (
            <Pressable
              key={f}
              style={[s.filterBtn, filter === f && s.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.filterText, filter === f && s.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1).replace(/_/g, " ")}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={s.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {(orders ?? []).map((order) => {
            const sc = STATUS_COLORS[order.status] ?? { color: "#9CA3AF", bg: "#F3F4F6" };
            return (
              <View key={order.id} style={s.row}>
                <View style={s.idBadge}>
                  <Text style={s.idText}>#{order.id}</Text>
                </View>
                <View style={s.info}>
                  <Text style={s.pkg}>{order.packageName}</Text>
                  <Text style={s.meta}>
                    {order.customer?.name ?? "Unknown"} · {order.scheduledDate}
                  </Text>
                </View>
                <View style={s.right}>
                  <Text style={s.price}>${order.totalPrice}</Text>
                  <View style={[s.badge, { backgroundColor: sc.bg }]}>
                    <Text style={[s.badgeText, { color: sc.color }]}>
                      {order.status.replace(/_/g, " ")}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
