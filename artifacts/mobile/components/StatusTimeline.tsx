import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "en_route"
  | "in_progress"
  | "finishing"
  | "completed"
  | "cancelled";

const STEPS: {
  status: OrderStatus[];
  label: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { status: ["confirmed", "en_route", "in_progress", "finishing", "completed"], label: "Order Confirmed", icon: "check-circle" },
  { status: ["en_route", "in_progress", "finishing", "completed"], label: "Worker En Route", icon: "navigation" },
  { status: ["in_progress", "finishing", "completed"], label: "Cleaning In Progress", icon: "wind" },
  { status: ["finishing", "completed"], label: "Finishing Up", icon: "star" },
  { status: ["completed"], label: "Completed", icon: "check-circle" },
];

interface StatusTimelineProps {
  status: OrderStatus;
}

export function StatusTimeline({ status }: StatusTimelineProps) {
  const colors = useColors();

  const s = StyleSheet.create({
    container: { paddingVertical: 8 },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 4,
    },
    iconCol: {
      alignItems: "center",
      width: 32,
    },
    line: {
      width: 2,
      height: 24,
      marginTop: 4,
    },
    textCol: {
      flex: 1,
      paddingLeft: 12,
      paddingTop: 2,
    },
    label: {
      fontSize: 14,
      fontFamily: "DMSans_500Medium",
    },
  });

  return (
    <View style={s.container}>
      {STEPS.map((step, i) => {
        const isActive = step.status.includes(status);
        const isCurrent =
          isActive &&
          (i === STEPS.length - 1 ||
            !STEPS[i + 1]?.status.includes(status));
        const isLast = i === STEPS.length - 1;

        return (
          <View key={i}>
            <View style={s.row}>
              <View style={s.iconCol}>
                <Feather
                  name={step.icon}
                  size={20}
                  color={
                    isActive
                      ? isCurrent
                        ? colors.accent
                        : colors.primary
                      : colors.border
                  }
                />
              </View>
              <View style={s.textCol}>
                <Text
                  style={[
                    s.label,
                    {
                      color: isActive
                        ? isCurrent
                          ? colors.accent
                          : colors.foreground
                        : colors.mutedForeground,
                      fontFamily: isCurrent
                        ? "DMSans_600SemiBold"
                        : "DMSans_400Regular",
                    },
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            </View>
            {!isLast && (
              <View style={s.row}>
                <View style={s.iconCol}>
                  <View
                    style={[
                      s.line,
                      {
                        backgroundColor: isActive
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
