import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const router = useRouter();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingBottom: insets.bottom + 100 },
    heroSection: {
      alignItems: "center",
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 40),
      paddingBottom: 32,
      paddingHorizontal: 20,
    },
    avatarRing: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    avatarText: {
      color: colors.primaryForeground,
      fontSize: 32,
      fontFamily: "Inter_700Bold",
    },
    name: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    roleBadge: {
      backgroundColor: colors.muted,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 100,
    },
    roleText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      textTransform: "capitalize",
    },
    section: {
      marginHorizontal: 20,
      backgroundColor: colors.card,
      borderRadius: 20,
      marginBottom: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 14,
    },
    menuDivider: { height: 1, backgroundColor: colors.border, marginHorizontal: 20 },
    menuText: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    destructiveText: { color: colors.destructive },
    logoutBtn: {
      marginHorizontal: 20,
      backgroundColor: colors.destructive,
      borderRadius: 100,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 8,
    },
    logoutText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
  });

  const menuItems = [
    { icon: "truck" as const, label: "My Cars", onPress: () => router.push("/(customer)/cars") },
    { icon: "list" as const, label: "Order History", onPress: () => router.push("/(customer)/orders") },
  ];

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.heroSection}>
          <View style={s.avatarRing}>
            <Text style={s.avatarText}>
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </Text>
          </View>
          <Text style={s.name}>{user?.name}</Text>
          <Text style={s.email}>{user?.email}</Text>
          <View style={s.roleBadge}>
            <Text style={s.roleText}>{user?.role}</Text>
          </View>
        </View>

        <View style={s.section}>
          {menuItems.map((item, i) => (
            <React.Fragment key={item.label}>
              <Pressable style={s.menuItem} onPress={item.onPress}>
                <Feather name={item.icon} size={20} color={colors.mutedForeground} />
                <Text style={s.menuText}>{item.label}</Text>
                <Feather name="chevron-right" size={16} color={colors.border} />
              </Pressable>
              {i < menuItems.length - 1 && <View style={s.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        <Pressable style={s.logoutBtn} onPress={logout}>
          <Text style={s.logoutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
