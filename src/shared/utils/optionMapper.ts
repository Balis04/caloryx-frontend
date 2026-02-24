export function getLabelFromOptions<
  T extends readonly { value: string; label: string }[]
>(options: T, value: string | null): string {
  if (!value) return "Nincs beállítva";

  const found = options.find((o) => o.value === value);
  return found?.label ?? value;
}
