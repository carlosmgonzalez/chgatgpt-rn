import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { ErrorSignUp } from "@/interfaces/error-signup";

export default function LoginScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();

  const {
    isLoaded: isLoadedSignUp,
    signUp,
    setActive: setActiveSignUp,
  } = useSignUp();
  const {
    isLoaded: isLoadedSignIn,
    signIn,
    setActive: setActiveSignIn,
  } = useSignIn();

  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    if (!isLoadedSignUp) return;

    try {
      setLoading(true);

      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      Alert.alert(error.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoadedSignUp) return;

    try {
      setLoading(true);

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActiveSignUp({ session: completeSignUp.createdSessionId });
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onLoginPress = async () => {
    if (!isLoadedSignIn) return;

    try {
      setLoading(true);

      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActiveSignIn({ session: completeSignIn.createdSessionId });
    } catch (error: any) {
      console.log(error);
      Alert.alert(error.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      behavior={"position"}
      style={styles.container}
    >
      <ScrollView>
        {loading && (
          <View style={defaultStyles.loadingOverlay}>
            <ActivityIndicator size={40} color="black" />
          </View>
        )}
        <Image
          source={require("@/assets/images/logo-dark.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>
          {type === "login" ? "Welcome back" : "Create your account"}
        </Text>
        <View style={{ marginBottom: 30 }}>
          <TextInput
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email"
            style={styles.inputField}
            value={emailAddress}
            onChangeText={(text) => setEmailAddress(text)}
          />
          <TextInput
            autoCapitalize="none"
            secureTextEntry
            placeholder="Password"
            style={styles.inputField}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {type === "login" ? (
          <TouchableOpacity
            onPress={onLoginPress}
            style={[defaultStyles.btn, styles.btnPrimary]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size={30} color="white" />
            ) : (
              <Text style={styles.btnPrimaryText}>Login</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onSignUpPress}
            style={[defaultStyles.btn, styles.btnPrimary]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size={30} color="white" />
            ) : (
              <Text style={styles.btnPrimaryText}>Create account</Text>
            )}
          </TouchableOpacity>
        )}

        {pendingVerification && (
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              onChangeText={(code) => setCode(code)}
              style={[
                styles.inputField,
                { borderColor: "blue", marginTop: 40 },
              ]}
            />
            <TouchableOpacity
              onPress={onPressVerify}
              style={[defaultStyles.btn, { backgroundColor: "blue" }]}
            >
              <Text style={styles.btnPrimaryText}>Verify Email</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: "center",
    marginVertical: 80,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
  },
});
