import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export const shareImage = async (imageUrl: string) => {
  Sharing.shareAsync(imageUrl);
};

export const copyImageToClipboard = async (imageUrl: string) => {
  const fileUrl = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;

  try {
    const res = await FileSystem.downloadAsync(imageUrl, fileUrl);
    const base64 = await FileSystem.readAsStringAsync(res.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Clipboard.setImageAsync(base64);
  } catch (error) {
    console.log("FS Error: ", error);
  }
};

export const downloadAndSaveImage = async (imageUrl: string) => {
  const fileUrl = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;

  try {
    const res = await FileSystem.downloadAsync(imageUrl, fileUrl);
    return saveFile(res.uri);
  } catch (error) {
    console.log("FS error: ", error);
  }
};

const saveFile = async (fileUri: string) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status === "granted") {
    try {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync("Download ChapGPT");

      if (album == null) {
        const result = await MediaLibrary.createAlbumAsync(
          "Download ChatGPT",
          asset,
          false
        );
        if (result) {
          Alert.alert("Image saved to Photos");
        }
      } else {
        const result = await MediaLibrary.addAssetsToAlbumAsync(
          [asset],
          album,
          false
        );
        if (result) {
          Alert.alert("Image saved to Photos");
        }
      }
    } catch (error) {
      console.log("Save error: ", error);
    }
  } else {
    Alert.alert("Please allow permission to download");
  }
};
