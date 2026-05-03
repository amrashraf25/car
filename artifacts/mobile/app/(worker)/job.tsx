import { Feather } from "@expo/vector-icons";
import {
  useGetOrder,
  useUpdateOrderStatus,
} from "@workspace/api-client-react";
import { useLocalSearchParams, useRouter } from "expo-router";
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

import { StatusTimeline } from "@/components/StatusTimeline";
import { useColors } from "@/hooks/useColors";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "en_route"
  | "in_progress"
  | "finishing"
  | "completed"
  | "cancelled";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  confirmed: "en_route",
  en_route: "in_progress",
  in_progress: "finishing",
  finishing: "completed",
};

const NEXT_BTN_LABEL: Partial<Record<OrderStatus, string>> = {
  confirmed: "Start Journey",
  en_route: "Start Cleaning",
  in_progress: "Mark Finishing",
  finishing: "Mark Complete",
};

export default function JobDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const { data: order, isLoading, refetch } = useGetOrder(
    parseInt(orderId ?? "0"),
    { query: { enabled: !!orderId } },
  );
  const updateStatus = useUpdateOrderStatus();
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  async function handleStatusUpdate() {
    if (!order) return;
    const next = NEXT_STATUS[order.status as OrderStatus];
    if (!next) return;
    await updateStatus.mutateAsync({
      id: order.id,
      data: { status: next },
    });
    refetch();
  }

  function toggleCheck(key: string) {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingHorizontal: 20,
      paddingBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    title: { fontSize: 22, fontFamily: "Inter_700Bold", color: colors.foreground },
    loading: { flex: 1, alignItems: "center", justifyContent: "center" },
    scroll: { paddingHorizontal: 20, paddingBottom: insets.bottom + 32 },
    customerCard: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: 24,
      marginBottom: 20,
    },
    customerLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: "rgba(255,255,255,0.5)",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 8,
    },
    customerName: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    carInfo: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.7)",
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 6,
    },
    infoText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.7)",
      flex: 1,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 16,
    },
    checkItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    checkBox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    checkBoxChecked: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    checkLabel: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    checkLabelDone: {
      textDecorationLine: "line-through",
      color: colors.mutedForeground,
    },
    actionBtn: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 18,
      alignItems: "center",
      marginBottom: 12,
    },
    actionBtnCompleted: {
      backgroundColor: colors.accent,
    },
    actionBtnText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
  });

  if (isLoading) {
    return (
      <View style={[s.container, s.loading]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[s.container, s.loading]}>
        <Text style={{ color: colors.mutedForeground }}>Order not found</Text>
      </View>
    );
  }

  const addons = order.addons as Array<{ id: string; name: string; price: number }>;
  const allItems = [order.packageName, ...addons.map((a) => a.name)];
  const status = order.status as OrderStatus;
  const nextLabel = NEXT_BTN_LABEL[status];
  const isCompleted = status === "completed";

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={s.title}>Job Detail</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.customerCard}>
          <Text style={s.customerLabel}>Customer</Text>
          <Text style={s.customerName}>{order.customer?.name ?? "Customer"}</Text>
          {order.car && (
            <Text style={s.carInfo}>
              {order.car.brand} {order.car.model} · {order.car.plateNumber}
            </Text>
          )}
          <View style={s.infoRow}>
            <Feather name="calendar" size={14} color="rgba(255,255,255,0.5)" />
            <Text style={s.infoText}>
              {order.scheduledDate} · {order.scheduledTime}
            </Text>
          </View>
          <View style={s.infoRow}>
            <Feather name="map-pin" size={14} color="rgba(255,255,255,0.5)" />
            <Text style={s.infoText}>{order.locationAddress}</Text>
          </View>
          <View style={s.infoRow}>
            <Feather name="dollar-sign" size={14} color="rgba(255,255,255,0.5)" />
            <Text style={s.infoText}>${order.totalPrice}</Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Status Timeline</Text>
          <StatusTimeline status={status} />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Service Checklist</Text>
          {allItems.map((item, i) => (
            <Pressable
              key={i}
              style={s.checkItem}
              onPress={() => toggleCheck(item)}
            >
              <View
                style={[s.checkBox, checklist[item] && s.checkBoxChecked]}
              >
                {checklist[item] && (
                  <Feather name="check" size={14} color="#FFF" />
                )}
              </View>
              <Text
                style={[s.checkLabel, checklist[item] && s.checkLabelDone]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        {nextLabel && !isCompleted && (
          <Pressable
            style={s.actionBtn}
            onPress={handleStatusUpdate}
            disabled={updateStatus.isPending}
          >
            {updateStatus.isPending ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={s.actionBtnText}>{nextLabel}</Text>
            )}
          </Pressable>
        )}

        {isCompleted && (
          <View style={[s.actionBtn, s.actionBtnCompleted]}>
            <Text style={s.actionBtnText}>Job Complete</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
