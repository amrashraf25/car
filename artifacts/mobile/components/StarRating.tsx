import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export function StarRating({ value, onChange, size = 36, readonly = false }: StarRatingProps) {
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => !readonly && onChange(star)}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.9 : 1 }] })}
        >
          <FontAwesome
            name={star <= value ? "star" : "star-o"}
            size={size}
            color={star <= value ? "#C9A84C" : "#CACACA"}
          />
        </Pressable>
      ))}
    </View>
  );
}
