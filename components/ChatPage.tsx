import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ChatMessage,
  HeaderDropDown,
  MessageIdeas,
  MessageInput,
} from "@/components";
import { defaultStyles } from "@/constants/Styles";
import {
  Message,
  Role,
  addChat,
  addMessage,
  getMessages,
  storage,
} from "@/utils";
import { FlashList } from "@shopify/flash-list";
import { useMMKVString } from "react-native-mmkv";
import OpenAI from "react-native-openai";

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [apiKey, setApiKey] = useMMKVString("apiKey", storage);
  const [organization, setOrganization] = useMMKVString("org", storage);
  const [gptVersion, setGptVersion] = useMMKVString("gptVersion", storage);

  const db = useSQLiteContext();

  const { id } = useLocalSearchParams<{ id: string }>();
  const [chatId, _setChatId] = useState<number>(Number(id) || 0);
  const chatIdRef = useRef(chatId);

  const setChatId = (chadId: number) => {
    chatIdRef.current = chadId;
    _setChatId(chadId);
  };

  // const scrollViewRef = useRef<FlashList<Message> | null>(null);

  // useEffect(() => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollToEnd({ animated: true });
  //   }
  // }, [messages]);

  if (!apiKey || apiKey === "" || !organization || organization === "") {
    return <Redirect href="/(home)/(modal)/settings" />;
  }

  useEffect(() => {
    if (id) {
      getMessages(db, chatId).then((messages) => {
        const _messages = messages.map((message) => ({
          role: message.role,
          content: message.content,
          prompt: message.prompt,
          imageUrl: message.imageUrl,
        }));

        setMessages(_messages);
      });
    }
  }, [id]);

  const openAI = useMemo(() => new OpenAI({ apiKey, organization }), []);

  const getCompletion = async (message: string) => {
    if (messages.length === 0) {
      const result = await addChat(db, message);
      const chatId = result.lastInsertRowId;
      setChatId(chatId);
      await addMessage(db, chatId, { role: Role.User, content: message });
    }

    addMessage(db, chatId, { role: Role.User, content: message });
    setMessages([
      ...messages,
      { role: Role.User, content: message },
      { role: Role.Bot, content: "" },
    ]);

    openAI.chat.stream({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: gptVersion === "3.5" ? "gpt-3.5-turbo" : "gpt-4",
    });
  };

  useEffect(() => {
    openAI.chat.addListener("onChatMessageReceived", (payload) => {
      const newMessage = payload.choices[0].delta.content;

      setMessages((prevMessages) => {
        let lastMessageBot = prevMessages.at(-1)!;

        if (newMessage) {
          lastMessageBot.content += newMessage;
          return [...prevMessages];
        }

        if (!payload.choices[0].finishReason) {
          console.log("Stream ended");
          addMessage(db, chatId, lastMessageBot);
        }

        return prevMessages;
      });
    });

    return () => {
      openAI.chat.removeListener("onChatMessageReceived");
    };
  }, [openAI, messages]);

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="ChatGPT"
              selected={gptVersion}
              onSelect={(key) => {
                setGptVersion(key);
              }}
              items={[
                { title: "GPT-3.5", key: "3.5", icon: "bolt" },
                { title: "GPT-4", key: "4.0", icon: "sparkles" },
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
                backgroundColor: "black",
                padding: 10,
                borderRadius: 50,
              }}
            >
              <Image
                source={require("@/assets/images/logo-white.png")}
                style={styles.logoImage}
              />
            </View>
          </View>
        )}
        {messages.length > 0 && (
          <FlashList
            // ref={scrollViewRef}
            data={messages}
            renderItem={({ item }) => <ChatMessage {...item} />}
            estimatedItemSize={400}
            // keyboardDismissMode="on-drag"
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
    height: 50,
    width: 50,
  },
});
