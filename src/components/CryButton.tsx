import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAudioPlayer } from "expo-audio";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

import { iconSize, touchArea } from "@/constants/theme";
import { useA11yLanguage } from "@/i18n";
import { resolveCryUrl } from "@/utils/cryUrl";


type CryButtonProps = {
  slug: string;
  officialUrl: string | null;
  name: string;
  color: string;
  onPlay?: () => void;
};

export default function CryButton({ slug, officialUrl, name, color, onPlay }: CryButtonProps) {
  const { t } = useTranslation();
  const a11yLanguage = useA11yLanguage();
  const url = resolveCryUrl(slug, officialUrl);
  const player = useAudioPlayer(url ?? undefined);

  function play() {
    if (!url) {
      return;
    }
    // Rembobiner avant de jouer permet de réappuyer sans attendre la fin.
    // Un fichier absent laisse le lecteur inerte, la fiche continue de vivre.
    player.seekTo(0);
    player.play();
    onPlay?.();
  }

  return (
    <Pressable
      style={touchArea}
      onPress={play}
      disabled={url === null}
      accessibilityRole="button"
      accessibilityLabel={t("detail.playCry", { name })}
      accessibilityLanguage={a11yLanguage}
    >
      <MaterialIcons name="volume-up" size={iconSize.lg} color={color} />
    </Pressable>
  );
}
