import { formatStatValue } from "@/utils/formatStat";

describe("formatStatValue", () => {
  it("pads to three digits like the mockup", () => {
    expect(formatStatValue(45)).toBe("045");
    expect(formatStatValue(9)).toBe("009");
    expect(formatStatValue(255)).toBe("255");
  });

  it("does not truncate a value above three digits", () => {
    expect(formatStatValue(1000)).toBe("1000");
  });

  it("clamps a negative value to zero", () => {
    expect(formatStatValue(-5)).toBe("000");
  });
});
