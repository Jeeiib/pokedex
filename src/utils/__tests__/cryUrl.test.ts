// Vérifie que le slug Showdown est dérivé correctement du slug de l'api et que
// l'url du cri est résolue ou nulle selon les données disponibles.

import { resolveCryUrl, toShowdownSlug } from "@/utils/cryUrl";

describe("toShowdownSlug", () => {
  it("removes every hyphen from the api slug", () => {
    expect(toShowdownSlug("mr-mime")).toBe("mrmime");
    expect(toShowdownSlug("ho-oh")).toBe("hooh");
    expect(toShowdownSlug("porygon-z")).toBe("porygonz");
    expect(toShowdownSlug("type-null")).toBe("typenull");
    expect(toShowdownSlug("tapu-koko")).toBe("tapukoko");
    expect(toShowdownSlug("jangmo-o")).toBe("jangmoo");
    expect(toShowdownSlug("nidoran-f")).toBe("nidoranf");
  });

  it("leaves a simple slug untouched", () => {
    expect(toShowdownSlug("bulbasaur")).toBe("bulbasaur");
    expect(toShowdownSlug("farfetchd")).toBe("farfetchd");
  });
});

describe("resolveCryUrl", () => {
  it("returns null when there is no official url and no slug", () => {
    expect(resolveCryUrl("", null)).toBeNull();
  });

  it("always returns an absolute url when a slug is known", () => {
    const url = resolveCryUrl("pikachu", null);
    expect(url).not.toBeNull();
    expect(url).toMatch(/^https:\/\//);
  });
});
