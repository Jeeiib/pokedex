import { MOTION } from "@/constants/motion";

describe("MOTION", () => {
  it("keeps every duration within a perceivable range", () => {
    const durations = [
      MOTION.press.duration,
      MOTION.artwork.duration,
      MOTION.badge.duration,
      MOTION.stat.duration,
      MOTION.splashThrow.duration,
      MOTION.splashReveal.duration,
    ];
    for (const duration of durations) {
      expect(duration).toBeGreaterThanOrEqual(120);
      expect(duration).toBeLessThanOrEqual(900);
    }
  });

  it("staggers by less than the animation it offsets", () => {
    expect(MOTION.badge.stagger).toBeLessThan(MOTION.badge.duration);
    expect(MOTION.stat.stagger).toBeLessThan(MOTION.stat.duration);
  });

  it("keeps the whole opening under a second and a half", () => {
    const opening =
      MOTION.splashThrow.duration + MOTION.splashSettle.duration + MOTION.splashReveal.duration;
    expect(opening).toBeLessThanOrEqual(1500);
  });
});
