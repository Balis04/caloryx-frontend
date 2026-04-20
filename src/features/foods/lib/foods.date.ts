export const formatDateInput = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const shiftDate = (date: string, days: number): string => {
  const base = new Date(`${date}T00:00:00`);
  base.setDate(base.getDate() + days);
  return formatDateInput(base);
};

export const isValidDateInput = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return formatDateInput(parsed) === value;
};

export const getOptionalValidDate = (value: string | null) => {
  if (!value || !isValidDateInput(value)) {
    return undefined;
  }

  return value;
};

export const getValidDateOrFallback = (
  value: string | null,
  fallback: string
) => {
  if (!value || !isValidDateInput(value)) {
    return fallback;
  }

  return value;
};
