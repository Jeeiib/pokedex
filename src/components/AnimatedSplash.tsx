// Écran de démarrage animé qui reproduit le splash natif avant de s'effacer une
// fois les données prêtes.

import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { MOTION } from "@/constants/motion";
import { lightTheme } from "@/constants/theme";
import { useBoot } from "@/contexts/BootProvider";

const SPLASH_BACKGROUND = lightTheme.primary;
const BALL_WIDTH = 160;
const EXIT_SCALE = 1.15;
const FULL_TURN = 360;

// Fait tourner la pokéball en boucle pendant le chargement, puis l'agrandit et
// l'estompe dès que les données sont disponibles.
export default function AnimatedSplash() {
  const { dataReady } = useBoot();
  const reducedMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  const lift = useSharedValue(0);
  const spin = useSharedValue(0);
  const scale = useSharedValue(1);
  const fade = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    lift.value = withSequence(
      withTiming(-MOTION.splashThrow.lift, {
        duration: MOTION.splashThrow.duration,
        easing: Easing.out(Easing.quad),
        reduceMotion: ReduceMotion.System,
      }),
      withSpring(0, { ...MOTION.spring, reduceMotion: ReduceMotion.System })
    );
    spin.value = withRepeat(
      withTiming(FULL_TURN, {
        duration: MOTION.splashSpin.duration,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      false
    );
  }, [lift, spin, reducedMotion]);

  useEffect(() => {
    if (!dataReady) {
      return;
    }
    cancelAnimation(spin);
    scale.value = withTiming(EXIT_SCALE, {
      duration: MOTION.splashReveal.duration,
      easing: Easing.in(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
    fade.value = withTiming(0, {
      duration: MOTION.splashReveal.duration,
      easing: Easing.in(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
    const timeout = setTimeout(() => setHidden(true), MOTION.splashReveal.duration + 60);
    return () => clearTimeout(timeout);
  }, [dataReady, spin, scale, fade]);

  const ballStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: lift.value },
      { rotate: `${spin.value}deg` },
      { scale: scale.value },
    ],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  if (hidden) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.Image
        source={require("@/assets/images/splash-icon.png")}
        style={[styles.ball, ballStyle]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: SPLASH_BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
  },
  ball: {
    width: BALL_WIDTH,
    height: BALL_WIDTH,
  },
});
