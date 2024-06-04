import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { downloadAndSaveImage, shareImage } from "@/utils/ImageOptions";
import { DropDownMenu } from "@/components";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { useCallback, useMemo, useRef } from "react";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

export default function Page() {
  const { prompt, url } = useLocalSearchParams<{
    url: string;
    prompt?: string;
  }>();
  const { bottom } = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  const snapPoints = useMemo(() => ["40%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const onCopyPrompt = () => {
    Clipboard.setStringAsync(prompt!);
    Toast.show({
      type: "success",
      text1: "Prompt copied to clipboard 📎",
      position: "top",
      topOffset: 90,
    });
  };

  return (
    <View style={styles.container}>
      <Toast />
      <BottomSheetModalProvider>
        <Stack.Screen
          options={{
            headerRight: () => (
              <DropDownMenu
                items={[
                  { key: "1", title: "View prompt", icon: "info.circle" },
                  {
                    key: "2",
                    title: "Learn more",
                    icon: "questionmark.circle",
                  },
                ]}
                onSelect={handlePresentModalPress}
              />
            ),
          }}
        />
        <ImageZoom
          uri={url}
          style={styles.image}
          minScale={0.5}
          maxScale={5}
          minPanPointers={1}
          doubleTapScale={2}
          isSingleTapEnabled
          isDoubleTapEnabled
          resizeMode="contain"
        />
        <BlurView
          intensity={60}
          tint="dark"
          style={[styles.blurView, { paddingBottom: bottom }]}
        >
          <View style={styles.row}>
            <TouchableOpacity style={{ alignItems: "center" }}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="white"
              />
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }}>
              <Ionicons name="brush-outline" size={24} color="white" />
              <Text style={styles.btnText}>Select</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => downloadAndSaveImage(url!)}
            >
              <Octicons name="download" size={24} color="white" />
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => shareImage(url!)}
            >
              <Octicons name="share" size={24} color="white" />
              <Text style={styles.btnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: Colors.light }}
          handleIndicatorStyle={{ backgroundColor: Colors.grey }}
        >
          <View style={[styles.modalContainer, { paddingBottom: bottom }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.titleText}>Prompt</Text>
              <Pressable
                onPress={handleCloseModalPress}
                style={styles.btnClose}
              >
                <Ionicons name="close-outline" size={24} color="#fff" />
              </Pressable>
            </View>
            <BottomSheetScrollView>
              <Text style={styles.promptText}>{prompt}</Text>
            </BottomSheetScrollView>
            <TouchableOpacity
              style={[
                defaultStyles.btn,
                { backgroundColor: "#000", marginTop: 16, marginBottom: 16 },
              ]}
              onPress={onCopyPrompt}
            >
              <Text style={styles.buttonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <StatusBar hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  blurView: {
    width: "100%",
    bottom: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    paddingTop: 6,
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  promptText: {
    color: "#000",
    fontSize: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  btnClose: {
    backgroundColor: Colors.dark,
    borderRadius: 20,
    height: 26,
    width: 26,
    alignItems: "center",
    justifyContent: "center",
  },
});
