import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StarRating } from "@/components/StarRating";
import { useColors } from "@/hooks/useColors";

export default function RateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { workerName } = useLocalSearchParams<{ workerName?: string }>();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

  async function handleSubmit() {
    if (rating === 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => router.replace("/(customer)/"), 1800);
  }

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
    title: { fontSize: 20, fontFamily: "PlayfairDisplay_700Bold", color: colors.foreground },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingBottom: insets.bottom + 40,
      alignItems: "center",
    },
    workerCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 24,
      alignItems: "center",
      width: "100%",
      marginBottom: 28,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
    workerAvatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    workerAvatarText: {
      fontSize: 28,
      fontFamily: "PlayfairDisplay_700Bold",
      color: "#FFF",
    },
    workerName: {
      fontSize: 20,
      fontFamily: "PlayfairDisplay_700Bold",
      color: colors.foreground,
      marginBottom: 4,
    },
    workerRole: {
      fontSize: 13,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
    },
    sectionLabel: {
      fontSize: 13,
      fontFamily: "DMSans_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 14,
      alignSelf: "flex-start",
    },
    ratingLabel: {
      fontSize: 18,
      fontFamily: "PlayfairDisplay_600SemiBold",
      color: colors.gold,
      marginTop: 12,
      marginBottom: 24,
    },
    textInput: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      minHeight: 100,
      fontSize: 15,
      fontFamily: "DMSans_400Regular",
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
      textAlignVertical: "top",
      marginBottom: 24,
    },
    submitBtn: {
      width: "100%",
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 17,
      alignItems: "center",
    },
    submitBtnDisabled: { opacity: 0.4 },
    submitBtnText: {
      color: "#FFF",
      fontSize: 16,
      fontFamily: "DMSans_600SemiBold",
    },
    successContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
    },
    successCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: "#DCFCE7",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    successTitle: {
      fontSize: 24,
      fontFamily: "PlayfairDisplay_700Bold",
      color: colors.foreground,
      marginBottom: 8,
      textAlign: "center",
    },
    successSub: {
      fontSize: 14,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
    },
  });

  if (submitted) {
    return (
      <View style={[s.container, s.successContainer]}>
        <View style={s.successCircle}>
          <Feather name="check" size={40} color="#22C55E" />
        </View>
        <Text style={s.successTitle}>Thank You!</Text>
        <Text style={s.successSub}>Your feedback helps us maintain{"\n"}the highest standards of service.</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={s.title}>Rate Experience</Text>
      </View>

      <View style={s.content}>
        <View style={s.workerCard}>
          <View style={s.workerAvatar}>
            <Text style={s.workerAvatarText}>
              {(workerName?.[0] ?? "D").toUpperCase()}
            </Text>
          </View>
          <Text style={s.workerName}>{workerName ?? "Your Detailer"}</Text>
          <Text style={s.workerRole}>LuxeWash Certified Detailer</Text>
        </View>

        <Text style={s.sectionLabel}>Your Rating</Text>
        <StarRating value={rating} onChange={setRating} size={42} />
        {rating > 0 && (
          <Text style={s.ratingLabel}>{ratingLabels[rating]}</Text>
        )}

        <Text style={[s.sectionLabel, { marginTop: rating > 0 ? 0 : 24 }]}>Leave a Review (optional)</Text>
        <TextInput
          style={s.textInput}
          value={review}
          onChangeText={setReview}
          placeholder="Share your experience..."
          placeholderTextColor={colors.mutedForeground}
          multiline
          numberOfLines={4}
        />

        <Pressable
          style={[s.submitBtn, rating === 0 && s.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0 || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={s.submitBtnText}>Submit Rating</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
