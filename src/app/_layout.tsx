// Layout racine : pose les providers globaux (thème, favoris, démarrage) et
// orchestre la transition entre l'écran de démarrage natif et le splash animé.

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

// L'application n'a aucune police à charger : l'écran de démarrage natif se
// retire dès le premier rendu et le splash animé prend le relais.
export default function RootLayout() {
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
