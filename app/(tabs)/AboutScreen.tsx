import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.shadowContainer}>
          <Text style={styles.title}>Tentang Aplikasi Ini</Text>

          <Text style={styles.paragraph}>
            Aplikasi ini dirancang untuk membantu Anda menemukan situs web slot online yang terpercaya dan terkemuka. Kami bertujuan untuk menyederhanakan proses penemuan platform yang andal untuk hiburan Anda.
          </Text>

          <Text style={styles.paragraph}>
            Kami memahami kekhawatiran Anda tentang keamanan saat menjelajahi situs web slot online. Oleh karena itu, kami hanya menampilkan situs-situs yang telah kami verifikasi secara ketat untuk memastikan keabsahan dan keamanannya.
          </Text>

          <Text style={styles.paragraph}>
            Kami ingin meyakinkan Anda bahwa aplikasi ini aman dan tidak terlibat dalam phishing atau aktivitas berbahaya lainnya. Keamanan dan privasi Anda adalah prioritas utama kami. Kami tidak pernah meminta atau menyimpan informasi pribadi Anda.
          </Text>

          <Text style={styles.title}>Izin</Text>

          <Text style={styles.paragraph}>
            Aplikasi ini meminta izin berikut:
          </Text>

          <Text style={styles.listItem}>
            - **Penyimpanan:** Untuk menyimpan cache aplikasi, gambar, dan file penting lainnya untuk meningkatkan kinerja dan pengalaman pengguna.
          </Text>

          <Text style={styles.paragraph}>
            Kami **TIDAK** mengumpulkan data pribadi apa pun dari Anda. Izin yang diminta semata-mata untuk tujuan meningkatkan fungsionalitas aplikasi dan pengalaman Anda secara keseluruhan. Kami berkomitmen untuk menjaga privasi Anda dan memberikan pengalaman yang aman dan terpercaya.
          </Text>

          <Text style={styles.footer}>
            Terima kasih telah menggunakan aplikasi kami! Kami harap Anda menikmati pengalaman menjelajahi situs slot online yang aman dan terpercaya.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212', 
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFD700', 
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: '#FFD700', 
    textAlign: 'justify',
  },
  listItem: {
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 5,
    lineHeight: 24,
    color: '#FFD700', 
  },
  footer: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    color: '#FFD700', 
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#212121',
    padding: 20,
    borderRadius: 10,
  },
});

export default AboutScreen;