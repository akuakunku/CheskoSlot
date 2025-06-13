import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { slotLinks } from "../../constants/slotLinks";

function CustomAlert({ visible, message, onClose }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.alertOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertMessage}>{message}</Text>
          <TouchableOpacity style={styles.alertButton} onPress={onClose}>
            <Text style={styles.alertButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function NeonBorderImage({ source }) {
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFD700", "#FF00FF"],
  });

  return (
    <Animated.Image
      source={source}
      style={[styles.realBanner, { borderColor, borderWidth: 4 }]}
      resizeMode="cover"
    />
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const scrollAnim = useRef(new Animated.Value(300)).current;
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setAlertVisible(true);
  };

  useEffect(() => {
    scrollAnim.setValue(0);
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -2000,
        duration: 30000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        console.log("Data refreshed!");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [route.params?.refresh]);

  const bannerSites = [
    require("../../assets/images/6905b362999031.5aa25561f369f.jpg"),
    require("../../assets/images/67307262999031.5aa25562025d0.jpg"),
    require("../../assets/images/edfdb662999031.5f9eb65e6ee24.jpg"),
  ];

  // Auto slide banner
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const totalBanners = bannerSites.length;
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= totalBanners) nextIndex = 0;

      scrollRef.current?.scrollTo({
        x: nextIndex * (300 + 16),
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, bannerSites.length]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <ImageBackground
        source={require("../../assets/images/bg.jpg")}
        style={styles.overlay}
      >
        <ScrollView>
          <View style={styles.container} />

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* -- KONTEN UTAMA -- */}
            <View style={{ alignItems: "center", marginTop: 20, marginBottom: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{
                    uri: "https://images.linkcdn.cloud/V2/528/logo/logo-1275677494.png",
                  }}
                  style={styles.logo}
                />
                <Text style={styles.title}>Wajik777</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>
              Situs Permainan Online No. 1 di Indonesia 🎰💸
            </Text>

            <View style={styles.marquee}>
              <Animated.Text
                style={[
                  styles.marqueeText,
                  { left: 0, transform: [{ translateX: scrollAnim }] },
                ]}
              >
                🎉 Selamat datang di Wajik777! 🔥 Jackpot menanti kamu setiap hari! 💰 Ayo main sekarang juga!
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.marqueeText,
                  { left: 2000, transform: [{ translateX: scrollAnim }] },
                ]}
              >
                🎉 Selamat datang di Wajik777! 🔥 Jackpot menanti kamu setiap hari! 💰 Ayo main sekarang juga!
              </Animated.Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Wajik777")}
              >
                <Text style={styles.buttonText}>🎮 Mainkan Sekarang</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.slotRow}>
              {slotLinks.map(({ uri, screen }, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (screen) {
                      navigation.navigate(screen);
                    } else {
                      showAlert("🎯 Fitur ini akan segera hadir! Stay tuned 😎");
                    }
                  }}
                  style={styles.slotContainer}
                >
                  <Image source={{ uri }} style={styles.slotIcon} resizeMode="contain" />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name="slot-machine" size={16} color="#FFD700" />
                    <Text style={styles.slotLabel}>{screen || 'Coming Soon'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <CustomAlert
              visible={alertVisible}
              message={alertMessage}
              onClose={() => setAlertVisible(false)}
            />
          </ScrollView>
          
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bannerCarousel}
            scrollEnabled={false}
          >
            {bannerSites.map((source, i) => (
              <NeonBorderImage key={i} source={source} />
            ))}
          </ScrollView>

          {/* Modal Loading */}
          <Modal visible={loading} transparent animationType="fade">
            <View style={styles.loadingContainer}>
              <LottieView
                source={require("../../assets/images/loading.json")}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    padding: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
  logo: {
    width: 60,
    height: 30,
    resizeMode: "contain",
    marginRight: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    textShadowColor: "#FF00FF",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#FF00FF",
    textShadowColor: "#FFD700",
    textAlign: "center",
    marginBottom: 12,
  },
  marquee: {
    overflow: "hidden",
    height: 30,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  marqueeText: {
    fontSize: 14,
    fontWeight: "bold",
    whiteSpace: "nowrap",
    color: "#000",
    width: 2000,
    position: "absolute",
  },
  realBanner: {
    width: 300,
    height: 120,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  bannerCarousel: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#FF1493",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 30,
    marginVertical: 5,
    shadowColor: "#f75",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
    borderColor: "#ff0",
    borderWidth: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  slotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "center",
    paddingHorizontal: 8,
  },
  slotContainer: {
    width: "33.33%",
    padding: 8,
    alignItems: "center",
  },
  slotIcon: {
    width: 90,
    height: 90,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFD700",
    backgroundColor: "#000"
  },
  slotLabel: {
    marginTop: 6,
    color: "#FFD700",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    backgroundColor: "#121212",
    padding: 14,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FF1493",
    width: "80%",
    alignItems: "center",
    shadowColor: "#FF1493",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  alertMessage: {
    fontSize: 14,
    color: "#FFD700",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "700",
  },
  alertButton: {
    backgroundColor: "#FF1493",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  alertButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});