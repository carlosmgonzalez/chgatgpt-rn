import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React from "react";
import { Message, Role } from "@/utils/Interfaces";
import Colors from "@/constants/Colors";
import * as ContextMenu from "zeego/context-menu";
import {
  copyImageToClipboard,
  downloadAndSaveImage,
  shareImage,
} from "@/utils/ImageOptions";
import { Link, useRouter } from "expo-router";

const contextItems = [
  {
    title: "Copy",
    systemIcon: "doc.on.doc",
    action: (imageUrl: string) => copyImageToClipboard(imageUrl),
  },
  {
    title: "Save to Photos",
    systemIcon: "arrow.down.to.line",
    action: (imageUrl: string) => downloadAndSaveImage(imageUrl),
  },
  {
    title: "Share",
    systemIcon: "square.and.arrow.up",
    action: (imageUrl: string) => shareImage(imageUrl),
  },
];

export const ChatMessage = ({
  content,
  role,
  prompt,
  imageUrl,
  loading,
}: Message & { loading?: boolean }) => {
  const router = useRouter();

  return (
    <View style={styles.row}>
      {role === Role.Bot ? (
        <View style={styles.contentAvatarBot}>
          <Image
            source={require("@/assets/images/logo-white.png")}
            style={styles.avatarBot}
          />
        </View>
      ) : (
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/a/ACg8ocJiSJ0T_PKZFJItSSWMaEDYxYSWIWniPhb3PPgrPK0jbAleBvNH=s288-c-no",
          }}
          style={styles.avatarUser}
        />
      )}
      {loading ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 40,
          }}
        >
          <ActivityIndicator size={30} color={Colors.primary} />
        </View>
      ) : (
        <>
          {content === "" && imageUrl && (
            <ContextMenu.Root>
              <ContextMenu.Trigger action="longPress">
                <Pressable
                  onPress={() =>
                    router.navigate({
                      pathname: "/(home)/(modal)/image/[url]",
                      params: { url: imageUrl, prompt },
                    })
                  }
                  onLongPress={() => {}}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.previewImage}
                  />
                </Pressable>
              </ContextMenu.Trigger>
              <ContextMenu.Content>
                {contextItems.map(({ action, systemIcon, title }) => (
                  <ContextMenu.Item
                    key={title}
                    onSelect={() => action(imageUrl)}
                  >
                    <ContextMenu.ItemTitle>{title}</ContextMenu.ItemTitle>
                    <ContextMenu.ItemIcon
                      ios={{
                        name: systemIcon,
                        pointSize: 18,
                      }}
                    />
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Content>
            </ContextMenu.Root>
          )}
          {content !== "" && <Text style={styles.text}>{content}</Text>}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 14,
    marginVertical: 12,
  },
  avatarUser: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#000",
  },
  avatarBot: {
    width: " 70%",
    height: "70%",
  },
  contentAvatarBot: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "black",
    borderRadius: 40,
  },
  text: {
    flexWrap: "wrap",
    flex: 1,
    fontSize: 14,
  },
  previewImage: {
    width: 240,
    height: 240,
    borderRadius: 10,
  },
});
