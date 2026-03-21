import { parseDateTime, type CalendarDateTime } from "@internationalized/date";

export function toCalendarDateTime(str: string): CalendarDateTime | null {
  if (!str) return null;
  try {
    return parseDateTime(str.length === 16 ? str + ":00" : str);
  } catch {
    return null;
  }
}
