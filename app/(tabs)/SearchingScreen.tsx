// app/tabs/SearchingScreen.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import CustomWebView from "../components/CustomWebView";

export default function SearchingScreen() {
  // Set the initial URL to load in the CustomWebView
  const initialUrl = "https://www.google.com";

  return (
    <View style={styles.container}>
      <View style={styles.webviewContainer}>
        <CustomWebView uri={initialUrl} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
