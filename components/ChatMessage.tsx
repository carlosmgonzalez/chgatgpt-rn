import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Message, Role } from "@/utils/Interfaces";

export const ChatMessage = ({ content, role, prompt, imageUrl }: Message) => {
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
      <Text style={styles.text}>{content}</Text>
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
});
