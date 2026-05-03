import { Feather } from "@expo/vector-icons";
import { useGetCars, useGetOrders } from "@workspace/api-client-react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
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

import { OrderCard } from "@/components/OrderCard";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const CAR_IMAGE = "https://images.unsplash.com/photo-1669215420560-9bac2f6c3f50?w=700&q=80&auto=format&fit=crop";

const QUICK_ACTIONS = [
  { icon: "calendar" as const, label: "Book", route: "/(customer)/book" },
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
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
      marginBottom: 2,
    },
    name: {
      fontSize: 26,
      fontFamily: "PlayfairDisplay_700Bold",
      color: colors.foreground,
    },
    headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
    bellBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    bellDot: {
      position: "absolute",
      top: 8,
      right: 9,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#EF4444",
      borderWidth: 1.5,
      borderColor: colors.background,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontFamily: "DMSans_700Bold",
    },
    carCard: {
      borderRadius: 24,
      padding: 24,
      marginBottom: 20,
      overflow: "hidden",
    },
    carCardLabel: {
      fontSize: 10,
      fontFamily: "DMSans_600SemiBold",
      color: "rgba(255,255,255,0.5)",
      textTransform: "uppercase",
      letterSpacing: 2,
      marginBottom: 6,
    },
    carName: {
      fontSize: 22,
      fontFamily: "PlayfairDisplay_700Bold",
      color: "#FFFFFF",
      marginBottom: 3,
    },
    carPlate: {
      fontSize: 13,
      fontFamily: "DMSans_400Regular",
      color: "rgba(255,255,255,0.5)",
      letterSpacing: 1,
    },
    carImg: {
      width: "100%",
      height: 120,
      marginVertical: 12,
    },
    carStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    greenDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: "#22C55E",
    },
    carStatusText: {
      fontSize: 12,
      fontFamily: "DMSans_500Medium",
      color: "rgba(255,255,255,0.6)",
    },
    noCar: { alignItems: "center", paddingVertical: 28 },
    noCarText: {
      color: "rgba(255,255,255,0.6)",
      fontSize: 14,
      fontFamily: "DMSans_400Regular",
      marginBottom: 14,
    },
    addCarBtn: {
      backgroundColor: "rgba(255,255,255,0.12)",
      paddingHorizontal: 22,
      paddingVertical: 11,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    addCarBtnText: {
      color: "#FFF",
      fontSize: 14,
      fontFamily: "DMSans_600SemiBold",
    },
    actionsGrid: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    actionBtn: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingVertical: 18,
      alignItems: "center",
      gap: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    actionLabel: {
      fontSize: 12,
      fontFamily: "DMSans_600SemiBold",
      color: colors.foreground,
    },
    bookBanner: {
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 28,
    },
    bookBannerText: {
      fontSize: 16,
      fontFamily: "PlayfairDisplay_700Bold",
      color: "#FFFFFF",
    },
    bookBannerSub: {
      fontSize: 12,
      fontFamily: "DMSans_400Regular",
      color: "rgba(255,255,255,0.6)",
      marginTop: 2,
    },
    bookBannerArrow: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: "rgba(255,255,255,0.15)",
      alignItems: "center",
      justifyContent: "center",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "PlayfairDisplay_700Bold",
      color: colors.foreground,
    },
    seeAll: {
      fontSize: 13,
      fontFamily: "DMSans_500Medium",
      color: colors.mutedForeground,
    },
    emptyCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 32,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      marginTop: 10,
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
              <Text style={s.name}>{user?.name ?? "Welcome"}</Text>
            </View>
            <View style={s.headerRight}>
              <View style={s.bellBtn}>
                <Feather name="bell" size={18} color={colors.foreground} />
                <View style={s.bellDot} />
              </View>
              <View style={s.avatar}>
                <Text style={s.avatarText}>
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </Text>
              </View>
            </View>
          </View>

          <LinearGradient
            colors={["#141414", "#242424"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.carCard}
          >
            {primaryCar ? (
              <>
                <Text style={s.carCardLabel}>Your Vehicle</Text>
                <Text style={s.carName}>
                  {primaryCar.brand} {primaryCar.model}
                </Text>
                <Text style={s.carPlate}>{primaryCar.plateNumber}</Text>
                <Image
                  source={{ uri: CAR_IMAGE }}
                  style={s.carImg}
                  contentFit="contain"
                  transition={400}
                />
                <View style={s.carStatus}>
                  <View style={s.greenDot} />
                  <Text style={s.carStatusText}>Parked · Home</Text>
                </View>
              </>
            ) : (
              <View style={s.noCar}>
                <Text style={s.noCarText}>No vehicle added yet</Text>
                <Pressable
                  style={s.addCarBtn}
                  onPress={() => router.push("/(customer)/cars")}
                >
                  <Text style={s.addCarBtnText}>Add Your Car</Text>
                </Pressable>
              </View>
            )}
          </LinearGradient>

          <View style={s.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.label}
                style={s.actionBtn}
                onPress={() => router.push(action.route as never)}
              >
                <View style={s.actionIcon}>
                  <Feather name={action.icon} size={18} color={colors.foreground} />
                </View>
                <Text style={s.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={() => router.push("/(customer)/book")}>
            <LinearGradient
              colors={["#0F0F0F", "#2A2A2A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.bookBanner}
            >
              <View>
                <Text style={s.bookBannerText}>Book a Cleaning</Text>
                <Text style={s.bookBannerSub}>Premium service at your door</Text>
              </View>
              <View style={s.bookBannerArrow}>
                <Feather name="arrow-right" size={18} color="#FFF" />
              </View>
            </LinearGradient>
          </Pressable>

          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Recent Orders</Text>
            <Pressable onPress={() => router.push("/(customer)/orders")}>
              <Text style={s.seeAll}>See all</Text>
            </Pressable>
          </View>

          {recentOrders.length === 0 ? (
            <View style={s.emptyCard}>
              <Feather name="calendar" size={36} color={colors.border} />
              <Text style={s.emptyText}>No orders yet.{"\n"}Book your first cleaning!</Text>
            </View>
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
