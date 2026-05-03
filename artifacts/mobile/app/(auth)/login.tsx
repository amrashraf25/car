import { useLogin } from "@workspace/api-client-react";
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

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useLogin();

  async function handleLogin() {
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }
    try {
      const result = await loginMutation.mutateAsync({ data: { email, password } });
      await login(result.token, result.user as AuthUser);
    } catch {
      setError("Invalid email or password");
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 28,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 60),
      paddingBottom: insets.bottom + 32,
    },
    logoArea: {
      marginBottom: 48,
    },
    badge: {
      alignSelf: "flex-start",
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 100,
      marginBottom: 16,
    },
    badgeText: {
      color: colors.primaryForeground,
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    title: {
      fontSize: 36,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      lineHeight: 44,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    demoBox: {
      backgroundColor: colors.muted,
      borderRadius: 12,
      padding: 16,
      marginBottom: 32,
    },
    demoTitle: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 8,
    },
    demoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    demoLabel: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    demoValue: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
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
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    error: {
      color: colors.destructive,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      marginBottom: 16,
      textAlign: "center",
    },
    loginButton: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 8,
    },
    loginButtonText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    registerRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 24,
    },
    registerText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    registerLink: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
  });

  function fillDemo(role: "customer" | "worker" | "admin") {
    const creds = {
      customer: { email: "customer@demo.com", password: "password123" },
      worker: { email: "worker@demo.com", password: "password123" },
      admin: { email: "admin@demo.com", password: "password123" },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoArea}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>LuxeWash</Text>
            </View>
            <Text style={styles.title}>Welcome{"\n"}back</Text>
            <Text style={styles.subtitle}>
              Premium car care, at your doorstep
            </Text>
          </View>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Demo Accounts</Text>
            {(["customer", "worker", "admin"] as const).map((role) => (
              <Pressable
                key={role}
                onPress={() => fillDemo(role)}
                style={styles.demoRow}
              >
                <Text style={styles.demoLabel}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
                <Text style={styles.demoValue}>{role}@demo.com</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="your@email.com"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            style={[
              styles.loginButton,
              loginMutation.isPending && { opacity: 0.7 },
            ]}
            onPress={handleLogin}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </Pressable>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don&apos;t have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
