import { darkTheme, lightTheme } from "@/constants/theme";

function luminance(hex: string) {
  const channels = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

describe("lightTheme", () => {
  it("keeps the figma values", () => {
    expect(lightTheme.background).toBe("#EFEFEF");
    expect(lightTheme.primary).toBe("#DC0A2D");
  });

  it("meets WCAG AA for text on background and surface", () => {
    expect(contrast(lightTheme.textPrimary, lightTheme.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(lightTheme.textPrimary, lightTheme.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(lightTheme.textSecondary, lightTheme.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(lightTheme.textSecondary, lightTheme.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("meets WCAG AA for the label on the red banner", () => {
    expect(contrast(lightTheme.onPrimary, lightTheme.primary)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("darkTheme", () => {
  it("exposes the same keys as the light theme", () => {
    expect(Object.keys(darkTheme).sort()).toEqual(Object.keys(lightTheme).sort());
  });

  it("meets WCAG AA for text on background and surface", () => {
    expect(contrast(darkTheme.textPrimary, darkTheme.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(darkTheme.textPrimary, darkTheme.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(darkTheme.textSecondary, darkTheme.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(darkTheme.textSecondary, darkTheme.surface)).toBeGreaterThanOrEqual(4.5);
  });

  // Le rouge d'identité ne donne que 3,24 en texte sur fond sombre.
  it("lightens the red used as text", () => {
    expect(darkTheme.primaryText).not.toBe(lightTheme.primaryText);
    expect(contrast(darkTheme.primaryText, darkTheme.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the identity red as a background", () => {
    expect(darkTheme.primary).toBe("#DC0A2D");
    expect(contrast(darkTheme.onPrimary, darkTheme.primary)).toBeGreaterThanOrEqual(4.5);
  });
});
