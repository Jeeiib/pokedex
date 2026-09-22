import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { spacing, typography } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeProvider";
import { useA11yLanguage } from "@/i18n";

type ErrorMessageProps = {
  message: string;
  onRetry: () => void;
};

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const a11yLanguage = useA11yLanguage();

  return (
    <View style={styles.container}>
      <Text
        style={[styles.message, { color: theme.textPrimary }]}
        accessibilityLanguage={a11yLanguage}
      >
        {message}
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.primary, opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel={t("state.retry")}
        accessibilityLanguage={a11yLanguage}
      >
        <Text style={[styles.buttonLabel, { color: theme.onPrimary }]}>{t("state.retry")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  message: {
    ...typography.body1,
    textAlign: "center",
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
  },
  buttonLabel: {
    ...typography.subtitle1,
  },
});
