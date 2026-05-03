import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  basic: {
    label: "BASIC",
    accentColor: "#9CA3AF",
    borderColor: "#D1D5DB",
    badge: null,
  },
  full: {
    label: "FULL DETAIL",
    accentColor: "#3B82F6",
    borderColor: "#BFDBFE",
    badge: "Most Popular",
  },
  premium: {
    label: "PLATINUM",
    accentColor: "#C9A84C",
    borderColor: "#C9A84C",
    badge: "✦ Premium",
  },
};

export function PackageCard({ name, description, price, items, tier, selected, onSelect }: PackageCardProps) {
  const colors = useColors();
  const cfg = TIER_CONFIG[tier];
  const isPremium = tier === "premium";

  const s = StyleSheet.create({
    wrapper: { marginBottom: 14 },
    card: {
      backgroundColor: isPremium ? "#FFFBF0" : colors.card,
      borderRadius: 20,
      padding: 20,
      borderWidth: selected ? 2 : 1.5,
      borderColor: selected ? cfg.accentColor : (isPremium ? "#E8D99A" : colors.border),
      shadowColor: isPremium ? "#C9A84C" : "#000",
      shadowOffset: { width: 0, height: selected ? 6 : 2 },
      shadowOpacity: isPremium ? 0.12 : 0.06,
      shadowRadius: selected ? 16 : 8,
      elevation: selected ? 6 : 2,
    },
    topAccentBar: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 4,
      height: "100%",
      backgroundColor: cfg.accentColor,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    },
    badgeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    tierLabel: {
      fontSize: 10,
      fontFamily: "DMSans_600SemiBold",
      color: cfg.accentColor,
      letterSpacing: 1.5,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 100,
      backgroundColor: isPremium ? "#C9A84C" : "#EFF6FF",
    },
    badgeText: {
      fontSize: 11,
      fontFamily: "DMSans_600SemiBold",
      color: isPremium ? "#FFF" : "#3B82F6",
    },
    nameRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 6,
    },
    name: {
      fontSize: 20,
      fontFamily: "PlayfairDisplay_700Bold",
      color: colors.foreground,
      flex: 1,
    },
    priceCol: { alignItems: "flex-end" },
    price: {
      fontSize: 28,
      fontFamily: "PlayfairDisplay_700Bold",
      color: selected ? cfg.accentColor : colors.foreground,
    },
    perText: {
      fontSize: 11,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
      textAlign: "right",
    },
    description: {
      fontSize: 13,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
      marginBottom: 14,
      lineHeight: 18,
    },
    divider: { height: 1, backgroundColor: isPremium ? "#F0E4BC" : colors.border, marginBottom: 12 },
    itemRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 7 },
    itemText: { fontSize: 13, fontFamily: "DMSans_400Regular", color: colors.foreground },
    footer: { marginTop: 14 },
    selectBtn: {
      borderRadius: 100,
      paddingVertical: 13,
      alignItems: "center",
      backgroundColor: selected ? cfg.accentColor : (isPremium ? "rgba(201,168,76,0.1)" : colors.muted),
      borderWidth: isPremium && !selected ? 1.5 : 0,
      borderColor: cfg.accentColor,
    },
    selectBtnText: {
      fontSize: 14,
      fontFamily: "DMSans_600SemiBold",
      color: selected ? "#FFF" : (isPremium ? cfg.accentColor : colors.mutedForeground),
    },
  });

  return (
    <View style={s.wrapper}>
      <Pressable style={s.card} onPress={onSelect}>
        <View style={s.topAccentBar} />
        <View style={{ paddingLeft: 8 }}>
          <View style={s.badgeRow}>
            <Text style={s.tierLabel}>{cfg.label}</Text>
            {cfg.badge && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{cfg.badge}</Text>
              </View>
            )}
          </View>

          <View style={s.nameRow}>
            <Text style={s.name}>{name}</Text>
            <View style={s.priceCol}>
              <Text style={s.price}>${price}</Text>
              <Text style={s.perText}>per visit</Text>
            </View>
          </View>

          <Text style={s.description}>{description}</Text>

          <View style={s.divider} />

          {items.slice(0, 4).map((item, i) => (
            <View key={i} style={s.itemRow}>
              <Feather name="check" size={14} color={cfg.accentColor} />
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
              <Text style={s.selectBtnText}>{selected ? "✓  Selected" : "Select Package"}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
