// Vérifie que le texte de description est nettoyé des séparateurs et des
// espaces propres au format de PokeAPI.

import { cleanFlavorText } from "@/utils/cleanFlavorText";

describe("cleanFlavorText", () => {
  it("replaces the game line breaks with spaces", () => {
    const raw = "Au matin de sa vie, la graine sur\nson dos lui fournit les éléments\ndont il a besoin pour grandir.";
    expect(cleanFlavorText(raw)).toBe(
      "Au matin de sa vie, la graine sur son dos lui fournit les éléments dont il a besoin pour grandir."
    );
  });

  it("replaces the form feed used by older entries", () => {
    expect(cleanFlavorText("Premiere partie\fseconde partie")).toBe(
      "Premiere partie seconde partie"
    );
  });

  it("removes the soft hyphen that would split a word", () => {
    expect(cleanFlavorText("POKé­MON")).toBe("POKéMON");
  });

  it("collapses repeated whitespace", () => {
    expect(cleanFlavorText("trop   d'espaces\n\n ici")).toBe("trop d'espaces ici");
  });

  it("returns an empty string when there is nothing to clean", () => {
    expect(cleanFlavorText("")).toBe("");
  });
});
