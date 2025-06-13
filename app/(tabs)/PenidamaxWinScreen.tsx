import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import CustomWebView, { CustomWebViewRef } from '../components/CustomWebView';

const STORAGE_KEY = 'LAST_PENIDAMAXWIN_URL';
const DEFAULT_URL = 'https://penidamaxwin.com/mobile'; 

export default function PenidamaxWinScreen() {
const [uri, setUri] = useState(DEFAULT_URL);
  const webViewRef = useRef<CustomWebViewRef>(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { refresh } = route.params || {};
  
  const fetchUrl = async () => {
    try {
      const res = await axios.get(
        'https://raw.githubusercontent.com/chesko21/wajik777-webview/refs/heads/master/hooks/config.json'
      );
      const data = res.data;
      if (data?.penidamaxwin) {
        const cleanUrl = data.penidamaxwin.trim().startsWith("http")
          ? data.penidamaxwin.trim()
          : `http://${data.penidamaxwin.trim()}`;
        setUri(cleanUrl);
        await AsyncStorage.setItem(STORAGE_KEY, cleanUrl);
      } else {
        throw new Error('URL penidamaxwin tidak ditemukan');
      }
    } catch {
      const lastUrl = await AsyncStorage.getItem(STORAGE_KEY);
      if (lastUrl) setUri(lastUrl);
      else setUri(DEFAULT_URL);
    }
  };


  
  const handleRefresh = async () => {
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
