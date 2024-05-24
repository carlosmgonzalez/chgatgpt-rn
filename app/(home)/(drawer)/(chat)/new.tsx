import { useAuth } from "@clerk/clerk-expo";
import { View, Text, TouchableOpacity } from "react-native";

export default function DrawerScreen() {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <View>
        <TouchableOpacity
          onPress={() => signOut()}
          style={{
            paddingHorizontal: 5,
            paddingVertical: 2.5,
            backgroundColor: "red",
            borderRadius: 5,
            alignSelf: "baseline",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <Text>HomeScreen</Text>
    </View>
  );
}
