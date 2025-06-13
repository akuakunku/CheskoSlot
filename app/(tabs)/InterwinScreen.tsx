import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import CustomWebView, { CustomWebViewRef } from '../components/CustomWebView';

const STORAGE_KEY = 'LAST_INTERWIN_URL';
const DEFAULT_URL = 'https://www.interwins.me/';

export default function InterwinScreen() {
  const [uri, setUri] = useState(DEFAULT_URL);
  const webViewRef = useRef<CustomWebViewRef>(null);
  const route = useRoute();
  const navigation = useNavigation();

  const fetchUrl = async () => {
    try {
      const res = await axios.get('https://raw.githubusercontent.com/akuakunku/CheskoSlot/refs/heads/master/hooks/config.json');
      const data = res.data;
      if (data?.interwin) {
        const cleanUrl = data.interwin.trim().startsWith("http")
          ? data.interwin.trim()
          : `https://${data.interwin.trim()}`;
        setUri(cleanUrl);
        await AsyncStorage.setItem(STORAGE_KEY, cleanUrl);
      } else {
        throw new Error('URL interwin tidak ditemukan');
      }
    } catch {
      const lastUrl = await AsyncStorage.getItem(STORAGE_KEY);
      setUri(lastUrl || DEFAULT_URL);
    }
  };

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  useEffect(() => {
    fetchUrl();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      handleRefresh();
    }
  }, [route.params?.refresh]);

  return (
    <CustomWebView
      ref={webViewRef}
      uri={uri}
      onRefresh={handleRefresh}
    />
  );
}
