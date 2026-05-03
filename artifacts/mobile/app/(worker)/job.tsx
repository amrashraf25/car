import { Feather } from "@expo/vector-icons";
import {
  useGetOrder,
  useUpdateOrderStatus,
} from "@workspace/api-client-react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
import Svg, { Circle, Text as SvgText } from "react-native-svg";

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

const ACTIVE_STATUSES: OrderStatus[] = ["en_route", "in_progress", "finishing"];

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
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const status = order?.status as OrderStatus | undefined;
  const isActive = status && ACTIVE_STATUSES.includes(status);

  useEffect(() => {
    if (isActive && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]);

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  async function handleStatusUpdate() {
    if (!order) return;
    const next = NEXT_STATUS[order.status as OrderStatus];
    if (!next) return;
    if (next === "completed") {
      const allChecked = allItems.every((item) => checklist[item]);
      if (!allChecked) return;
    }
    await updateStatus.mutateAsync({ id: order.id, data: { status: next } });
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
    title: { fontSize: 20, fontFamily: "PlayfairDisplay_700Bold", color: colors.foreground },
    loading: { flex: 1, alignItems: "center", justifyContent: "center" },
    scroll: { paddingHorizontal: 20, paddingBottom: insets.bottom + 32 },
    customerCard: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: 24,
      marginBottom: 16,
    },
    customerLabel: {
      fontSize: 10,
      fontFamily: "DMSans_600SemiBold",
      color: "rgba(255,255,255,0.4)",
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 8,
    },
    customerName: {
      fontSize: 24,
      fontFamily: "PlayfairDisplay_700Bold",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    carInfo: {
      fontSize: 14,
      fontFamily: "DMSans_400Regular",
      color: "rgba(255,255,255,0.6)",
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
      fontFamily: "DMSans_400Regular",
      color: "rgba(255,255,255,0.6)",
      flex: 1,
    },
    timerPill: {
      alignSelf: "flex-start",
      marginTop: 12,
      backgroundColor: "rgba(255,255,255,0.1)",
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 100,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    timerText: {
      fontSize: 16,
      fontFamily: "DMSans_700Bold",
      color: "#22C55E",
      letterSpacing: 1,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: "PlayfairDisplay_700Bold",
      color: colors.foreground,
    },
    checkItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    checkBox: {
      width: 24,
      height: 24,
      borderRadius: 7,
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
      fontFamily: "DMSans_400Regular",
      color: colors.foreground,
      flex: 1,
    },
    checkLabelDone: {
      textDecorationLine: "line-through",
      color: colors.mutedForeground,
    },
    progressHint: {
      fontSize: 12,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
      marginTop: 10,
      textAlign: "center",
    },
    actionBtn: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 18,
      alignItems: "center",
      marginBottom: 12,
    },
    actionBtnCompleted: { backgroundColor: colors.accent },
    actionBtnDisabled: { opacity: 0.4 },
    actionBtnText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontFamily: "DMSans_600SemiBold",
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
        <Text style={{ color: colors.mutedForeground, fontFamily: "DMSans_400Regular" }}>Order not found</Text>
      </View>
    );
  }

  const addons = order.addons as Array<{ id: string; name: string; price: number }>;
  const allItems = [order.packageName, ...addons.map((a) => a.name)];
  const checkedCount = allItems.filter((item) => checklist[item]).length;
  const progress = allItems.length > 0 ? checkedCount / allItems.length : 0;
  const nextLabel = NEXT_BTN_LABEL[status as OrderStatus];
  const isCompleted = status === "completed";
  const isMarkComplete = status === "finishing";
  const allChecked = allItems.every((item) => checklist[item]);

  const RADIUS = 34;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={s.title}>Job Detail</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
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
            <Feather name="calendar" size={14} color="rgba(255,255,255,0.4)" />
            <Text style={s.infoText}>
              {order.scheduledDate} · {order.scheduledTime}
            </Text>
          </View>
          <View style={s.infoRow}>
            <Feather name="map-pin" size={14} color="rgba(255,255,255,0.4)" />
            <Text style={s.infoText}>{order.locationAddress}</Text>
          </View>
          <View style={s.infoRow}>
            <Feather name="dollar-sign" size={14} color="rgba(255,255,255,0.4)" />
            <Text style={s.infoText}>${order.totalPrice}</Text>
          </View>
          {isActive && (
            <View style={s.timerPill}>
              <Feather name="clock" size={14} color="#22C55E" />
              <Text style={s.timerText}>{formatTime(elapsedSeconds)}</Text>
            </View>
          )}
        </View>

        <View style={s.section}>
          <Text style={[s.sectionTitle, { marginBottom: 16 }]}>Status Timeline</Text>
          <StatusTimeline status={status as never} />
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Service Checklist</Text>
            <Svg width="80" height="80">
              <Circle
                cx="40" cy="40" r={RADIUS}
                fill="none"
                stroke={colors.border}
                strokeWidth={5}
              />
              <Circle
                cx="40" cy="40" r={RADIUS}
                fill="none"
                stroke={colors.accent}
                strokeWidth={5}
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90, 40, 40)"
              />
              <SvgText
                x="40" y="40"
                textAnchor="middle"
                dy="6"
                fontSize="15"
                fill={colors.foreground}
                fontWeight="700"
              >
                {Math.round(progress * 100)}%
              </SvgText>
            </Svg>
          </View>

          {allItems.map((item, i) => (
            <Pressable
              key={i}
              style={s.checkItem}
              onPress={() => toggleCheck(item)}
            >
              <View style={[s.checkBox, checklist[item] && s.checkBoxChecked]}>
                {checklist[item] && <Feather name="check" size={13} color="#FFF" />}
              </View>
              <Text style={[s.checkLabel, checklist[item] && s.checkLabelDone]}>
                {item}
              </Text>
            </Pressable>
          ))}

          {isMarkComplete && !allChecked && (
            <Text style={s.progressHint}>
              Complete all items above before marking job done
            </Text>
          )}
        </View>

        {nextLabel && !isCompleted && (
          <Pressable
            style={[
              s.actionBtn,
              (updateStatus.isPending || (isMarkComplete && !allChecked)) && s.actionBtnDisabled,
            ]}
            onPress={handleStatusUpdate}
            disabled={updateStatus.isPending || (isMarkComplete && !allChecked)}
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
            <Text style={s.actionBtnText}>✓  Job Complete</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
