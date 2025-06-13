import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import CustomWebView, { CustomWebViewRef } from '../components/CustomWebView';

const STORAGE_KEY = 'LAST_WAJIK_URL';
const DEFAULT_URL = 'https://wajik777.yoga/';

export default function WajikScreen() {
  const [uri, setUri] = useState(DEFAULT_URL);
  const webViewRef = useRef<CustomWebViewRef>(null);
  const route = useRoute();

  const fetchUrl = async () => {
    try {
      const res = await axios.get('https://raw.githubusercontent.com/chesko21/wajik777-webview/refs/heads/master/hooks/config.json');
      const data = res.data;
      if (data?.wajik777) {
        const cleanUrl = data.wajik777.trim().startsWith("http")
          ? data.wajik777.trim()
          : `https://${data.wajik777.trim()}`;
        setUri(cleanUrl);
        await AsyncStorage.setItem(STORAGE_KEY, cleanUrl);
      } else {
        throw new Error('URL wajik777 tidak ditemukan');
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
