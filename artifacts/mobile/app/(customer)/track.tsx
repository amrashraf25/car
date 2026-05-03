import { Feather } from "@expo/vector-icons";
import { useGetOrder } from "@workspace/api-client-react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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

const STATUS_MESSAGES: Record<OrderStatus, string> = {
  pending: "Waiting for a detailer to be assigned",
  confirmed: "Your booking is confirmed",
  en_route: "Your detailer is on the way",
  in_progress: "Cleaning in progress",
  finishing: "Almost done! Final touches...",
  completed: "Your car is sparkling clean!",
  cancelled: "This order has been cancelled",
};

export default function TrackScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const { data: order, isLoading, refetch } = useGetOrder(
    parseInt(orderId ?? "0"),
    { query: { enabled: !!orderId, refetchInterval: 10000 } },
  );

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    if (order?.status === "in_progress") {
      const interval = setInterval(() => setElapsed((e) => e + 1), 60000);
      return () => clearInterval(interval);
    }
  }, [order?.status]);

  const status = (order?.status ?? "pending") as OrderStatus;

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
    statusCard: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: 24,
      marginBottom: 20,
    },
    statusOrderId: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: "rgba(255,255,255,0.5)",
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    statusMessage: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      marginBottom: 16,
    },
    pulseRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    pulseDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.accent,
    },
    statusLabel: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
    },
    etaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 12,
    },
    etaText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.7)",
    },
    progressBar: {
      height: 4,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 2,
      marginTop: 16,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.accent,
      borderRadius: 2,
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
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
    },
    infoText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      flex: 1,
    },
    workerName: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 4,
    },
    workerEmail: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    addonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    addonName: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    addonPrice: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
    },
    totalLabel: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    totalAmount: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
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
  const progressPct = {
    pending: 0,
    confirmed: 20,
    en_route: 40,
    in_progress: 60,
    finishing: 80,
    completed: 100,
    cancelled: 0,
  }[status];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={s.title}>Track Order</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.statusCard}>
          <Text style={s.statusOrderId}>Order #{order.id}</Text>
          <Text style={s.statusMessage}>{STATUS_MESSAGES[status]}</Text>
          <View style={s.pulseRow}>
            <Animated.View
              style={[s.pulseDot, { transform: [{ scale: pulseAnim }] }]}
            />
            <Text style={s.statusLabel}>
              {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </Text>
          </View>
          {status === "in_progress" && elapsed > 0 && (
            <View style={s.etaRow}>
              <Feather name="clock" size={14} color="rgba(255,255,255,0.6)" />
              <Text style={s.etaText}>{elapsed} min elapsed</Text>
            </View>
          )}
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${progressPct}%` }]} />
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Status Timeline</Text>
          <StatusTimeline status={status} />
        </View>

        {order.worker?.user && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Your Detailer</Text>
            <View style={s.infoRow}>
              <Feather name="user" size={16} color={colors.mutedForeground} />
              <Text style={s.workerName}>{order.worker.user.name}</Text>
            </View>
            <Text style={s.workerEmail}>{order.worker.user.email}</Text>
          </View>
        )}

        <View style={s.section}>
          <Text style={s.sectionTitle}>Order Details</Text>
          <View style={s.infoRow}>
            <Feather name="package" size={16} color={colors.mutedForeground} />
            <Text style={s.infoText}>{order.packageName}</Text>
          </View>
          <View style={s.infoRow}>
            <Feather name="calendar" size={16} color={colors.mutedForeground} />
            <Text style={s.infoText}>
              {order.scheduledDate} · {order.scheduledTime}
            </Text>
          </View>
          <View style={s.infoRow}>
            <Feather name="map-pin" size={16} color={colors.mutedForeground} />
            <Text style={s.infoText}>{order.locationAddress}</Text>
          </View>

          {addons.length > 0 && (
            <>
              <Text style={[s.sectionTitle, { marginTop: 16, marginBottom: 8, fontSize: 14 }]}>
                Add-ons
              </Text>
              {addons.map((a) => (
                <View key={a.id} style={s.addonRow}>
                  <Text style={s.addonName}>{a.name}</Text>
                  <Text style={s.addonPrice}>+${a.price}</Text>
                </View>
              ))}
            </>
          )}

          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalAmount}>${order.totalPrice}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
