import { Feather } from "@expo/vector-icons";
import {
  useCreateCar,
  useDeleteCar,
  useGetCars,
} from "@workspace/api-client-react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CarSilhouette } from "@/components/CarSilhouette";
import { useColors } from "@/hooks/useColors";

const BRANDS = ["Toyota", "BMW", "Mercedes", "Volvo", "Audi", "Tesla", "Porsche", "Range Rover"];
const CAR_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "truck", label: "Truck" },
  { value: "hatchback", label: "Hatchback" },
] as const;
const COLORS = [
  { hex: "#1A1A1A", name: "Matte Black" },
  { hex: "#FFFFFF", name: "Pearl White" },
  { hex: "#C0C0C0", name: "Silver" },
  { hex: "#8B0000", name: "Deep Red" },
  { hex: "#003153", name: "Prussian Blue" },
  { hex: "#2E8B57", name: "Forest Green" },
  { hex: "#D4A843", name: "Champagne" },
  { hex: "#4A4A4A", name: "Graphite" },
];

export default function CarsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { data: cars, refetch } = useGetCars();
  const createCar = useCreateCar();
  const deleteCar = useDeleteCar();

  const [showModal, setShowModal] = useState(false);
  const [brand, setBrand] = useState(BRANDS[0]!);
  const [model, setModel] = useState("");
  const [color, setColor] = useState(COLORS[0]!.hex);
  const [plateNumber, setPlateNumber] = useState("");
  const [carType, setCarType] = useState<"sedan" | "suv" | "truck" | "hatchback">("sedan");

  async function handleAdd() {
    if (!model || !plateNumber) return;
    try {
      await createCar.mutateAsync({
        data: { brand, model, color, plateNumber, carType },
      });
      setShowModal(false);
      setModel("");
      setPlateNumber("");
      refetch();
    } catch {}
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingHorizontal: 20,
      paddingBottom: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground },
    addBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    scroll: { paddingHorizontal: 20, paddingBottom: insets.bottom + 100 },
    carCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    carRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    carInfo: { flex: 1 },
    carName: { fontSize: 20, fontFamily: "Inter_700Bold", color: colors.foreground },
    carDetail: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 4 },
    colorDot: { width: 16, height: 16, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: colors.border },
    illustration: { alignItems: "center", marginTop: 16 },
    deleteBtn: { padding: 8 },
    empty: { alignItems: "center", paddingVertical: 48 },
    emptyText: { fontSize: 16, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 12 },
    modal: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: insets.bottom + 24,
    },
    sheetTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: colors.foreground, marginBottom: 24 },
    label: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor: colors.muted,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      marginBottom: 16,
    },
    brandRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 100,
      backgroundColor: colors.muted,
      borderWidth: 1.5,
      borderColor: "transparent",
    },
    chipActive: { borderColor: colors.primary, backgroundColor: colors.primary },
    chipText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.foreground },
    chipTextActive: { color: colors.primaryForeground },
    colorRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
    colorSwatch: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 3,
      borderColor: "transparent",
    },
    colorSwatchActive: { borderColor: colors.accent },
    preview: { alignItems: "center", marginBottom: 16 },
    saveBtn: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 16,
      alignItems: "center",
    },
    saveBtnText: { color: colors.primaryForeground, fontSize: 16, fontFamily: "Inter_600SemiBold" },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>My Cars</Text>
        <Pressable style={s.addBtn} onPress={() => setShowModal(true)}>
          <Feather name="plus" size={20} color={colors.primaryForeground} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {(cars ?? []).length === 0 ? (
          <View style={s.empty}>
            <Feather name="truck" size={48} color={colors.border} />
            <Text style={s.emptyText}>No cars added yet</Text>
          </View>
        ) : (
          (cars ?? []).map((car) => (
            <View key={car.id} style={s.carCard}>
              <View style={s.carRow}>
                <View style={s.carInfo}>
                  <Text style={s.carName}>{car.brand} {car.model}</Text>
                  <Text style={s.carDetail}>{car.plateNumber} · {car.carType}</Text>
                  <View style={[s.colorDot, { backgroundColor: car.color }]} />
                </View>
                <Pressable
                  style={s.deleteBtn}
                  onPress={async () => {
                    await deleteCar.mutateAsync({ id: car.id });
                    refetch();
                  }}
                >
                  <Feather name="trash-2" size={18} color={colors.destructive} />
                </Pressable>
              </View>
              <View style={s.illustration}>
                <CarSilhouette color={car.color} carType={car.carType as never} size={180} />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={s.modal}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Add Vehicle</Text>

            <Text style={s.label}>Brand</Text>
            <View style={s.brandRow}>
              {BRANDS.map((b) => (
                <Pressable
                  key={b}
                  style={[s.chip, brand === b && s.chipActive]}
                  onPress={() => setBrand(b)}
                >
                  <Text style={[s.chipText, brand === b && s.chipTextActive]}>{b}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={s.label}>Model</Text>
            <TextInput
              style={s.input}
              value={model}
              onChangeText={setModel}
              placeholder="e.g. 5 Series, GLE 450"
              placeholderTextColor={colors.mutedForeground}
            />

            <Text style={s.label}>License Plate</Text>
            <TextInput
              style={s.input}
              value={plateNumber}
              onChangeText={setPlateNumber}
              placeholder="ABC 1234"
              autoCapitalize="characters"
              placeholderTextColor={colors.mutedForeground}
            />

            <Text style={s.label}>Type</Text>
            <View style={[s.brandRow, { marginBottom: 16 }]}>
              {CAR_TYPES.map((t) => (
                <Pressable
                  key={t.value}
                  style={[s.chip, carType === t.value && s.chipActive]}
                  onPress={() => setCarType(t.value)}
                >
                  <Text style={[s.chipText, carType === t.value && s.chipTextActive]}>{t.label}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={s.label}>Color</Text>
            <View style={s.colorRow}>
              {COLORS.map((c) => (
                <Pressable
                  key={c.hex}
                  style={[
                    s.colorSwatch,
                    { backgroundColor: c.hex },
                    color === c.hex && s.colorSwatchActive,
                  ]}
                  onPress={() => setColor(c.hex)}
                />
              ))}
            </View>

            <View style={s.preview}>
              <CarSilhouette color={color} carType={carType} size={160} />
            </View>

            <Pressable style={s.saveBtn} onPress={handleAdd} disabled={createCar.isPending}>
              {createCar.isPending ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text style={s.saveBtnText}>Save Vehicle</Text>
              )}
            </Pressable>

            <Pressable onPress={() => setShowModal(false)} style={{ alignItems: "center", marginTop: 16 }}>
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
