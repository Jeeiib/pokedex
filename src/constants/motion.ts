// Durées et ressorts d'animation partagés entre les écrans, réunis dans une
// seule table pour qu'ils ne se contredisent pas.

export const MOTION = {
  press: { duration: 150, scale: 0.96 },
  artwork: { duration: 400, offset: 24 },
  badge: { duration: 200, stagger: 60 },
  stat: { duration: 700, stagger: 80 },
  cry: { duration: 300, offset: 12 },
  favorite: { duration: 250, scale: 1.3 },
  splashThrow: { duration: 300, lift: 120 },
  splashSettleBudget: { duration: 500 },
  splashSpin: { duration: 900 },
  splashReveal: { duration: 400 },
  sheet: { enter: 280, exit: 200 },
  spring: { damping: 12, stiffness: 180 },
} as const;
