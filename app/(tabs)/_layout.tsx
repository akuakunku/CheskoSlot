import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AboutScreen from './AboutScreen';
import HomeScreen from './index';
import InterwinScreen from './InterwinScreen';
import PenidamaxWinScreen from './PenidamaxWinScreen';
import RacuntotoScreen from './RacuntotoScreen';
import SearchingScreen from './SearchingScreen';
import TotosuperScreen from './TotosuperScreen';
import TutorialScreen from './TutorialScreen';
import WajikScreen from './WajikScreen';

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

const screenWithRefresh = (label: string, iconName: string) => ({ navigation }) => {
  const lottieRef = useRef < LottieView > (null);

  const handleRefresh = () => {
    lottieRef.current?.play();
    setTimeout(() => lottieRef.current?.reset(), 1000);
    navigation.setParams({ refresh: Date.now() });
  };

  return {
    drawerLabel: label,
    drawerIcon: ({ color, size }) => (
      <Ionicons name={iconName} size={size} color={color} />
    ),
    headerRight: () => (
      <TouchableOpacity onPress={handleRefresh} style={{ marginRight: 15 }}>
        <Ionicons name="refresh" size={24} color="#ffff" />
      </TouchableOpacity>
    ),
  };
};

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: {
            width: width / 2,
          },
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={screenWithRefresh('Home', 'home-outline')}
        />
        <Drawer.Screen
          name="Wajik777"
          component={WajikScreen}
          options={screenWithRefresh('Wajik777', 'game-controller-outline')}
        />
        <Drawer.Screen
          name="Racuntoto"
          component={RacuntotoScreen}
          options={screenWithRefresh('Racuntoto', 'cash-outline')}
        />
        <Drawer.Screen
          name="Totosuper"
          component={TotosuperScreen}
          options={screenWithRefresh('Totosuper', 'diamond-outline')}
        />
        <Drawer.Screen
          name="PenidamaxWin"
          component={PenidamaxWinScreen}
          options={screenWithRefresh('PenidamaxWin', 'desktop-outline')}
        />
        <Drawer.Screen
          name="Interwin"
          component={InterwinScreen}
          options={screenWithRefresh('Interwin', 'trophy-outline')}
        />
        <Drawer.Screen
          name="SearchingScreen"
          component={SearchingScreen}
          options={{
            drawerLabel: 'Search',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="globe-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Tutorial"
          component={TutorialScreen}
          options={screenWithRefresh('Tutorial', 'help-circle-outline')}
        />
        <Drawer.Screen
          name="About"
          component={AboutScreen}
          options={{
            drawerLabel: 'About',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="information-circle-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}