import { Feather } from "@expo/vector-icons";
import { useGetWorkers } from "@workspace/api-client-react";
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

const STATUS_CONFIG = {
  available: { label: "Available", color: "#22C55E", bg: "#DCFCE7" },
  busy: { label: "Busy", color: "#F59E0B", bg: "#FEF3C7" },
  offline: { label: "Offline", color: "#9CA3AF", bg: "#F3F4F6" },
};

export default function AdminWorkers() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { data: workers, isLoading } = useGetWorkers();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    title: { fontSize: 28, fontFamily: "DMSans_700Bold", color: colors.foreground },
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
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { color: "#FFF", fontSize: 20, fontFamily: "DMSans_700Bold" },
    info: { flex: 1 },
    name: { fontSize: 16, fontFamily: "DMSans_700Bold", color: colors.foreground },
    email: { fontSize: 13, fontFamily: "DMSans_400Regular", color: colors.mutedForeground, marginTop: 2 },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 100,
    },
    dot: { width: 7, height: 7, borderRadius: 3.5 },
    badgeText: { fontSize: 12, fontFamily: "DMSans_600SemiBold" },
    empty: { alignItems: "center", paddingVertical: 48 },
    emptyText: { fontSize: 16, fontFamily: "DMSans_400Regular", color: colors.mutedForeground, marginTop: 12 },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Workers</Text>
      </View>

      {isLoading ? (
        <View style={s.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {(workers ?? []).length === 0 ? (
            <View style={s.empty}>
              <Feather name="users" size={48} color={colors.border} />
              <Text style={s.emptyText}>No workers yet</Text>
            </View>
          ) : (
            (workers ?? []).map((w) => {
              const cfg = STATUS_CONFIG[w.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.offline;
              return (
                <View key={w.id} style={s.card}>
                  <View style={s.avatar}>
                    <Text style={s.avatarText}>
                      {w.user?.name?.[0]?.toUpperCase() ?? "W"}
                    </Text>
                  </View>
                  <View style={s.info}>
                    <Text style={s.name}>{w.user?.name ?? "Worker"}</Text>
                    <Text style={s.email}>{w.user?.email ?? ""}</Text>
                  </View>
                  <View style={[s.badge, { backgroundColor: cfg.bg }]}>
                    <View style={[s.dot, { backgroundColor: cfg.color }]} />
                    <Text style={[s.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}
