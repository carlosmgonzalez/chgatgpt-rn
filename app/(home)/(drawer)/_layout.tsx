import { Drawer } from "expo-router/drawer";
import { Image, StyleSheet, View } from "react-native";

export default function LayoutDrawer() {
  return (
    <Drawer>
      <Drawer.Screen
        name="(chat)/new"
        options={{
          title: "New Chat",
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: "#000" }]}>
              <Image
                source={require("@/assets/images/logo-white.png")}
                style={styles.btnImage}
              />
            </View>
          ),
        }}
      />
      <Drawer.Screen name="dalle" options={{ title: "hola" }} />
      <Drawer.Screen name="explore" />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  btnImage: {
    width: 25,
    height: 25,
    margin: 6,
  },
  item: {
    borderRadius: 15,
    overflow: "hidden",
  },
});
