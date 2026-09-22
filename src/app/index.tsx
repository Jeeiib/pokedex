import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";

export default function Index() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text
        style={[styles.title, { color: theme.textPrimary }]}
        accessibilityLanguage={a11yLanguage}
      >
        {t("app.title")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.headline,
  },
});
