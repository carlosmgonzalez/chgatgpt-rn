import {
  ChatMessage,
  HeaderDropDown,
  MessageIdeas,
  MessageInput,
} from "@/components";
import { defaultStyles } from "@/constants/Styles";
import { Message, Role } from "@/utils/Interfaces";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/utils/Storage";

const DUMMY_MESSAGES: Message[] = [
  {
    role: Role.User,
    content: "Hola, ¿puedes ayudarme con una duda de programación?",
    imageUrl: "https://example.com/user1.jpg",
  },
  {
    role: Role.Bot,
    content: "¡Claro! ¿Cuál es tu duda?",
    imageUrl: "https://example.com/bot1.jpg",
    prompt: "Pregunta al usuario sobre su duda específica en programación.",
  },
  {
    role: Role.User,
    content:
      "Estoy teniendo problemas con una función en JavaScript. No entiendo por qué no devuelve el resultado esperado.",
    imageUrl: "https://example.com/user2.jpg",
    prompt:
      "¿Qué problemas específicos estás teniendo con tu función en JavaScript?",
  },
  {
    role: Role.Bot,
    content:
      "Para poder ayudarte mejor, ¿podrías compartir el código de la función y describir cuál es el resultado esperado y cuál es el resultado actual?",
    imageUrl: "https://example.com/bot2.jpg",
    prompt:
      "Solicita al usuario que comparta el código y explique el problema con más detalle.",
  },
  {
    role: Role.User,
    content:
      "Claro, aquí está el código: function suma(a, b) { return a + b; } console.log(suma(2, '3')); // Debería devolver 5, pero devuelve '23'.",
    imageUrl: "https://example.com/user3.jpg",
  },
  {
    role: Role.Bot,
    content:
      "El problema es que estás sumando un número y una cadena. Necesitas convertir la cadena a un número antes de sumarla. Prueba con: function suma(a, b) { return a + Number(b); }",
    imageUrl: "https://example.com/bot3.jpg",
    prompt:
      "Explica al usuario cómo convertir una cadena a un número en JavaScript.",
  },
  {
    role: Role.User,
    content: "¡Gracias! Ahora funciona perfectamente.",
    imageUrl: "https://example.com/user4.jpg",
  },
  {
    role: Role.Bot,
    content: "¡De nada! Si tienes alguna otra duda, no dudes en preguntar.",
    imageUrl: "https://example.com/bot4.jpg",
    prompt: "Anima al usuario a hacer más preguntas si tiene más dudas.",
  },
];

export default function DrawerScreen() {
  const { signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);

  const [key, setKey] = useMMKVString("apiKey", storage);
  const [organization, setOrganization] = useMMKVString("org", storage);
  const [gptVersion, setGptVersion] = useMMKVString("gptVersion", storage);

  if (!key || key === "" || !organization || organization === "") {
    return <Redirect href="/(home)/(modal)/settings" />;
  }

  const getCompletion = async (message: string) => {
    console.log(message);
  };

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
        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessage {...item} />}
          estimatedItemSize={400}
          // keyboardDismissMode="on-drag"
        />
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
