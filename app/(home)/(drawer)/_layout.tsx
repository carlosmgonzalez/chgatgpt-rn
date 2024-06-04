import Colors from "@/constants/Colors";
import { Chat, deleteChat, getChats, renameChat } from "@/utils";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { Link, useNavigation, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ContextMenu from "zeego/context-menu";

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets();
  const isDrawerOpen = useDrawerStatus() === "open";

  const [history, setHistory] = useState<Chat[]>([]);

  useEffect(() => {
    if (isDrawerOpen) {
      Keyboard.dismiss();
      loadChats();
    }
  }, [isDrawerOpen]);

  const db = useSQLiteContext();

  const loadChats = async () => {
    const result = await getChats(db);
    setHistory(result);
  };

  const onDeleteChat = async (id: number) => {
    Alert.alert("Delete chat", "Are you sure you want to delete this chat?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          await deleteChat(db, id);
          loadChats();
        },
      },
    ]);
  };

  const onRenameChat = async (id: number) => {
    Alert.prompt(
      "Rename chat",
      "Enter a new name for the chat",
      async (newName) => {
        if (newName) {
          await renameChat(db, id, newName);
          loadChats();
        }
      }
    );
  };

  return (
    <View style={{ flex: 1, marginTop: top }}>
      <View style={{ backgroundColor: "#fff", paddingBottom: 16 }}>
        <View style={styles.searchSection}>
          <Ionicons
            style={styles.searchIcon}
            name="search"
            size={20}
            color={Colors.greyLight}
          />
          <TextInput
            style={styles.input}
            placeholder="Search"
            underlineColorAndroid={"transparent"}
          />
        </View>
      </View>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <DrawerItemList {...props} />
        {history.map((chat) => (
          <ContextMenu.Root key={chat.id}>
            <ContextMenu.Trigger>
              <DrawerItem
                label={chat.title}
                onPress={() => router.push(`(home)/(drawer)/(chat)/${chat.id}`)}
                inactiveTintColor="#000"
              />
            </ContextMenu.Trigger>
            <ContextMenu.Content>
              <ContextMenu.Item
                key={"rename"}
                onSelect={() => onRenameChat(chat.id)}
              >
                <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item
                key={"delete"}
                onSelect={() => onDeleteChat(chat.id)}
              >
                <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        ))}
      </DrawerContentScrollView>
      <View style={{ padding: 16, paddingBottom: bottom + 16 }}>
        <Link href="/(home)/(modal)/settings" asChild>
          <TouchableOpacity style={styles.footer}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/a/ACg8ocJiSJ0T_PKZFJItSSWMaEDYxYSWIWniPhb3PPgrPK0jbAleBvNH=s288-c-no",
              }}
              style={styles.avatar}
            />
            <Text style={styles.username}>Carlos Mario Gonzalez</Text>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={Colors.greyLight}
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default function LayoutDrawer() {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer);
            }}
            style={{ marginLeft: 15 }}
          >
            <FontAwesome6 name="grip-lines" size={25} color={Colors.grey} />
          </TouchableOpacity>
        ),
        drawerActiveBackgroundColor: Colors.selected,
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#000",
        drawerItemStyle: { borderRadius: 12 },
        drawerLabelStyle: { marginLeft: -20 },
        drawerStyle: { width: dimensions.width * 0.86 },
        overlayColor: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <Drawer.Screen
        name="(chat)/new"
        getId={() => Math.random().toString()}
        options={{
          title: "ChatGPT",
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: "#000" }]}>
              <Image
                source={require("@/assets/images/logo-white.png")}
                style={styles.btnImage}
              />
            </View>
          ),
          headerRight: () => (
            <Link href="/(home)/(drawer)/(chat)/new" push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="(chat)/[id]"
        options={{
          drawerItemStyle: {
            display: "none",
          },
          headerRight: () => (
            <Link href="/(home)/(drawer)/(chat)/new" push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="dalle"
        options={{
          title: "Dall-E",
          drawerIcon: () => (
            <View style={styles.item}>
              <Image
                source={require("@/assets/images/dalle.png")}
                style={styles.dalleImage}
              />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          title: "Explore GPTs",
          drawerIcon: () => (
            <View style={styles.item}>
              <Ionicons
                name="apps-outline"
                size={25}
                color="#000"
                style={{ margin: 6 }}
              />
            </View>
          ),
          headerTitleAlign: "center",
        }}
      />
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
  dalleImage: {
    width: 36,
    height: 36,
    resizeMode: "cover",
  },
  searchSection: {
    marginHorizontal: 10,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.input,
    borderRadius: 10,
    height: 42,
  },
  searchIcon: {
    padding: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingBottom: 8,
    paddingLeft: 0,
    alignItems: "center",
    color: "#424242",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
});
