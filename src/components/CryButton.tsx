// Bouton qui joue le cri du Pokémon, désactivé quand aucune source audio n'est
// disponible.

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

// Rejoue le cri depuis le début à chaque appui, sans jamais bloquer la fiche si
// le fichier est introuvable.
export default function CryButton({ slug, officialUrl, name, color, onPlay }: CryButtonProps) {
  const { t } = useTranslation();
  const a11yLanguage = useA11yLanguage();
  const url = resolveCryUrl(slug, officialUrl);
  const player = useAudioPlayer(url ?? undefined);

  function play() {
    if (!url) {
      return;
    }
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
