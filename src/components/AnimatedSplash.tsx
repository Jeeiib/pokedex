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

// Doit rester identique à l'écran natif déclaré dans app.json : même fond,
// même largeur d'image, sinon la bascule se voit.
const SPLASH_BACKGROUND = lightTheme.primary;
const BALL_WIDTH = 160;
const EXIT_SCALE = 1.15;
const FULL_TURN = 360;

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
    // Le lancé : la Pokéball part vers le haut, retombe, rebondit.
    lift.value = withSequence(
      withTiming(-MOTION.splashThrow.lift, {
        duration: MOTION.splashThrow.duration,
        easing: Easing.out(Easing.quad),
        reduceMotion: ReduceMotion.System,
      }),
      withSpring(0, { ...MOTION.spring, reduceMotion: ReduceMotion.System })
    );
    // La rotation tourne en boucle tant que les données ne sont pas là.
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
    // Le fond du départ est celui de l'écran liste : un simple fondu suffit,
    // aucun raccord de couleur n'est possible.
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
        source={require("../../assets/images/splash-icon.png")}
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
