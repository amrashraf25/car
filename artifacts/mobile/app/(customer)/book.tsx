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
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
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
  const sel = (zone: string) => selectedZones.includes(zone);
  const hl = (zone: string) => sel(zone) ? `${accentColor}44` : "transparent";
  const st = (zone: string) => sel(zone) ? accentColor : "rgba(255,255,255,0.06)";

  const SPOKE_ANGLES = [0, 72, 144, 216, 288];

  function Spokes({ cx, cy }: { cx: number; cy: number }) {
    return (
      <>
        {SPOKE_ANGLES.map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return (
            <Line
              key={i}
              x1={cx + 7 * Math.cos(rad)}
              y1={cy + 7 * Math.sin(rad)}
              x2={cx + 13 * Math.cos(rad)}
              y2={cy + 13 * Math.sin(rad)}
              stroke="#888"
              strokeWidth="2"
            />
          );
        })}
      </>
    );
  }

  return (
    <Svg width="310" height="148" viewBox="0 0 310 148">
      <Defs>
        <LinearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#2A2A2A" stopOpacity="1" />
          <Stop offset="1" stopColor="#141414" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Ground shadow */}
      <Ellipse cx="155" cy="138" rx="128" ry="9" fill="rgba(0,0,0,0.22)" />

      {/* === BASE CAR === */}
      {/* Lower body */}
      <Path
        d="M20 104 Q20 88 30 86 L60 86 Q72 66 92 50 Q110 38 130 36 L182 36 Q202 36 218 48 Q232 58 242 76 L268 80 Q280 82 282 92 L282 104 Q260 102 240 100 Q220 120 185 122 L125 122 Q90 120 68 100 Q44 102 20 104 Z"
        fill="url(#bodyGrad)"
        stroke="#333"
        strokeWidth="0.5"
      />

      {/* Cabin glass house */}
      <Path
        d="M68 84 Q80 60 98 46 L128 38 L184 38 Q204 38 218 52 Q228 64 232 80 L232 84 Z"
        fill="#222"
      />

      {/* Windshield (front/right) */}
      <Path
        d="M190 80 L192 40 Q200 38 214 50 L228 72 L228 80 Z"
        fill="rgba(140,180,220,0.32)"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="0.5"
      />

      {/* Center window */}
      <Rect x="136" y="40" width="52" height="40" rx="1"
        fill="rgba(140,180,220,0.28)"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="0.5"
      />

      {/* Rear window (left side) */}
      <Path
        d="M78 80 L78 44 Q90 38 102 40 L132 40 L132 80 Z"
        fill="rgba(140,180,220,0.24)"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="0.5"
      />

      {/* Door seam */}
      <Line x1="136" y1="80" x2="136" y2="110" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

      {/* Body highlight */}
      <Path
        d="M42 86 Q100 76 155 74 Q210 74 262 80"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="2"
        fill="none"
      />

      {/* Front wheel */}
      <Ellipse cx="238" cy="116" rx="26" ry="14" fill="#111" />
      <Circle cx="238" cy="116" r="20" fill="#1E1E1E" />
      <Circle cx="238" cy="116" r="14" fill="#2A2A2A" />
      <Circle cx="238" cy="116" r="6" fill="#141414" />
      <Spokes cx={238} cy={116} />

      {/* Rear wheel */}
      <Ellipse cx="68" cy="116" rx="26" ry="14" fill="#111" />
      <Circle cx="68" cy="116" r="20" fill="#1E1E1E" />
      <Circle cx="68" cy="116" r="14" fill="#2A2A2A" />
      <Circle cx="68" cy="116" r="6" fill="#141414" />
      <Spokes cx={68} cy={116} />

      {/* Front DRL (right) */}
      <Rect x="268" y="84" width="14" height="3" rx="1.5" fill="#FFF9C4" opacity="0.95" />
      <Rect x="268" y="89" width="12" height="2" rx="1" fill="#FFF" opacity="0.4" />

      {/* Rear taillights (left) */}
      <Rect x="22" y="84" width="12" height="4" rx="2" fill="#FF2222" opacity="0.9" />

      {/* === PRESSABLE ZONE OVERLAYS === */}

      {/* Hood (front/right) */}
      <Pressable onPress={() => onZoneToggle("hood")}>
        <Path
          d="M216 84 L264 84 L264 108 Q252 114 238 114 Q222 112 214 100 Z"
          fill={hl("hood")} stroke={st("hood")} strokeWidth="1.5"
        />
        {sel("hood") && (
          <SvgText x="240" y="100" textAnchor="middle" fontSize="9" fill={accentColor} fontWeight="bold">Hood</SvgText>
        )}
      </Pressable>

      {/* Trunk (rear/left) */}
      <Pressable onPress={() => onZoneToggle("trunk")}>
        <Path
          d="M36 84 L62 84 L70 96 Q60 110 48 112 Q34 110 24 100 L24 90 Z"
          fill={hl("trunk")} stroke={st("trunk")} strokeWidth="1.5"
        />
        {sel("trunk") && (
          <SvgText x="46" y="98" textAnchor="middle" fontSize="9" fill={accentColor} fontWeight="bold">Trunk</SvgText>
        )}
      </Pressable>

      {/* Roof */}
      <Pressable onPress={() => onZoneToggle("roof")}>
        <Rect x="100" y="38" width="100" height="22" rx="4"
          fill={hl("roof")} stroke={st("roof")} strokeWidth="1.5"
        />
        {sel("roof") && (
          <SvgText x="150" y="53" textAnchor="middle" fontSize="9" fill={accentColor} fontWeight="bold">Roof</SvgText>
        )}
      </Pressable>

      {/* Interior */}
      <Pressable onPress={() => onZoneToggle("interior")}>
        <Rect x="100" y="62" width="100" height="20" rx="3"
          fill={hl("interior")} stroke={st("interior")} strokeWidth="1.5"
        />
        {sel("interior") && (
          <SvgText x="150" y="75" textAnchor="middle" fontSize="9" fill={accentColor} fontWeight="bold">Interior</SvgText>
        )}
      </Pressable>

      {/* Windows */}
      <Pressable onPress={() => onZoneToggle("windows")}>
        <Path
          d="M78 40 L78 80 L190 80 L190 40 Z"
          fill={hl("windows")} stroke={st("windows")} strokeWidth="1.5"
        />
        {sel("windows") && (
          <SvgText x="134" y="63" textAnchor="middle" fontSize="9" fill={accentColor} fontWeight="bold">Windows</SvgText>
        )}
      </Pressable>

      {/* Wheels (both) */}
      <Pressable onPress={() => onZoneToggle("wheels")}>
        <G>
          <Circle cx="238" cy="116" r="20" fill={hl("wheels")} stroke={st("wheels")} strokeWidth="1.5" />
          <Circle cx="68" cy="116" r="20" fill={hl("wheels")} stroke={st("wheels")} strokeWidth="1.5" />
        </G>
        {sel("wheels") && (
          <SvgText x="155" y="138" textAnchor="middle" fontSize="9" fill={accentColor} fontWeight="bold">Wheels</SvgText>
        )}
      </Pressable>
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
      fontFamily: "DMSans_500Medium",
      color: colors.mutedForeground,
    },
    title: { fontSize: 22, fontFamily: "DMSans_700Bold", color: colors.foreground },
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
      fontFamily: "DMSans_500Medium",
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
      fontFamily: "DMSans_400Regular",
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
    timeText: { fontSize: 13, fontFamily: "DMSans_500Medium", color: colors.foreground },
    calHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    calMonth: { fontSize: 16, fontFamily: "DMSans_700Bold", color: colors.foreground },
    calGrid: { flexDirection: "row", flexWrap: "wrap" },
    calDay: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    calDayText: { fontSize: 14, fontFamily: "DMSans_400Regular", color: colors.foreground },
    calDayActive: { backgroundColor: colors.primary, borderRadius: 20 },
    calDayActiveText: { color: "#FFF", fontFamily: "DMSans_600SemiBold" },
    calDayHeader: { fontSize: 11, fontFamily: "DMSans_600SemiBold", color: colors.mutedForeground },
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
    carBtnText: { fontSize: 14, fontFamily: "DMSans_600SemiBold", color: colors.foreground },
    carBtnSub: { fontSize: 12, fontFamily: "DMSans_400Regular", color: colors.mutedForeground, marginTop: 2 },
    carSvgArea: { alignItems: "center", marginVertical: 16 },
    addonHint: {
      fontSize: 13,
      fontFamily: "DMSans_400Regular",
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
    addonName: { flex: 1, fontSize: 14, fontFamily: "DMSans_500Medium", color: colors.foreground },
    addonPrice: { fontSize: 14, fontFamily: "DMSans_700Bold", color: colors.foreground },
    summarySection: { backgroundColor: colors.card, borderRadius: 20, padding: 20, marginBottom: 16 },
    summaryTitle: { fontSize: 16, fontFamily: "DMSans_700Bold", color: colors.foreground, marginBottom: 12 },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    summaryKey: { fontSize: 14, fontFamily: "DMSans_400Regular", color: colors.mutedForeground },
    summaryVal: { fontSize: 14, fontFamily: "DMSans_500Medium", color: colors.foreground, flex: 1, textAlign: "right" },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    totalLabel: { fontSize: 16, fontFamily: "DMSans_700Bold", color: colors.foreground },
    totalAmount: { fontSize: 28, fontFamily: "DMSans_700Bold", color: colors.foreground },
    nextBtn: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 18,
      alignItems: "center",
      marginTop: 16,
    },
    nextBtnText: { color: colors.primaryForeground, fontSize: 16, fontFamily: "DMSans_600SemiBold" },
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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

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
