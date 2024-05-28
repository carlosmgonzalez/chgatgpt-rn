import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

const predefineMessages = [
  { title: "Explain React Native", text: "Like I'm five years old" },
  {
    title: "Suggest fun activites",
    text: "For a family visting San Francisco",
  },
  { title: "Recommentd a dish", text: "To impress a date who's a picky eater" },
];

interface Props {
  onSelectCard: (message: string) => void;
}

export const MessageIdeas = ({ onSelectCard }: Props) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          gap: 16,
        }}
      >
        {predefineMessages.map(({ text, title }, index) => [
          <TouchableOpacity
            style={styles.card}
            key={index}
            onPress={() => onSelectCard(`${title} ${text}`)}
          >
            <Text style={{ fontWeight: "500" }}>{title}</Text>
            <Text style={{ color: Colors.grey }}>{text}</Text>
          </TouchableOpacity>,
        ])}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.input,
    padding: 14,
    borderRadius: 10,
  },
});
