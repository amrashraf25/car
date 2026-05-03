import { Feather } from "@expo/vector-icons";
import { useGetCars, useGetOrders } from "@workspace/api-client-react";
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

import { CarSilhouette } from "@/components/CarSilhouette";
import { OrderCard } from "@/components/OrderCard";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const QUICK_ACTIONS = [
  { icon: "star" as const, label: "Book", route: "/(customer)/book" },
  { icon: "navigation" as const, label: "Track", route: "/(customer)/track" },
  { icon: "truck" as const, label: "My Cars", route: "/(customer)/cars" },
  { icon: "clock" as const, label: "History", route: "/(customer)/orders" },
] as const;

export default function CustomerHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const { data: cars } = useGetCars();
  const { data: orders } = useGetOrders();

  const primaryCar = cars?.[0];
  const recentOrders = orders?.slice(0, 3) ?? [];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1 },
    content: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingBottom: insets.bottom + 100,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 28,
    },
    greeting: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 2,
    },
    name: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontFamily: "Inter_700Bold",
    },
    carCard: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
      overflow: "hidden",
    },
    carCardLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: "rgba(255,255,255,0.6)",
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 4,
    },
    carName: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    carPlate: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.6)",
    },
    carIllustration: { alignItems: "center", marginTop: 16 },
    noCar: {
      alignItems: "center",
      paddingVertical: 32,
    },
    noCarText: {
      color: "rgba(255,255,255,0.7)",
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      marginBottom: 12,
    },
    addCarBtn: {
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 100,
    },
    addCarBtnText: {
      color: "#FFF",
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 28,
    },
    actionBtn: {
      flex: 1,
      minWidth: "44%",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
      gap: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    actionLabel: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    seeAll: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      paddingVertical: 24,
    },
  });

  return (
    <View style={s.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.content}>
          <View style={s.header}>
            <View>
              <Text style={s.greeting}>{greeting()}</Text>
              <Text style={s.name}>{user?.name ?? "User"}</Text>
            </View>
            <View style={s.avatar}>
              <Text style={s.avatarText}>
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </Text>
            </View>
          </View>

          <View style={s.carCard}>
            {primaryCar ? (
              <>
                <Text style={s.carCardLabel}>Your Vehicle</Text>
                <Text style={s.carName}>
                  {primaryCar.brand} {primaryCar.model}
                </Text>
                <Text style={s.carPlate}>{primaryCar.plateNumber}</Text>
                <View style={s.carIllustration}>
                  <CarSilhouette
                    color={primaryCar.color}
                    carType={primaryCar.carType}
                    size={180}
                  />
                </View>
              </>
            ) : (
              <View style={s.noCar}>
                <Text style={s.noCarText}>No car added yet</Text>
                <Pressable
                  style={s.addCarBtn}
                  onPress={() => router.push("/(customer)/cars")}
                >
                  <Text style={s.addCarBtnText}>Add Your Car</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={s.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.label}
                style={s.actionBtn}
                onPress={() => router.push(action.route as never)}
              >
                <View style={s.actionIcon}>
                  <Feather
                    name={action.icon}
                    size={20}
                    color={colors.foreground}
                  />
                </View>
                <Text style={s.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Recent Orders</Text>
            <Pressable onPress={() => router.push("/(customer)/orders")}>
              <Text style={s.seeAll}>See all</Text>
            </Pressable>
          </View>

          {recentOrders.length === 0 ? (
            <Text style={s.emptyText}>No orders yet. Book your first cleaning!</Text>
          ) : (
            recentOrders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                packageName={order.packageName}
                status={order.status as never}
                scheduledDate={order.scheduledDate}
                scheduledTime={order.scheduledTime}
                locationAddress={order.locationAddress}
                totalPrice={order.totalPrice}
                carBrand={order.car?.brand}
                carModel={order.car?.model}
                onPress={() =>
                  router.push(`/(customer)/track?orderId=${order.id}`)
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
