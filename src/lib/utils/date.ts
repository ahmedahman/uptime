import { format, getDay, parseISO } from "date-fns";

export function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function dayOfWeekFromIso(dateIso: string): number {
  return getDay(parseISO(dateIso));
}

export function formatDisplayDate(dateIso: string): string {
  return format(parseISO(dateIso), "EEEE, d MMMM");
}

export function shiftIso(dateIso: string, deltaDays: number): string {
  const d = parseISO(dateIso);
  d.setDate(d.getDate() + deltaDays);
  return format(d, "yyyy-MM-dd");
}
