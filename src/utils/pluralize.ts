/** Polska odmiana rzeczowników policzalnych: [1, 2–4 (poza 12–14), pozostałe]. */
export function pluralizePl(n: number, forms: [one: string, few: string, many: string]): string {
  const [one, few, many] = forms;
  if (n === 1) return one;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
  return many;
}
