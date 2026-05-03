import { Feather } from "@expo/vector-icons";
import {
  useGetOrders,
  useGetWorkerProfile,
  useUpdateWorkerStatus,
} from "@workspace/api-client-react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

import { OrderCard } from "@/components/OrderCard";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

type WorkerStatus = "available" | "busy" | "offline";

const STATUS_CONFIG: Record<WorkerStatus, { label: string; color: string; bg: string }> = {
  available: { label: "Available", color: "#22C55E", bg: "#DCFCE7" },
  busy: { label: "Busy", color: "#F59E0B", bg: "#FEF3C7" },
  offline: { label: "Offline", color: "#9CA3AF", bg: "#F3F4F6" },
};

export default function WorkerHomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const { data: worker, refetch: refetchWorker } = useGetWorkerProfile();
  const { data: orders, isLoading } = useGetOrders();
  const updateStatus = useUpdateWorkerStatus();

  const activeJobs = (orders ?? []).filter(
    (o) => !["completed", "cancelled"].includes(o.status),
  );
  const completedJobs = (orders ?? []).filter((o) => o.status === "completed");

  const workerStatus = (worker?.status ?? "offline") as WorkerStatus;

  async function cycleStatus() {
    const next: Record<WorkerStatus, WorkerStatus> = {
      available: "offline",
      offline: "available",
      busy: "busy",
    };
    await updateStatus.mutateAsync({ data: { status: next[workerStatus] } });
    refetchWorker();
  }

  const cfg = STATUS_CONFIG[workerStatus];

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    greeting: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 4,
    },
    name: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 16,
    },
    statusCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    statusLeft: { gap: 4 },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 100,
      backgroundColor: cfg.bg,
      alignSelf: "flex-start",
    },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: cfg.color },
    statusText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: cfg.color,
    },
    statusHint: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    toggleBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 100,
    },
    toggleBtnText: {
      color: colors.primaryForeground,
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
    statsRow: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 20,
      marginTop: 20,
      marginBottom: 8,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
    },
    statNum: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
    },
    sectionHeader: {
      paddingHorizontal: 20,
      marginBottom: 12,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    scroll: { paddingHorizontal: 20, paddingBottom: insets.bottom + 100 },
    empty: { alignItems: "center", paddingVertical: 32 },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.greeting}>Welcome back</Text>
        <Text style={s.name}>{user?.name}</Text>
        <View style={s.statusCard}>
          <View style={s.statusLeft}>
            <View style={s.statusBadge}>
              <View style={s.statusDot} />
              <Text style={s.statusText}>{cfg.label}</Text>
            </View>
            <Text style={s.statusHint}>
              {workerStatus === "available" ? "Ready for jobs" : "Tap to go available"}
            </Text>
          </View>
          <Pressable
            style={s.toggleBtn}
            onPress={cycleStatus}
            disabled={updateStatus.isPending || workerStatus === "busy"}
          >
            {updateStatus.isPending ? (
              <ActivityIndicator size="small" color={colors.primaryForeground} />
            ) : (
              <Text style={s.toggleBtnText}>
                {workerStatus === "available" ? "Go Offline" : "Go Available"}
              </Text>
            )}
          </Pressable>
        </View>
      </View>

      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statNum}>{activeJobs.length}</Text>
          <Text style={s.statLabel}>Active Jobs</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statNum}>{completedJobs.length}</Text>
          <Text style={s.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Today&apos;s Jobs</Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {activeJobs.length === 0 ? (
            <View style={s.empty}>
              <Feather name="check-circle" size={40} color={colors.border} />
              <Text style={[s.emptyText, { marginTop: 12 }]}>No jobs today</Text>
            </View>
          ) : (
            activeJobs.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                packageName={order.packageName}
                status={order.status as never}
                scheduledDate={order.scheduledDate}
                scheduledTime={order.scheduledTime}
                locationAddress={order.locationAddress}
                totalPrice={order.totalPrice}
                carBrand={order.car?.brand}
                carModel={order.car?.model}
                onPress={() => router.push(`/(worker)/job?orderId=${order.id}`)}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
