import { Feather } from "@expo/vector-icons";
import { useGetAdminStats, useGetOrders, useGetWorkers } from "@workspace/api-client-react";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SkeletonCard, SkeletonStat } from "@/components/SkeletonLoader";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const STATUS_COLORS: Record<string, string> = {
  available: "#22C55E",
  busy: "#F59E0B",
  offline: "#9CA3AF",
};

const CHART_DATA = [
  { day: "Mon", revenue: 120 },
  { day: "Tue", revenue: 240 },
  { day: "Wed", revenue: 185 },
  { day: "Thu", revenue: 320 },
  { day: "Fri", revenue: 280 },
  { day: "Sat", revenue: 450 },
  { day: "Sun", revenue: 380 },
];

const MAX_REVENUE = Math.max(...CHART_DATA.map((d) => d.revenue));
const BAR_MAX_HEIGHT = 80;

export default function AdminOverview() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: orders, isLoading: ordersLoading } = useGetOrders();
  const { data: workers } = useGetWorkers();

  const recentOrders = (orders ?? []).slice(0, 5);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingBottom: insets.bottom + 100 },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingHorizontal: 20,
      paddingBottom: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      fontSize: 12,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    title: { fontSize: 28, fontFamily: "PlayfairDisplay_700Bold", color: colors.foreground },
    logoutBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      minWidth: "44%",
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    statNum: { fontSize: 28, fontFamily: "PlayfairDisplay_700Bold", color: colors.foreground },
    statLabel: {
      fontSize: 12,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
    },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "PlayfairDisplay_700Bold",
      color: colors.foreground,
      marginBottom: 14,
    },
    chartCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    chartLabel: {
      fontSize: 12,
      fontFamily: "DMSans_500Medium",
      color: colors.mutedForeground,
      marginBottom: 16,
    },
    chartRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      height: BAR_MAX_HEIGHT + 44,
      gap: 6,
    },
    barCol: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
    barValueText: {
      fontSize: 9,
      fontFamily: "DMSans_500Medium",
      color: colors.mutedForeground,
      marginBottom: 4,
    },
    barDayText: {
      fontSize: 10,
      fontFamily: "DMSans_500Medium",
      color: colors.mutedForeground,
      marginTop: 6,
    },
    workerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    workerAvatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    workerAvatarText: {
      fontSize: 16,
      fontFamily: "DMSans_700Bold",
      color: colors.foreground,
    },
    workerName: {
      flex: 1,
      fontSize: 15,
      fontFamily: "DMSans_600SemiBold",
      color: colors.foreground,
    },
    workerStatus: {
      fontSize: 12,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
    },
    statusDot: { width: 10, height: 10, borderRadius: 5 },
    orderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    orderLeft: { flex: 1 },
    orderPkg: { fontSize: 14, fontFamily: "DMSans_600SemiBold", color: colors.foreground },
    orderMeta: {
      fontSize: 12,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    orderPrice: {
      fontSize: 16,
      fontFamily: "PlayfairDisplay_700Bold",
      color: colors.foreground,
    },
  });

  const STAT_CARDS = statsLoading
    ? []
    : [
        { icon: "shopping-bag" as const, label: "Orders Today", value: stats?.totalOrdersToday ?? 0 },
        { icon: "users" as const, label: "Active Workers", value: stats?.activeWorkers ?? 0 },
        { icon: "clock" as const, label: "Pending", value: stats?.pendingOrders ?? 0 },
        { icon: "dollar-sign" as const, label: "Revenue Today", value: `$${(stats?.revenueToday ?? 0).toFixed(0)}` },
      ];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.label}>Admin Panel</Text>
          <Text style={s.title}>Overview</Text>
        </View>
        <Pressable style={s.logoutBtn} onPress={logout}>
          <Feather name="log-out" size={18} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {statsLoading ? (
          <View style={s.statsGrid}>
            {[0, 1, 2, 3].map((i) => <SkeletonStat key={i} />)}
          </View>
        ) : (
          <View style={s.statsGrid}>
            {STAT_CARDS.map((card) => (
              <View key={card.label} style={s.statCard}>
                <View style={s.statIcon}>
                  <Feather name={card.icon} size={18} color={colors.foreground} />
                </View>
                <Text style={s.statNum}>{card.value}</Text>
                <Text style={s.statLabel}>{card.label}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={s.section}>
          <Text style={s.sectionTitle}>Revenue — Last 7 Days</Text>
          <View style={s.chartCard}>
            <Text style={s.chartLabel}>DAILY REVENUE (USD)</Text>
            <View style={s.chartRow}>
              {CHART_DATA.map((item, i) => {
                const barH = Math.max(4, (item.revenue / MAX_REVENUE) * BAR_MAX_HEIGHT);
                const isTallest = item.revenue === MAX_REVENUE;
                return (
                  <View key={i} style={s.barCol}>
                    <Text style={s.barValueText}>${item.revenue}</Text>
                    <View
                      style={{
                        width: "80%",
                        height: barH,
                        backgroundColor: isTallest ? colors.gold : colors.primary,
                        borderRadius: 6,
                        opacity: isTallest ? 1 : 0.6,
                      }}
                    />
                    <Text style={s.barDayText}>{item.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {(workers ?? []).length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Workers</Text>
            <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border }}>
              {(workers ?? []).map((w) => (
                <View key={w.id} style={s.workerRow}>
                  <View style={s.workerAvatar}>
                    <Text style={s.workerAvatarText}>
                      {w.user?.name?.[0]?.toUpperCase() ?? "W"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.workerName}>{w.user?.name ?? "Worker"}</Text>
                    <Text style={s.workerStatus}>{w.status}</Text>
                  </View>
                  <View style={[s.statusDot, { backgroundColor: STATUS_COLORS[w.status] ?? "#9CA3AF" }]} />
                </View>
              ))}
            </View>
          </View>
        )}

        {recentOrders.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Recent Orders</Text>
            <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border }}>
              {recentOrders.map((order) => (
                <View key={order.id} style={s.orderRow}>
                  <View style={s.orderLeft}>
                    <Text style={s.orderPkg}>{order.packageName}</Text>
                    <Text style={s.orderMeta}>
                      {order.customer?.name ?? "Unknown"} · {order.status.replace(/_/g, " ")}
                    </Text>
                  </View>
                  <Text style={s.orderPrice}>${order.totalPrice}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
