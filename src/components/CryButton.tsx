import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAudioPlayer } from "expo-audio";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

import { useA11yLanguage } from "@/i18n";
import { resolveCryUrl } from "@/utils/cryUrl";

const ICON_SIZE = 24;

type CryButtonProps = {
  slug: string;
  officialUrl: string | null;
  name: string;
  color: string;
};

export default function CryButton({ slug, officialUrl, name, color }: CryButtonProps) {
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
  }

  return (
    <Pressable
      onPress={play}
      hitSlop={12}
      disabled={url === null}
      accessibilityRole="button"
      accessibilityLabel={t("detail.playCry", { name })}
      accessibilityLanguage={a11yLanguage}
    >
      <MaterialIcons name="volume-up" size={ICON_SIZE} color={color} />
    </Pressable>
  );
}
