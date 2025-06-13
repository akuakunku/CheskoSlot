import NetInfo from '@react-native-community/netinfo';
import { useRoute } from '@react-navigation/native';
import * as IntentLauncher from 'expo-intent-launcher';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import { SafeAreaView } from 'react-native-safe-area-context';
import WifiManager from 'react-native-wifi-reborn';

export default function TutorialScreen() {
  const route = useRoute();
  const { refresh } = route.params || {};
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [ipType, setIpType] = useState<string>('Memuat...');
  const [gatewayIp, setGatewayIp] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [ssid, setSsid] = useState<string | null>(null);
  const [wifiSignalStrength, setWifiSignalStrength] = useState<number | null>(null);
  const { WifiModule } = NativeModules;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const state = await NetInfo.fetch();
      setConnectionType(state.type);
      await fetchNetworkInfo(state.type);
    } catch (error) {
      console.error('Refresh error:', error);
      Alert.alert('Error', 'Gagal mengecek koneksi internet, coba aktifkan lokasi');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const fetchNetworkInfo = async (type: string | null) => {
    try {
      const ip = await NetworkInfo.getIPAddress();
      setIpAddress(ip);
      setIpType(ip?.includes(':') ? 'IPv6' : ip?.includes('.') ? 'IPv4' : 'Tidak Diketahui');

      const gateway = await NetworkInfo.getGatewayIPAddress();
      setGatewayIp(gateway);

      if (type === 'wifi') {
        const hasPermission = await requestLocationPermission();
        if (hasPermission) {
          const currentSsid = await WifiManager.getCurrentWifiSSID();
          setSsid(currentSsid || 'Unknown');
        } else {
          showLocationAlert();
        }
      } else {
        setSsid(null);
      }

      if (Platform.OS === 'android' && type === 'wifi' && WifiModule) {
        try {
          const rssi = await WifiModule.getCurrentWifiSignalStrength();
          setWifiSignalStrength(rssi);
        } catch (error) {
          console.error('Signal strength error:', error);
          setWifiSignalStrength(null);
        }
      }
    } catch (error) {
      console.error('Network info error:', error);
      Alert.alert('Error', 'Gagal mendapatkan informasi jaringan');
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Izin Lokasi Diperlukan',
          message: 'Aplikasi memerlukan izin lokasi untuk mendeteksi jaringan WiFi',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const showLocationAlert = () => {
    Alert.alert(
      'Aktifkan Lokasi',
      'Aplikasi memerlukan layanan lokasi untuk mendeteksi jaringan WiFi. Silakan aktifkan lokasi di pengaturan perangkat Anda.',
      [
        {
          text: 'Buka Pengaturan',
          onPress: () => Linking.openSettings(),
        },
        {
          text: 'Tutup',
          style: 'cancel',
        },
      ]
    );
  };

  useEffect(() => {
    const init = async () => {
      const state = await NetInfo.fetch();
      setConnectionType(state.type);
      await fetchNetworkInfo(state.type);
    };
    init();
  }, []);

  useEffect(() => {
    if (refresh) handleRefresh();
  }, [refresh, handleRefresh]);

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const openNetworkSettings = async () => {
    try {
      const state = await NetInfo.fetch();
      if (Platform.OS === 'android') {
        if (state.type === 'wifi') {
          await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.WIFI_SETTINGS);
        } else if (state.type === 'cellular') {
          await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.NETWORK_OPERATOR_SETTINGS);
        } else {
          Alert.alert('Tidak terhubung ke jaringan', 'Silakan periksa koneksi Anda.');
        }
      } else {
        await Linking.openURL('App-Prefs:root=WIFI');
      }
    } catch (error) {
      console.error('Settings error:', error);
      Alert.alert('Error', 'Tidak bisa membuka pengaturan jaringan');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.stepBox, { marginTop: 2 }]}>
          <Text style={styles.stepTitle}>📡 Info Jaringan Perangkat</Text>
          <View style={styles.networkInfoContainer}>
            {isRefreshing && <ActivityIndicator size="small" color="#FFCC00" />}
            <Text style={styles.infoWifi}>
              Status: <Text style={styles.highlightText}>{connectionType || 'Tidak diketahui'}</Text>
            </Text>
            {connectionType === 'wifi' && (
              <>
                <Text style={styles.infoWifi}>
                  SSID: <Text style={styles.highlightText}>{ssid || 'Memuat...'}</Text>
                </Text>
                {wifiSignalStrength !== null && (
                  <Text style={styles.infoWifi}>
                    Sinyal: <Text style={styles.highlightText}>{wifiSignalStrength} dBm</Text>
                  </Text>
                )}
              </>
            )}
            <Text style={styles.infoWifi}>
              IP ({ipType}): <Text style={styles.codeInline}>{ipAddress || 'Memuat...'}</Text>
            </Text>
            <Text style={styles.infoWifi}>
              Gateway: <Text style={styles.codeInline}>{gatewayIp || 'Memuat...'}</Text>
            </Text>
          </View>
          <Text style={styles.note}>*Info ini berguna untuk mengecek koneksi jaringan lokal</Text>
          <Text style={styles.note}>*Tekan refresh jika informasi tidak terdeteksi</Text>
          <TouchableOpacity 
            onPress={handleRefresh} 
            style={styles.refreshButton}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color="#FFCC00" />
            ) : (
              <Text style={styles.refreshText}>🔄 Refresh Jaringan</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.title}>🔐 Akses Diblokir oleh Provider?</Text>
        </View>
        <Text style={styles.subtitle}>
          Tenang! Ini beberapa cara mudah untuk tetap bisa membuka situs kami:
        </Text>

        <View style={styles.stepBox}>
          <Text style={styles.stepTitle}>1. Gunakan DNS Cloudflare (Ubah DNS di Android)</Text>
          <Text style={styles.stepText}>Ikuti langkah mudah ini untuk mengganti DNS agar akses situs lancar:</Text>
          <Text style={styles.stepText}>• Buka Pengaturan (Settings) di HP kamu.</Text>
          <Text style={styles.stepText}>• Pilih "Jaringan & Internet" atau "Connections".</Text>
          <Text style={styles.stepText}>• Tap "Wi-Fi", lalu pilih jaringan Wi-Fi yang sedang terhubung.</Text>
          <Text style={styles.stepText}>• Scroll ke bawah, cari "Advanced" atau "Setelan Lanjutan".</Text>
          <Text style={styles.stepText}>
            • Cari opsi "IP Settings" dan ubah dari DHCP ke Static.
          </Text>
          <Text style={styles.stepText}>
            • Pada bagian DNS 1, isi dengan <Text style={styles.codeInline}>1.1.1.1</Text>
          </Text>
          <Text style={styles.stepText}>
            • Pada bagian DNS 2, isi dengan <Text style={styles.codeInline}>1.0.0.1</Text>
          </Text>
          <Text style={styles.stepText}>• Simpan pengaturan dan coba akses situs lagi.</Text>
          <Text style={styles.note}>
            *Catatan: Langkah bisa sedikit berbeda tergantung merk dan versi Android kamu.
          </Text>
          <TouchableOpacity onPress={openNetworkSettings} style={styles.button}>
            <Text style={styles.buttonText}>🔧 Buka Pengaturan Jaringan Hp Anda</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stepBox}>
          <Text style={styles.stepTitle}>2. Gunakan Aplikasi VPN</Text>
          <Text style={styles.stepText}>Unduh aplikasi VPN gratis seperti:</Text>
          <TouchableOpacity onPress={() => openLink('https://1.1.1.1/')}>
            <Text style={styles.link}>⚡ 1.1.1.1 by Cloudflare</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openLink(
                'https://play.google.com/store/apps/details?id=free.vpn.unblock.proxy.turbovpn&pcampaignid=web_share'
              )
            }
          >
            <Text style={styles.link}>🚀 Turbo VPN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://play.google.com/store/apps/details?id=com.windscribe.vpn')}>
            <Text style={styles.link}>🌬️ Windscribe VPN</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stepBox}>
          <Text style={styles.stepTitle}>3. Pakai Browser dengan VPN Bawaan</Text>
          <Text style={styles.stepText}>Contoh: Opera Browser atau Brave.</Text>
        </View>
        <Text style={styles.footer}>Masih bingung? Hubungi CS kami untuk bantuan lebih lanjut.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    padding: 10,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginBottom: 10,
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#DDD',
    marginBottom: 20,
  },
  networkInfoContainer: {
    marginVertical: 15,
  },
  infoWifi: {
    fontSize: 16,
    color: '#EEE',
    marginBottom: 8,
  },
  highlightText: {
    color: '#FFCC00',
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshText: {
    color: '#FFF',
    fontWeight: '600',
  },
  stepBox: {
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
  },
  stepTitle: {
    fontSize: 18,
    color: '#FF9900',
    marginBottom: 5,
    textAlign: 'center',
  },
  stepText: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 3,
  },
  codeInline: {
    fontFamily: 'monospace',
    color: '#0ff',
    fontWeight: 'bold',
  },
  link: {
    fontSize: 14,
    color: '#00BFFF',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    fontSize: 15,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 10,
  },
  note: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 6,
  },
});
