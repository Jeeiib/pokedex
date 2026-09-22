import { Poppins_400Regular, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import AnimatedSplash from "@/components/AnimatedSplash";
import { MOTION } from "@/constants/motion";
import { BootProvider } from "@/contexts/BootProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import "@/i18n";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: MOTION.splashReveal.duration, fade: true });

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // L'écran natif se retire dès que les polices sont là : le composant animé
  // prend le relais et c'est lui qui attend les données.
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <BootProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
        <AnimatedSplash />
      </BootProvider>
    </ThemeProvider>
  );
}
