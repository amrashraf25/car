import { Feather } from "@expo/vector-icons";
import { useGetAdminStats, useGetOrders, useGetWorkers } from "@workspace/api-client-react";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const STATUS_COLORS: Record<string, string> = {
  available: "#22C55E",
  busy: "#F59E0B",
  offline: "#9CA3AF",
};

export default function AdminOverview() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

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
    titleArea: {},
    label: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    title: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground },
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
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
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
    statNum: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground },
    statLabel: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 4 },
    section: { paddingHorizontal: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: colors.foreground, marginBottom: 12 },
    workerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    workerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    workerAvatarText: { fontSize: 16, fontFamily: "Inter_700Bold", color: colors.foreground },
    workerName: { flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    statusDot: { width: 10, height: 10, borderRadius: 5 },
    orderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    orderLeft: { flex: 1 },
    orderPkg: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    orderMeta: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 2 },
    orderPrice: { fontSize: 16, fontFamily: "Inter_700Bold", color: colors.foreground },
  });

  const STAT_CARDS = statsLoading
    ? []
    : [
        {
          icon: "shopping-bag" as const,
          label: "Orders Today",
          value: stats?.totalOrdersToday ?? 0,
        },
        {
          icon: "users" as const,
          label: "Active Workers",
          value: stats?.activeWorkers ?? 0,
        },
        {
          icon: "clock" as const,
          label: "Pending",
          value: stats?.pendingOrders ?? 0,
        },
        {
          icon: "dollar-sign" as const,
          label: "Revenue Today",
          value: `$${(stats?.revenueToday ?? 0).toFixed(0)}`,
        },
      ];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.titleArea}>
          <Text style={s.label}>Admin Panel</Text>
          <Text style={s.title}>Overview</Text>
        </View>
        <Pressable style={s.logoutBtn} onPress={logout}>
          <Feather name="log-out" size={18} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {statsLoading ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator color={colors.primary} />
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

        {(workers ?? []).length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Workers</Text>
            {(workers ?? []).map((w) => (
              <View key={w.id} style={s.workerRow}>
                <View style={s.workerAvatar}>
                  <Text style={s.workerAvatarText}>
                    {w.user?.name?.[0]?.toUpperCase() ?? "W"}
                  </Text>
                </View>
                <Text style={s.workerName}>{w.user?.name ?? "Worker"}</Text>
                <View
                  style={[
                    s.statusDot,
                    { backgroundColor: STATUS_COLORS[w.status] ?? "#9CA3AF" },
                  ]}
                />
              </View>
            ))}
          </View>
        )}

        {recentOrders.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Recent Orders</Text>
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
        )}
      </ScrollView>
    </View>
  );
}
