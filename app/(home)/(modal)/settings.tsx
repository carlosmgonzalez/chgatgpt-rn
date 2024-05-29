import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/utils/Storage";
import { defaultStyles } from "@/constants/Styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const [key, setKey] = useMMKVString("apiKey", storage);
  const [org, setOrg] = useMMKVString("org", storage);

  const [apiKey, setApiKey] = useState(key || "");
  const [organization, setOrganization] = useState(org || "");

  const saveApiKey = () => {
    setKey(apiKey);
    setOrg(organization);
    router.navigate("/(home)/(drawer)/(chat)/new");
  };

  const removeApiKey = () => {
    setKey("");
    setOrg("");
    setApiKey("");
    setOrganization("");
  };

  return (
    <View style={styles.container}>
      {key && key !== "" && (
        <>
          <Text style={styles.label}>You are all set!</Text>
          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={() => removeApiKey()}
          >
            <Text style={styles.buttonText}>Remove API Key</Text>
          </TouchableOpacity>
        </>
      )}
      {(!key || key === "") && (
        <>
          <Text style={styles.label}>API Key & Organization:</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your API key"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={organization}
            onChangeText={setOrganization}
            placeholder="Enter your organization"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={saveApiKey}
          >
            <Text style={styles.buttonText}>Save API Key</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        onPress={() => signOut()}
        style={[
          defaultStyles.btn,
          {
            backgroundColor: "#fa284b",
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          },
        ]}
      >
        <Text style={styles.buttonSignOut}>Sign Out</Text>
        <Ionicons name="log-out-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  buttonSignOut: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
