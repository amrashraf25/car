import { Feather } from "@expo/vector-icons";
import { useGetAdminCustomers } from "@workspace/api-client-react";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function AdminCustomers() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { data: customers, isLoading } = useGetAdminCustomers();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    title: { fontSize: 28, fontFamily: "DMSans_700Bold", color: colors.foreground },
    subtitle: {
      fontSize: 13,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
    },
    loading: { flex: 1, alignItems: "center", justifyContent: "center" },
    scroll: { paddingHorizontal: 20, paddingBottom: insets.bottom + 100 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { fontSize: 18, fontFamily: "DMSans_700Bold", color: colors.foreground },
    info: { flex: 1 },
    name: { fontSize: 16, fontFamily: "DMSans_600SemiBold", color: colors.foreground },
    email: { fontSize: 13, fontFamily: "DMSans_400Regular", color: colors.mutedForeground, marginTop: 2 },
    joinDate: { fontSize: 12, fontFamily: "DMSans_400Regular", color: colors.mutedForeground, marginTop: 2 },
    empty: { alignItems: "center", paddingVertical: 48 },
    emptyText: { fontSize: 16, fontFamily: "DMSans_400Regular", color: colors.mutedForeground, marginTop: 12 },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Customers</Text>
        <Text style={s.subtitle}>{(customers ?? []).length} registered</Text>
      </View>

      {isLoading ? (
        <View style={s.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {(customers ?? []).length === 0 ? (
            <View style={s.empty}>
              <Feather name="users" size={48} color={colors.border} />
              <Text style={s.emptyText}>No customers yet</Text>
            </View>
          ) : (
            (customers ?? []).map((c) => (
              <View key={c.id} style={s.card}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{c.name[0]?.toUpperCase() ?? "C"}</Text>
                </View>
                <View style={s.info}>
                  <Text style={s.name}>{c.name}</Text>
                  <Text style={s.email}>{c.email}</Text>
                  <Text style={s.joinDate}>
                    Joined {new Date(c.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.border} />
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
