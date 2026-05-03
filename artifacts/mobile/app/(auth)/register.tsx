import { useRegister } from "@workspace/api-client-react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth, type AuthUser } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const ROLES = [
  { value: "customer", label: "Customer" },
  { value: "worker", label: "Detailer" },
] as const;

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "worker">("customer");
  const [error, setError] = useState("");

  const registerMutation = useRegister();

  async function handleRegister() {
    setError("");
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    try {
      const result = await registerMutation.mutateAsync({
        data: { name, email, password, role },
      });
      await login(result.token, result.user as AuthUser);
    } catch {
      setError("Registration failed. Email may already be in use.");
    }
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1 },
    content: {
      flex: 1,
      paddingHorizontal: 28,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 60),
      paddingBottom: insets.bottom + 32,
    },
    header: { marginBottom: 40 },
    back: { marginBottom: 24 },
    backText: {
      fontSize: 14,
      fontFamily: "DMSans_500Medium",
      color: colors.mutedForeground,
    },
    title: {
      fontSize: 32,
      fontFamily: "DMSans_700Bold",
      color: colors.foreground,
      lineHeight: 40,
    },
    subtitle: {
      fontSize: 15,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
      marginTop: 8,
    },
    roleRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 24,
    },
    roleBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    roleBtnActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    roleBtnText: {
      fontSize: 14,
      fontFamily: "DMSans_600SemiBold",
      color: colors.mutedForeground,
    },
    roleBtnTextActive: { color: colors.primaryForeground },
    inputGroup: { marginBottom: 16 },
    label: {
      fontSize: 13,
      fontFamily: "DMSans_500Medium",
      color: colors.mutedForeground,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
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
    error: {
      color: colors.destructive,
      fontSize: 14,
      fontFamily: "DMSans_400Regular",
      marginBottom: 16,
      textAlign: "center",
    },
    btn: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 8,
    },
    btnText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontFamily: "DMSans_600SemiBold",
    },
    loginRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 24,
    },
    loginText: {
      fontSize: 14,
      fontFamily: "DMSans_400Regular",
      color: colors.mutedForeground,
    },
    loginLink: {
      fontSize: 14,
      fontFamily: "DMSans_600SemiBold",
      color: colors.primary,
    },
  });

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.content}>
          <View style={s.header}>
            <Pressable style={s.back} onPress={() => router.back()}>
              <Text style={s.backText}>← Back</Text>
            </Pressable>
            <Text style={s.title}>Create{"\n"}Account</Text>
            <Text style={s.subtitle}>Join LuxeWash today</Text>
          </View>

          <Text style={s.label}>I am a</Text>
          <View style={s.roleRow}>
            {ROLES.map((r) => (
              <Pressable
                key={r.value}
                style={[s.roleBtn, role === r.value && s.roleBtnActive]}
                onPress={() => setRole(r.value)}
              >
                <Text
                  style={[
                    s.roleBtnText,
                    role === r.value && s.roleBtnTextActive,
                  ]}
                >
                  {r.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Full Name</Text>
            <TextInput
              style={s.input}
              value={name}
              onChangeText={setName}
              placeholder="John Smith"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>
          <View style={s.inputGroup}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>
          <View style={s.inputGroup}>
            <Text style={s.label}>Password</Text>
            <TextInput
              style={s.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>

          {!!error && <Text style={s.error}>{error}</Text>}

          <Pressable
            style={[s.btn, registerMutation.isPending && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={s.btnText}>Create Account</Text>
            )}
          </Pressable>

          <View style={s.loginRow}>
            <Text style={s.loginText}>Already have an account? </Text>
            <Pressable onPress={() => router.replace("/(auth)/login")}>
              <Text style={s.loginLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
