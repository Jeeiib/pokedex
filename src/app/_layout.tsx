import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import AnimatedSplash from "@/components/AnimatedSplash";
import { MOTION } from "@/constants/motion";
import { BootProvider } from "@/contexts/BootProvider";
import { FavoritesProvider } from "@/contexts/FavoritesProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import "@/i18n";

SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ duration: MOTION.splashReveal.duration, fade: true });

export default function RootLayout() {
  // L'application utilise la police du système : rien à charger, donc l'écran
  // natif se retire dès le premier rendu et le composant animé prend le relais.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <ThemeProvider>
      <FavoritesProvider>
        <BootProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
          <AnimatedSplash />
        </BootProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
