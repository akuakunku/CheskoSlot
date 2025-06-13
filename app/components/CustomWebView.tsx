import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Alert, BackHandler, StyleSheet, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

interface Props {
  uri: string;
}

const CustomWebView = forwardRef(({ uri }: Props, ref) => {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [webUrl, setWebUrl] = useState(uri);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lottieRef = useRef<LottieView>(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [showLottie, setShowLottie] = useState(true);
  const navigation = useNavigation();

  // Menggunakan useImperativeHandle untuk expose fungsi reload
  useImperativeHandle(ref, () => ({
    reload: () => {
      console.log("Reloading WebView...");
      if (webViewRef.current) {
        webViewRef.current.reload();
      }
    },
  }));

  const onRefresh = () => {
    setIsRefreshing(true);
    webViewRef.current?.reload();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setIsRefreshing(false);
        lottieRef.current?.reset();
        setShowLottie(false);
      }
    }, 8000);

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  useEffect(() => {
    if (status?.granted === false) {
      requestPermission();
    }
  }, [status]);

  useEffect(() => {
    setWebUrl(uri);
  }, [uri]);

  const onBackPress = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => backHandler.remove();
  }, [canGoBack]);

  // Confirm and download file
  const handleDownload = (url: string) => {
    Alert.alert(
      "Download Confirmation",
      `Do you want to download this file?\n\n${url}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Download",
          onPress: async () => {
            try {
              const fileUri = FileSystem.documentDirectory + url.split('/').pop();
              const { uri } = await FileSystem.downloadAsync(url, fileUri);
              // Save to media library
              if (status?.granted) {
                await MediaLibrary.saveToLibraryAsync(uri);
                Alert.alert("Download Complete", `File saved to your library:\n${uri}`);
              } else {
                const perm = await requestPermission();
                if (perm.granted) {
                  await MediaLibrary.saveToLibraryAsync(uri);
                  Alert.alert("Download Complete", `File saved to your library:\n${uri}`);
                } else {
                  Alert.alert("Permission denied", "Cannot save file without permission.");
                }
              }
            } catch (error) {
              Alert.alert("Download Failed", "An error occurred while downloading the file.");
              console.warn(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onShouldStartLoadWithRequest = (request: any) => {
    const { url } = request;

    if (
      url.endsWith('.pdf') ||
      url.endsWith('.zip') ||
      url.endsWith('.jpg') ||
      url.endsWith('.png') ||
      url.endsWith('.apk') ||
      url.endsWith('.mp3') ||
      url.endsWith('.mp4')
    ) {
      handleDownload(url);
      return false; 
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: webUrl }}
          style={styles.webView}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUser Action={false}
          cacheEnabled
          setSupportMultipleWindows={false}
          pullToRefreshEnabled
          overScrollMode="always"
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
            setIsLoading(false);
            setIsRefreshing(false);
            setShowLottie(false);
            navigation.navigate("+not-found");
          }}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          onLoadStart={() => {
            setIsLoading(true);
            setShowLottie(true);
            lottieRef.current?.play();
          }}
          onLoadEnd={() => {
            setIsLoading(false);
            setIsRefreshing(false);
            lottieRef.current?.reset();
            setTimeout(() => setShowLottie(false), 300);
          }}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          injectedJavaScriptBeforeContentLoaded={`
            window.open = function(url) { 
              window.location.href = url; 
              return false;
            }; 
            true;
          `}
          injectedJavaScript={`
            setInterval(() => {
              document.querySelectorAll('a[target="_blank"]').forEach(el => el.target = "_self");
            }, 1000);
            true;
          `}
        />

        {showLottie && (
          <Animated.View
            exiting={FadeOut.duration(300)}
            style={styles.loadingContainer}
          >
            <LottieView
              ref={lottieRef}
              source={require("../../assets/images/loading.json")}
              autoPlay
              loop
              style={styles.lottie}
              resizeMode="contain"
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
  },
  lottie: {
    width: 250,
    height: 250,
  },
});

export default CustomWebView;
