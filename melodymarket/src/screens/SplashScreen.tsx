import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import StorageService from '../services/StorageService';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const logoScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimations = async () => {
      // Logo animation
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      // Text animation
      setTimeout(() => {
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }, 800);

      // Loading animation
      setTimeout(() => {
        Animated.timing(loadingOpacity, {
          toValue: 0.7,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1500);

      // Initialize app
      await StorageService.init();
      
      // Navigate after animations
      setTimeout(() => {
        onFinish();
      }, 3000);
    };

    startAnimations();
  }, []);

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary, colors.tertiary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logo}>
            <Ionicons name="musical-notes" size={60} color="#FFFFFF" />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
            },
          ]}
        >
          <Text style={styles.title}>MelodyMarket</Text>
          <Text style={styles.subtitle}>Where Music Meets Opportunity</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: loadingOpacity,
            },
          ]}
        >
          <View style={styles.loadingIndicator} />
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#FFFFFF',
  },
});

export default SplashScreen;