import { resolveCryUrl, toShowdownSlug } from "@/utils/cryUrl";

describe("toShowdownSlug", () => {
  // La source de repli renvoie 404 sur les slugs à tiret, et 200 une fois les
  // tirets retirés.
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
  // Aucune adresse jouable : le bouton doit rester inerte.
  it("returns null when there is no official url and no slug", () => {
    expect(resolveCryUrl("", null)).toBeNull();
  });

  it("always returns an absolute url when a slug is known", () => {
    const url = resolveCryUrl("pikachu", null);
    expect(url).not.toBeNull();
    expect(url).toMatch(/^https:\/\//);
  });
});
