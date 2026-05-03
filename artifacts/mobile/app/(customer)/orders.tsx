import { useGetOrders } from "@workspace/api-client-react";
import { useRouter } from "expo-router";
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

import { OrderCard } from "@/components/OrderCard";
import { useColors } from "@/hooks/useColors";

export default function OrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: orders, isLoading } = useGetOrders();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    title: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground },
    scroll: { paddingHorizontal: 20, paddingBottom: insets.bottom + 100 },
    loading: { flex: 1, alignItems: "center", justifyContent: "center" },
    empty: { alignItems: "center", paddingVertical: 48 },
    emptyText: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>My Orders</Text>
      </View>

      {isLoading ? (
        <View style={s.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {(orders ?? []).length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>No orders yet</Text>
            </View>
          ) : (
            (orders ?? []).map((order) => (
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
        </ScrollView>
      )}
    </View>
  );
}
