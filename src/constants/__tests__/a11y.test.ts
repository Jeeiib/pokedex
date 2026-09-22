import { toA11yLanguage } from "@/constants/a11y";

describe("toA11yLanguage", () => {
  it("maps the app languages to BCP-47 tags", () => {
    expect(toA11yLanguage("fr")).toBe("fr-FR");
    expect(toA11yLanguage("en")).toBe("en-US");
  });

  it("accepts a regional tag coming from the device", () => {
    expect(toA11yLanguage("fr-CA")).toBe("fr-FR");
    expect(toA11yLanguage("en-GB")).toBe("en-US");
  });

  it("falls back to French for an unsupported language", () => {
    expect(toA11yLanguage("de")).toBe("fr-FR");
  });
});
