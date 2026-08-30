export const CATEGORIES = ['Nabiał', 'Warzywa', 'Owoce', 'Mięso', 'Pieczywo', 'Sypkie', 'Przyprawy'] as const;
export type Category = (typeof CATEGORIES)[number];

export const UNITS = ['szt', 'g', 'ml', 'l', 'opak.'] as const;
export type ProductUnit = (typeof UNITS)[number];

export const EXPIRY_PRESETS = [
  { label: '+2 dni', days: 2 },
  { label: '+5 dni', days: 5 },
  { label: '+tydzień', days: 7 },
] as const;

/** Produkt jest „bliski terminu” (sekcja Zużyj wkrótce), gdy zostały ≤ 2 dni. */
export const EXPIRY_SOON_THRESHOLD_DAYS = 2;
