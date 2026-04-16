import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppProvider } from './src/hooks/useAppContext';
import SplashScreen from './src/screens/SplashScreen';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const splashFallbackRef = useRef(null);

  const completeSplash = useCallback(() => {
    setSplashDone(true);
    if (splashFallbackRef.current) {
      clearTimeout(splashFallbackRef.current);
      splashFallbackRef.current = null;
    }
  }, []);

  useEffect(() => {
    // App-level safety net in case splash animation callbacks fail on a device.
    splashFallbackRef.current = setTimeout(completeSplash, 7500);
    return () => {
      if (splashFallbackRef.current) {
        clearTimeout(splashFallbackRef.current);
        splashFallbackRef.current = null;
      }
    };
  }, [completeSplash]);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          {!splashDone ? (
            <SplashScreen onFinish={completeSplash} />
          ) : (
            <AppNavigator />
          )}
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
