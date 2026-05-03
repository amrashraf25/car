import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Ellipse, Rect, Path, Circle, G } from "react-native-svg";

interface CarSilhouetteProps {
  color?: string;
  carType?: "sedan" | "suv" | "truck" | "hatchback";
  size?: number;
}

export function CarSilhouette({
  color = "#1A1A1A",
  carType = "sedan",
  size = 200,
}: CarSilhouetteProps) {
  const w = size;
  const h = size * 0.5;
  const bodyColor = color;
  const windowColor = "rgba(120,180,240,0.6)";
  const darkColor = "#0a0a0a";
  const wheelColor = "#333";
  const rimColor = "#888";

  return (
    <View style={[styles.container, { width: w, height: h }]}>
      <Svg width={w} height={h} viewBox="0 0 200 100">
        {/* Shadow */}
        <Ellipse cx="100" cy="95" rx="70" ry="6" fill="rgba(0,0,0,0.15)" />

        {/* Car body */}
        <Rect
          x="20"
          y="55"
          width="160"
          height="32"
          rx="8"
          fill={bodyColor}
        />

        {/* Cabin (top view) */}
        {carType === "suv" || carType === "truck" ? (
          <Rect
            x="35"
            y="30"
            width="130"
            height="35"
            rx="6"
            fill={bodyColor}
          />
        ) : (
          <Path
            d="M50 62 L60 32 L140 32 L150 62 Z"
            fill={bodyColor}
          />
        )}

        {/* Windshield */}
        <Path
          d={
            carType === "suv" || carType === "truck"
              ? "M40 62 L50 35 L90 35 L90 62 Z"
              : "M55 62 L65 35 L90 35 L90 62 Z"
          }
          fill={windowColor}
        />

        {/* Rear window */}
        <Path
          d={
            carType === "suv" || carType === "truck"
              ? "M160 62 L150 35 L110 35 L110 62 Z"
              : "M145 62 L135 35 L110 35 L110 62 Z"
          }
          fill={windowColor}
        />

        {/* Side windows */}
        <Rect
          x="90"
          y="35"
          width="20"
          height="27"
          fill={windowColor}
          opacity={0.8}
        />

        {/* Door line */}
        <Path
          d="M90 55 L90 87"
          stroke={darkColor}
          strokeWidth="0.8"
          opacity={0.3}
        />

        {/* Wheels */}
        <G>
          <Circle cx="45" cy="77" r="13" fill={wheelColor} />
          <Circle cx="45" cy="77" r="7" fill={rimColor} />
          <Circle cx="45" cy="77" r="3" fill={darkColor} />
        </G>
        <G>
          <Circle cx="155" cy="77" r="13" fill={wheelColor} />
          <Circle cx="155" cy="77" r="7" fill={rimColor} />
          <Circle cx="155" cy="77" r="3" fill={darkColor} />
        </G>

        {/* Front lights */}
        <Rect
          x="18"
          y="60"
          width="8"
          height="5"
          rx="2"
          fill="#FFF9C4"
          opacity={0.9}
        />
        <Rect
          x="174"
          y="60"
          width="8"
          height="5"
          rx="2"
          fill="#FFCDD2"
          opacity={0.9}
        />

        {/* Roof highlight */}
        <Path
          d="M80 38 Q100 34 120 38"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
