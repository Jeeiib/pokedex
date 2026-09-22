import { useEffect, useState } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { MOTION } from "@/constants/motion";
import { typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";
import { formatStatValue } from "@/utils/formatStat";

// 255 est le maximum réel d'une statistique de base, atteint par Leuphorie.
const MAX_BASE_STAT = 255;

// Mesures du fichier Figma : ligne de 16, libellé sur 27, valeur sur 19,
// barre de 4 de haut. La piste est la couleur du type à 20 pour cent.
const ROW_HEIGHT = 16;
const LABEL_WIDTH = 27;
const VALUE_WIDTH = 19;
const BAR_HEIGHT = 4;
const TRACK_OPACITY = 0.2;

type StatBarProps = {
  label: string;
  value: number;
  color: string;
  index: number;
};

export default function StatBar({ label, value, color, index }: StatBarProps) {
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();
  const reducedMotion = useReducedMotion();

  // La largeur est animée en pixels : la piste est mesurée plutôt que d'animer
  // un pourcentage, ce qui évite aussi de déformer les arrondis avec scaleX.
  const [trackWidth, setTrackWidth] = useState(0);
  const width = useSharedValue(0);

  const ratio = Math.min(Math.max(value, 0), MAX_BASE_STAT) / MAX_BASE_STAT;
  const target = ratio * trackWidth;

  useEffect(() => {
    if (trackWidth === 0) {
      return;
    }
    if (reducedMotion) {
      width.value = target;
      return;
    }
    width.value = withDelay(
      index * MOTION.stat.stagger,
      withTiming(target, {
        duration: MOTION.stat.duration,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      })
    );
  }, [target, trackWidth, index, reducedMotion, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: width.value }));

  function measureTrack(event: LayoutChangeEvent) {
    setTrackWidth(event.nativeEvent.layout.width);
  }

  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityLabel={`${label} ${value}`}
      accessibilityValue={{ min: 0, max: MAX_BASE_STAT, now: value }}
      accessibilityLanguage={a11yLanguage}
    >
      <Text style={[styles.label, { color }]}>{label}</Text>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <Text style={[styles.value, { color: theme.textPrimary }]}>{formatStatValue(value)}</Text>
      <View style={styles.trackWrapper} onLayout={measureTrack}>
        <View style={[styles.track, { backgroundColor: color, opacity: TRACK_OPACITY }]} />
        <Animated.View style={[styles.fill, fillStyle, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: ROW_HEIGHT,
  },
  label: {
    ...typography.subtitle3,
    width: LABEL_WIDTH,
    textAlign: "right",
    paddingRight: 4,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: ROW_HEIGHT,
  },
  value: {
    ...typography.body3,
    width: VALUE_WIDTH,
    paddingLeft: 4,
  },
  trackWrapper: {
    flex: 1,
    height: BAR_HEIGHT,
    marginLeft: 8,
    justifyContent: "center",
  },
  track: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: BAR_HEIGHT,
  },
  fill: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT,
  },
});
