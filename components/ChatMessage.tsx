import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import React from "react";
import { Message, Role } from "@/utils/Interfaces";
import Colors from "@/constants/Colors";

export const ChatMessage = ({
  content,
  role,
  prompt,
  imageUrl,
  loading,
}: Message & { loading?: boolean }) => {
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
            <Image source={{ uri: imageUrl }} style={styles.previewImage} />
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
