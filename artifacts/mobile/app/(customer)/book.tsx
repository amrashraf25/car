import { Feather } from "@expo/vector-icons";
import {
  useCreateOrder,
  useGetCars,
  useGetPackages,
} from "@workspace/api-client-react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Ellipse,
  G,
  Path,
  Rect,
} from "react-native-svg";

import { PackageCard } from "@/components/PackageCard";
import { useColors } from "@/hooks/useColors";

const TIME_SLOTS = [
  "Morning (8am–12pm)",
  "Afternoon (12pm–5pm)",
  "Evening (5pm–9pm)",
];

const ADDONS = [
  { id: "roof-polish", name: "Roof Polish", price: 15, zone: "roof" },
  { id: "hood-clean", name: "Hood & Engine Clean", price: 20, zone: "hood" },
  { id: "trunk-vacuum", name: "Trunk Vacuum", price: 10, zone: "trunk" },
  { id: "wheel-polish", name: "Wheel & Tire Polish", price: 15, zone: "wheels" },
  { id: "window-tint-clean", name: "Window Tint Clean", price: 12, zone: "windows" },
  { id: "seat-shampoo", name: "Seat Shampooing", price: 20, zone: "interior" },
  { id: "dashboard-polish", name: "Dashboard Polish", price: 10, zone: "interior" },
  { id: "floor-mat-clean", name: "Floor Mat Deep Clean", price: 12, zone: "interior" },
];

interface Addon {
  id: string;
  name: string;
  price: number;
  zone: string;
}

function InteractiveCar({
  selectedZones,
  onZoneToggle,
  accentColor,
}: {
  selectedZones: string[];
  onZoneToggle: (zone: string) => void;
  accentColor: string;
}) {
  const isSelected = (zone: string) => selectedZones.includes(zone);
  const fill = (zone: string) =>
    isSelected(zone) ? `${accentColor}33` : "transparent";
  const stroke = (zone: string) =>
    isSelected(zone) ? accentColor : "rgba(0,0,0,0.15)";

  return (
    <Svg width="280" height="160" viewBox="0 0 280 160">
      {/* Car body */}
      <Rect x="30" y="70" width="220" height="60" rx="10" fill="#1A1A1A" />
      {/* Cabin */}
      <Path d="M70 80 L85 45 L195 45 L210 80 Z" fill="#2A2A2A" />

      {/* Windshield - windows zone */}
      <Pressable onPress={() => onZoneToggle("windows")}>
        <Path d="M80 78 L92 50 L130 50 L130 78 Z" fill={fill("windows")} stroke={stroke("windows")} strokeWidth="1.5" />
        <Path d="M150 78 L150 50 L188 50 L200 78 Z" fill={fill("windows")} stroke={stroke("windows")} strokeWidth="1.5" />
        <Rect x="130" y="50" width="20" height="28" fill={fill("windows")} stroke={stroke("windows")} strokeWidth="1.5" />
      </Pressable>

      {/* Hood zone */}
      <Pressable onPress={() => onZoneToggle("hood")}>
        <Rect x="30" y="70" width="50" height="35" rx="5" fill={fill("hood")} stroke={stroke("hood")} strokeWidth="1.5" />
      </Pressable>

      {/* Trunk zone */}
      <Pressable onPress={() => onZoneToggle("trunk")}>
        <Rect x="200" y="70" width="50" height="35" rx="5" fill={fill("trunk")} stroke={stroke("trunk")} strokeWidth="1.5" />
      </Pressable>

      {/* Roof zone */}
      <Pressable onPress={() => onZoneToggle("roof")}>
        <Path d="M80 78 L92 50 L188 50 L200 78 Z" fill={fill("roof")} stroke={stroke("roof")} strokeWidth="1.5" />
      </Pressable>

      {/* Interior zone */}
      <Pressable onPress={() => onZoneToggle("interior")}>
        <Rect x="100" y="52" width="80" height="26" rx="4" fill={fill("interior")} stroke={stroke("interior")} strokeWidth="1.5" />
      </Pressable>

      {/* Wheels */}
      <Pressable onPress={() => onZoneToggle("wheels")}>
        <G>
          <Ellipse cx="75" cy="118" rx="22" ry="18" fill={fill("wheels")} stroke={stroke("wheels")} strokeWidth="1.5" />
          <Ellipse cx="75" cy="118" rx="12" ry="10" fill="#2A2A2A" />
          <Ellipse cx="205" cy="118" rx="22" ry="18" fill={fill("wheels")} stroke={stroke("wheels")} strokeWidth="1.5" />
          <Ellipse cx="205" cy="118" rx="12" ry="10" fill="#2A2A2A" />
        </G>
      </Pressable>

      {/* Zone labels */}
      {isSelected("hood") && <Path d="M47 88" />}
    </Svg>
  );
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function BookScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: cars } = useGetCars();
  const { data: packages, isLoading: pkgsLoading } = useGetPackages();
  const createOrder = useCreateOrder();

  const [step, setStep] = useState(0);
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]!,
  );
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]!);
  const [address, setAddress] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  function toggleZone(zone: string) {
    if (selectedZones.includes(zone)) {
      setSelectedZones((z) => z.filter((x) => x !== zone));
      setSelectedAddons((a) => a.filter((x) => x.zone !== zone));
    } else {
      setSelectedZones((z) => [...z, zone]);
      const zoneAddons = ADDONS.filter((a) => a.zone === zone);
      setSelectedAddons((a) => [...a, ...zoneAddons.filter((x) => !a.find((e) => e.id === x.id))]);
    }
  }

  function toggleAddon(addon: Addon) {
    setSelectedAddons((a) =>
      a.find((x) => x.id === addon.id)
        ? a.filter((x) => x.id !== addon.id)
        : [...a, addon],
    );
  }

  const selectedPkg = packages?.find((p) => p.id === selectedPackage);
  const addonsTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
  const total = (selectedPkg?.price ?? 0) + addonsTotal;

  async function handleConfirm() {
    const carId = selectedCar ?? cars?.[0]?.id;
    if (!carId || !selectedPackage || !address) return;
    try {
      await createOrder.mutateAsync({
        data: {
          carId,
          packageId: selectedPackage,
          addons: selectedAddons,
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          locationLat: 37.7749,
          locationLng: -122.4194,
          locationAddress: address,
          totalPrice: total,
        },
      });
      router.replace("/(customer)/orders");
    } catch {}
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingHorizontal: 20,
      paddingBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: { flex: 1 },
    stepLabel: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    title: { fontSize: 22, fontFamily: "Inter_700Bold", color: colors.foreground },
    stepBar: {
      flexDirection: "row",
      gap: 6,
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    stepDot: {
      flex: 1,
      height: 3,
      borderRadius: 2,
      backgroundColor: colors.border,
    },
    stepDotActive: { backgroundColor: colors.primary },
    scroll: { paddingHorizontal: 20, paddingBottom: insets.bottom + 100 },
    label: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 10,
      marginTop: 16,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    timeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    timeBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 100,
      backgroundColor: colors.muted,
      borderWidth: 1.5,
      borderColor: "transparent",
    },
    timeBtnActive: { borderColor: colors.primary, backgroundColor: "transparent" },
    timeText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.foreground },
    calHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    calMonth: { fontSize: 16, fontFamily: "Inter_700Bold", color: colors.foreground },
    calGrid: { flexDirection: "row", flexWrap: "wrap" },
    calDay: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    calDayText: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.foreground },
    calDayActive: { backgroundColor: colors.primary, borderRadius: 20 },
    calDayActiveText: { color: "#FFF", fontFamily: "Inter_600SemiBold" },
    calDayHeader: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: colors.mutedForeground },
    carRow: { flexDirection: "row", gap: 10 },
    carBtn: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    carBtnActive: { borderColor: colors.primary },
    carBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    carBtnSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 2 },
    carSvgArea: { alignItems: "center", marginVertical: 16 },
    addonHint: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 12,
      textAlign: "center",
    },
    addonList: { gap: 8 },
    addonItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.border,
      gap: 10,
    },
    addonItemActive: { borderColor: colors.accent },
    addonName: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium", color: colors.foreground },
    addonPrice: { fontSize: 14, fontFamily: "Inter_700Bold", color: colors.foreground },
    summarySection: { backgroundColor: colors.card, borderRadius: 20, padding: 20, marginBottom: 16 },
    summaryTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: colors.foreground, marginBottom: 12 },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    summaryKey: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    summaryVal: { fontSize: 14, fontFamily: "Inter_500Medium", color: colors.foreground, flex: 1, textAlign: "right" },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    totalLabel: { fontSize: 16, fontFamily: "Inter_700Bold", color: colors.foreground },
    totalAmount: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground },
    nextBtn: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 18,
      alignItems: "center",
      marginTop: 16,
    },
    nextBtnText: { color: colors.primaryForeground, fontSize: 16, fontFamily: "Inter_600SemiBold" },
  });

  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <View style={s.container}>
      <View style={s.header}>
        {step > 0 ? (
          <Pressable style={s.backBtn} onPress={() => setStep((s) => s - 1)}>
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
        <View style={s.headerText}>
          <Text style={s.stepLabel}>Step {step + 1} of 4</Text>
          <Text style={s.title}>
            {["Date & Location", "Choose Package", "Add-ons", "Confirm"][step]}
          </Text>
        </View>
      </View>

      <View style={s.stepBar}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[s.stepDot, i <= step && s.stepDotActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {step === 0 && (
          <>
            {(cars ?? []).length > 0 && (
              <>
                <Text style={s.label}>Select Vehicle</Text>
                <View style={s.carRow}>
                  {(cars ?? []).map((car) => (
                    <Pressable
                      key={car.id}
                      style={[s.carBtn, selectedCar === car.id && s.carBtnActive]}
                      onPress={() => setSelectedCar(car.id)}
                    >
                      <Text style={s.carBtnText}>{car.brand} {car.model}</Text>
                      <Text style={s.carBtnSub}>{car.plateNumber}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <Text style={s.label}>Pick a Date</Text>
            <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16 }}>
              <View style={s.calHeader}>
                <Pressable onPress={() => {
                  if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                  else setCalMonth(m => m - 1);
                }}>
                  <Feather name="chevron-left" size={20} color={colors.foreground} />
                </Pressable>
                <Text style={s.calMonth}>{MONTHS[calMonth]} {calYear}</Text>
                <Pressable onPress={() => {
                  if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                  else setCalMonth(m => m + 1);
                }}>
                  <Feather name="chevron-right" size={20} color={colors.foreground} />
                </Pressable>
              </View>
              <View style={s.calGrid}>
                {DAYS.map((d) => (
                  <View key={d} style={s.calDay}>
                    <Text style={s.calDayHeader}>{d}</Text>
                  </View>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <View key={`empty-${i}`} style={s.calDay} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                  const isSelected = selectedDate === dateStr;
                  return (
                    <Pressable key={d} style={[s.calDay, isSelected && s.calDayActive]} onPress={() => setSelectedDate(dateStr)}>
                      <Text style={[s.calDayText, isSelected && s.calDayActiveText]}>{d}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Text style={s.label}>Time Slot</Text>
            <View style={s.timeRow}>
              {TIME_SLOTS.map((slot) => (
                <Pressable
                  key={slot}
                  style={[s.timeBtn, selectedTime === slot && s.timeBtnActive]}
                  onPress={() => setSelectedTime(slot)}
                >
                  <Text style={s.timeText}>{slot}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={s.label}>Service Address</Text>
            <TextInput
              style={s.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              placeholderTextColor={colors.mutedForeground}
            />

            <Pressable
              style={[s.nextBtn, (!address) && { opacity: 0.5 }]}
              onPress={() => address && setStep(1)}
              disabled={!address}
            >
              <Text style={s.nextBtnText}>Continue</Text>
            </Pressable>
          </>
        )}

        {step === 1 && (
          <>
            {pkgsLoading ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
            ) : (
              (packages ?? []).map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  name={pkg.name}
                  description={pkg.description}
                  price={pkg.price}
                  items={pkg.items}
                  tier={pkg.tier}
                  selected={selectedPackage === pkg.id}
                  onSelect={() => setSelectedPackage(pkg.id)}
                />
              ))
            )}
            <Pressable
              style={[s.nextBtn, !selectedPackage && { opacity: 0.5 }]}
              onPress={() => selectedPackage && setStep(2)}
              disabled={!selectedPackage}
            >
              <Text style={s.nextBtnText}>Continue</Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={s.addonHint}>Tap a zone on the car to add services</Text>
            <View style={s.carSvgArea}>
              <InteractiveCar
                selectedZones={selectedZones}
                onZoneToggle={toggleZone}
                accentColor={colors.accent}
              />
            </View>
            <Text style={s.label}>Available Add-ons</Text>
            <View style={s.addonList}>
              {ADDONS.map((addon) => {
                const active = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <Pressable
                    key={addon.id}
                    style={[s.addonItem, active && s.addonItemActive]}
                    onPress={() => toggleAddon(addon)}
                  >
                    <Feather
                      name={active ? "check-square" : "square"}
                      size={18}
                      color={active ? colors.accent : colors.mutedForeground}
                    />
                    <Text style={s.addonName}>{addon.name}</Text>
                    <Text style={s.addonPrice}>+${addon.price}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable style={s.nextBtn} onPress={() => setStep(3)}>
              <Text style={s.nextBtnText}>
                Continue {selectedAddons.length > 0 ? `(${selectedAddons.length} add-ons)` : ""}
              </Text>
            </Pressable>
          </>
        )}

        {step === 3 && (
          <>
            <View style={s.summarySection}>
              <Text style={s.summaryTitle}>Booking Summary</Text>
              <View style={s.summaryRow}>
                <Text style={s.summaryKey}>Date</Text>
                <Text style={s.summaryVal}>{selectedDate}</Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryKey}>Time</Text>
                <Text style={s.summaryVal}>{selectedTime}</Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryKey}>Address</Text>
                <Text style={s.summaryVal} numberOfLines={1}>{address}</Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryKey}>Package</Text>
                <Text style={s.summaryVal}>{selectedPkg?.name}</Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryKey}>Package Price</Text>
                <Text style={s.summaryVal}>${selectedPkg?.price}</Text>
              </View>
              {selectedAddons.length > 0 && (
                <>
                  <View style={s.divider} />
                  {selectedAddons.map((a) => (
                    <View key={a.id} style={s.summaryRow}>
                      <Text style={s.summaryKey}>{a.name}</Text>
                      <Text style={s.summaryVal}>+${a.price}</Text>
                    </View>
                  ))}
                </>
              )}
              <View style={s.divider} />
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Total</Text>
                <Text style={s.totalAmount}>${total}</Text>
              </View>
            </View>

            <Pressable
              style={[s.nextBtn, createOrder.isPending && { opacity: 0.7 }]}
              onPress={handleConfirm}
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text style={s.nextBtnText}>Confirm Booking</Text>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}
