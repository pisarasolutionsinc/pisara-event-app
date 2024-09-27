/**
 * Formats a date and time string into a localized time string.
 * @param date - The date string (e.g., "2024-08-19").
 * @param time - The time string (e.g., "14:30:00").
 * @returns A localized time string or "N/A" if time is not provided.
 */
export function formatTimeByDateAndTime(date: string, time?: string): string {
  if (time) {
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }
  return "N/A";
}

export function formatTimeByDate(date: string): string {
  if (date) {
    const dateTime = new Date(date);
    return dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }
  return "N/A";
}
