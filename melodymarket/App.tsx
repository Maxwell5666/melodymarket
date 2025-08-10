import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Audio } from 'expo-av';

import SplashScreenComponent from './src/screens/SplashScreen';
import BottomNavBar from './src/components/BottomNavBar';
import { Colors } from './src/constants/Colors';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  useEffect(() => {
    async function prepare() {
      try {
        // Configure audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  const onSplashFinish = async () => {
    setIsReady(true);
    await SplashScreen.hideAsync();
  };

  if (!isReady) {
    return <SplashScreenComponent onFinish={onSplashFinish} />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <BottomNavBar />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});