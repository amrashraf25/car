import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface SkeletonBoxProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

function SkeletonBox({ width = "100%", height = 16, borderRadius = 8, style }: SkeletonBoxProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const bgColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ["#EBEBEB", "#D8D8D8"],
  });

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: bgColor }, style]}
    />
  );
}

interface SkeletonCardProps {
  rows?: number;
}

export function SkeletonCard({ rows = 3 }: SkeletonCardProps) {
  const s = StyleSheet.create({
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: 18,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: "#EBEBEB",
    },
    row: { marginBottom: 10 },
  });

  return (
    <View style={s.card}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}>
        <SkeletonBox width={80} height={12} />
        <SkeletonBox width={70} height={22} borderRadius={100} />
      </View>
      <SkeletonBox height={22} width="70%" style={{ marginBottom: 8 }} />
      <SkeletonBox height={14} width="40%" style={{ marginBottom: 16 }} />
      <View style={{ height: 1, backgroundColor: "#EBEBEB", marginBottom: 12 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBox key={i} height={12} width={`${85 - i * 10}%`} style={{ marginBottom: 8 }} />
      ))}
    </View>
  );
}

export function SkeletonStat() {
  return (
    <View
      style={{
        flex: 1,
        minWidth: "44%",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <SkeletonBox width={40} height={40} borderRadius={10} style={{ marginBottom: 12 }} />
      <SkeletonBox height={28} width="60%" style={{ marginBottom: 8 }} />
      <SkeletonBox height={12} width="80%" />
    </View>
  );
}
