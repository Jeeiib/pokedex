// Durées et ressorts partagés. Une seule table pour que les animations de
// deux écrans différents ne se contredisent pas.
export const MOTION = {
  press: { duration: 150, scale: 0.96 },
  artwork: { duration: 400, offset: 24 },
  badge: { duration: 200, stagger: 60 },
  stat: { duration: 700, stagger: 80 },
  cry: { duration: 300, offset: 12 },
  favorite: { duration: 250, scale: 1.3 },
  splashThrow: { duration: 300, lift: 120 },
  // Ne pilote pas le ressort : elle borne seulement le budget de temps que
  // withSpring peut consommer avant que l'ouverture soit jugée trop longue.
  splashSettleBudget: { duration: 500 },
  splashSpin: { duration: 900 },
  splashReveal: { duration: 400 },
  sheet: { enter: 280, exit: 200 },
  spring: { damping: 12, stiffness: 180 },
} as const;
