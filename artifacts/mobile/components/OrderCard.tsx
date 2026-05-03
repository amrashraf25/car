import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "en_route"
  | "in_progress"
  | "finishing"
  | "completed"
  | "cancelled";

interface OrderCardProps {
  id: number;
  packageName: string;
  status: OrderStatus;
  scheduledDate: string;
  scheduledTime: string;
  locationAddress: string;
  totalPrice: number;
  carBrand?: string;
  carModel?: string;
  onPress?: () => void;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Pending", color: "#F59E0B", bg: "#FEF3C7" },
  confirmed: { label: "Confirmed", color: "#3B82F6", bg: "#DBEAFE" },
  en_route: { label: "En Route", color: "#8B5CF6", bg: "#EDE9FE" },
  in_progress: { label: "In Progress", color: "#22C55E", bg: "#DCFCE7" },
  finishing: { label: "Finishing", color: "#06B6D4", bg: "#CFFAFE" },
  completed: { label: "Completed", color: "#6B7280", bg: "#F3F4F6" },
  cancelled: { label: "Cancelled", color: "#EF4444", bg: "#FEE2E2" },
};

export function OrderCard({
  id,
  packageName,
  status,
  scheduledDate,
  scheduledTime,
  locationAddress,
  totalPrice,
  carBrand,
  carModel,
  onPress,
}: OrderCardProps) {
  const colors = useColors();
  const cfg = STATUS_CONFIG[status];

  const s = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    orderId: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      letterSpacing: 0.5,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 100,
      backgroundColor: cfg.bg,
      gap: 4,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: cfg.color,
    },
    badgeText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: cfg.color,
    },
    packageName: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 4,
    },
    car: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 6,
    },
    infoText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      flex: 1,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 4,
    },
    price: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    arrow: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <Pressable style={s.card} onPress={onPress}>
      <View style={s.row}>
        <Text style={s.orderId}>Order #{id}</Text>
        <View style={s.badge}>
          <View style={s.dot} />
          <Text style={s.badgeText}>{cfg.label}</Text>
        </View>
      </View>

      <Text style={s.packageName}>{packageName}</Text>
      {carBrand && (
        <Text style={s.car}>
          {carBrand} {carModel}
        </Text>
      )}

      <View style={s.divider} />

      <View style={s.infoRow}>
        <Feather name="calendar" size={14} color={colors.mutedForeground} />
        <Text style={s.infoText}>
          {scheduledDate} · {scheduledTime}
        </Text>
      </View>
      <View style={s.infoRow}>
        <Feather name="map-pin" size={14} color={colors.mutedForeground} />
        <Text style={s.infoText} numberOfLines={1}>
          {locationAddress}
        </Text>
      </View>

      <View style={s.footer}>
        <Text style={s.price}>${totalPrice}</Text>
        <View style={s.arrow}>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
      </View>
    </Pressable>
  );
}
