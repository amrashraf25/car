import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function WorkerProfile() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingBottom: insets.bottom + 100 },
    hero: {
      alignItems: "center",
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 40),
      paddingBottom: 32,
    },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    avatarText: { color: "#FFF", fontSize: 32, fontFamily: "Inter_700Bold" },
    name: { fontSize: 24, fontFamily: "Inter_700Bold", color: colors.foreground, marginBottom: 4 },
    email: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginBottom: 12 },
    badge: { backgroundColor: colors.muted, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100 },
    badgeText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    logoutBtn: {
      marginHorizontal: 20,
      backgroundColor: colors.destructive,
      borderRadius: 100,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 24,
    },
    logoutText: { color: "#FFF", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  });

  return (
    <View style={s.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{user?.name?.[0]?.toUpperCase() ?? "W"}</Text>
          </View>
          <Text style={s.name}>{user?.name}</Text>
          <Text style={s.email}>{user?.email}</Text>
          <View style={s.badge}>
            <Text style={s.badgeText}>Detailer</Text>
          </View>
        </View>
        <Pressable style={s.logoutBtn} onPress={logout}>
          <Text style={s.logoutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
