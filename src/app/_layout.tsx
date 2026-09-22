import { Poppins_400Regular, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
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
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  // Un échec de chargement ne doit pas bloquer l'application : elle continue
  // sans les polices personnalisées plutôt que de rester sur l'écran natif.
  const ready = fontsLoaded || fontError !== null;

  // L'écran natif se retire dès que les polices sont là : le composant animé
  // prend le relais et c'est lui qui attend les données.
  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

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
