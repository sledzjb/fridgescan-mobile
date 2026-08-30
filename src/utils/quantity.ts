export type Unit = 'szt' | 'g' | 'ml' | 'l' | string;

/** Krok steppera: 1 dla szt, 50 dla g/ml, 0,5 dla l (inne jednostki traktowane jak szt). */
export function stepForUnit(unit: Unit): number {
  switch (unit) {
    case 'g':
    case 'ml':
      return 50;
    case 'l':
      return 0.5;
    case 'szt':
    default:
      return 1;
  }
}

/** Formatuje ilość z przecinkiem dziesiętnym po polsku, np. 0.5 -> "0,5". */
export function formatQuantity(value: number, unit: Unit): string {
  const rounded = Math.round(value * 100) / 100;
  return `${String(rounded).replace('.', ',')} ${unit}`;
}
