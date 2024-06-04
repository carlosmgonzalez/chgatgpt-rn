import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter, useSegments } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  View,
  useColorScheme,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  async saveToken(key: string, token: string) {
    try {
      return SecureStore.setItemAsync(key, token);
    } catch (error) {
      return;
    }
  },
};

const InitLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const inHomeGroup = segments[0] === "(home)";

    if (isSignedIn && !inHomeGroup) {
      router.replace("/(home)/(drawer)/(chat)/new");
    } else if (!isSignedIn && inHomeGroup) {
      router.replace("/");
    }
  }, [isSignedIn]);

  if (isLoaded)
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={40} />
    </View>;

  return (
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
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <InitLayout />
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
