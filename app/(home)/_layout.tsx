import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, View } from "react-native";
import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "@/utils/Database";

export default function LayoutHome() {
  const router = useRouter();

  return (
    <SQLiteProvider databaseName="chatgpt.db" onInit={migrateDbIfNeeded}>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modal)/settings"
          options={{
            headerTitle: "Settings",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.push("/(home)/(drawer)/(chat)/new")}
              >
                <Ionicons name="close-outline" size={30} color={Colors.grey} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="(modal)/image/[url]"
          options={{
            headerTitle: "",
            presentation: "fullScreenModal",
            headerBlurEffect: "dark",
            headerStyle: { backgroundColor: "rgba(0,0,0,0.4)" },
            headerTransparent: true,
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ borderRadius: 20, padding: 4 }}
              >
                <Ionicons name="close-outline" size={28} color={"#fff"} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
      <StatusBar style="dark" backgroundColor="white" />
    </SQLiteProvider>
  );
}
