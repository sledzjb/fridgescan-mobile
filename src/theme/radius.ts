export const radius = {
  sm: 9, // przyciski ilości −/+, małe kafelki
  md: 13, // input w ustawieniach, przycisk w karcie
  lg: 16, // karty list, przyciski w arkuszu
  xl: 18, // karta przepisu, kontener listy
  xxl: 22, // slot na ilustrację w onboardingu
  sheet: 26, // górne narożniki bottom sheeta
  pill: 999, // chipy, badge, przełączniki, kropki
} as const;

// Przyciski główne (CTA na dole ekranu)
export const ctaRadius = 17;

export type RadiusToken = keyof typeof radius;
