import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";

const CAR_IMAGES: Record<string, string> = {
  suv: "https://images.unsplash.com/photo-1669215420560-9bac2f6c3f50?w=700&q=80&auto=format&fit=crop",
  sedan: "https://images.unsplash.com/photo-1619976215249-1926b21aa76d?w=700&q=80&auto=format&fit=crop",
  truck: "https://images.unsplash.com/photo-1615657560059-cfe3f36ba91b?w=700&q=80&auto=format&fit=crop",
  hatchback: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=700&q=80&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1669215420560-9bac2f6c3f50?w=700&q=80&auto=format&fit=crop",
};

interface CarSilhouetteProps {
  color?: string;
  carType?: "sedan" | "suv" | "truck" | "hatchback";
  size?: number;
}

export function CarSilhouette({ carType = "suv", size = 200 }: CarSilhouetteProps) {
  const uri = CAR_IMAGES[carType] ?? CAR_IMAGES.default!;
  return (
    <View style={{ width: size, height: size * 0.5, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={{ uri }}
        style={{ width: size, height: size * 0.5 }}
        contentFit="contain"
        transition={300}
      />
    </View>
  );
}
