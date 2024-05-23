import { AnimatedIntro, BottomLoginSheet } from "@/components";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <AnimatedIntro />
      <BottomLoginSheet />
    </View>
  );
}
