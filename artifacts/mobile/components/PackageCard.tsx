import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface PackageCardProps {
  name: string;
  description: string;
  price: number;
  items: string[];
  tier: "basic" | "full" | "premium";
  selected?: boolean;
  onSelect?: () => void;
}

const TIER_CONFIG = {
  basic: { label: "Basic", accent: "#9CA3AF" },
  full: { label: "Full Detail", accent: "#3B82F6" },
  premium: { label: "Premium", accent: "#D4A843" },
};

export function PackageCard({
  name,
  description,
  price,
  items,
  tier,
  selected,
  onSelect,
}: PackageCardProps) {
  const colors = useColors();
  const cfg = TIER_CONFIG[tier];

  const s = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: selected ? colors.primary : "transparent",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    nameCol: { flex: 1 },
    tier: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: cfg.accent,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 4,
    },
    name: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    priceCol: { alignItems: "flex-end" },
    price: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: selected ? colors.primary : colors.foreground,
    },
    perText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    description: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 16,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 12,
    },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 6,
    },
    itemText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    footer: {
      marginTop: 16,
    },
    selectBtn: {
      backgroundColor: selected ? colors.primary : colors.muted,
      borderRadius: 100,
      paddingVertical: 12,
      alignItems: "center",
    },
    selectBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: selected ? colors.primaryForeground : colors.mutedForeground,
    },
  });

  return (
    <Pressable style={s.card} onPress={onSelect}>
      <View style={s.headerRow}>
        <View style={s.nameCol}>
          <Text style={s.tier}>{cfg.label}</Text>
          <Text style={s.name}>{name}</Text>
        </View>
        <View style={s.priceCol}>
          <Text style={s.price}>${price}</Text>
          <Text style={s.perText}>per visit</Text>
        </View>
      </View>

      <Text style={s.description}>{description}</Text>

      <View style={s.divider} />

      {items.slice(0, 4).map((item, i) => (
        <View key={i} style={s.itemRow}>
          <Feather name="check" size={14} color={colors.accent} />
          <Text style={s.itemText}>{item}</Text>
        </View>
      ))}
      {items.length > 4 && (
        <View style={s.itemRow}>
          <Feather name="plus" size={14} color={colors.mutedForeground} />
          <Text style={[s.itemText, { color: colors.mutedForeground }]}>
            {items.length - 4} more included
          </Text>
        </View>
      )}

      <View style={s.footer}>
        <View style={s.selectBtn}>
          <Text style={s.selectBtnText}>
            {selected ? "Selected" : "Select Package"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
