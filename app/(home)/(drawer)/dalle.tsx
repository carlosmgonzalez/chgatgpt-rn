import {
  ChatMessage,
  HeaderDropDown,
  MessageIdeas,
  MessageInput,
} from "@/components";
import { defaultStyles } from "@/constants/Styles";
import { Message, Role } from "@/utils/Interfaces";
import { Redirect, Stack } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/utils/Storage";
import OpenAI from "react-native-openai";
import Colors from "@/constants/Colors";

const DUMMY_MESSAGES = [
  {
    role: Role.Bot,
    content: "",
    imageUrl: "https://galaxies.dev/img/meerkat_2.jpg",
    prompt: `But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. 
      But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.`,
  },
];

export default function DalleScreen() {
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [working, setWorking] = useState(false);

  const [apiKey, setApiKey] = useMMKVString("apiKey", storage);
  const [organization, setOrganization] = useMMKVString("org", storage);
  const [gptVersion, setGptVersion] = useMMKVString("gptVersion", storage);

  // const scrollViewRef = useRef<FlashList<Message> | null>(null);

  // useEffect(() => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollToEnd({ animated: true });
  //   }
  // }, [messages]);

  if (!apiKey || apiKey === "" || !organization || organization === "") {
    return <Redirect href="/(home)/(modal)/settings" />;
  }

  const openAI = useMemo(() => new OpenAI({ apiKey, organization }), []);

  const getCompletion = async (message: string) => {
    setWorking(true);

    if (message.length === 0) return;

    setMessages([...messages, { role: Role.User, content: message }]);

    try {
      const result = await openAI.image.create({
        prompt: message,
      });

      if (result.data && result.data.length > 0) {
        const imageUrl = result.data[0].url;
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: Role.Bot, imageUrl, content: "", prompt: message },
        ]);
      }
    } catch (error) {
      console.log(error);
    }

    setWorking(false);
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="Dall-E"
              onSelect={() => {}}
              items={[
                {
                  key: "share",
                  title: "Share GPT",
                  icon: "square.and.arrow.up",
                },
                { key: "details", title: "See Detaild", icon: "info.circle" },
                { key: "keep", title: "Keep in Sidebar", icon: "pin" },
              ]}
            />
          ),
          headerTitleAlign: "center",
        }}
      />
      <View style={{ flex: 1 }}>
        {messages.length === 0 && (
          <View style={styles.logoContainer}>
            <View
              style={{
                overflow: "hidden",
                width: 90,
                height: 90,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
              }}
            >
              <Image
                source={require("@/assets/images/dalle.png")}
                style={styles.logoImage}
              />
            </View>
            <Text style={styles.label}>
              Let me turn your imagination into imagery.
            </Text>
          </View>
        )}
        {messages.length > 0 && (
          <FlashList
            // ref={scrollViewRef}
            data={messages}
            renderItem={({ item }) => <ChatMessage {...item} />}
            estimatedItemSize={400}
            contentContainerStyle={{ paddingBottom: 150, paddingTop: 10 }}
            // keyboardDismissMode="on-drag"
            ListFooterComponent={
              <>
                {working && <ChatMessage role={Role.Bot} content="" loading />}
              </>
            }
          />
        )}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={70}
        // style={{
        //   position: "absolute",
        //   bottom: 0,
        //   left: 0,
        //   width: "100%",
        // }}
      >
        {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
        <MessageInput onShlouldSendMessage={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    resizeMode: "cover",
  },
  label: {
    color: Colors.grey,
    fontSize: 16,
  },
});
