import { ClerkProvider } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable } from "react-native";

export default function RootLayout() {
  const router = useRouter();

  return (
    <>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      >
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              title: "",
              headerLeft: () => (
                <Pressable onPress={() => router.back()}>
                  <Ionicons name="close-outline" size={28} />
                </Pressable>
              ),
            }}
          />
        </Stack>
        <StatusBar style="dark" />
      </ClerkProvider>
    </>
  );
}
