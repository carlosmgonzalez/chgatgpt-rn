import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LayoutHome() {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
