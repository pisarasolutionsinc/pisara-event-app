export const formatDateTimeLocal = (isoString: string) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function formatDateV1(dateString: string): string {
  const date = new Date(dateString);

  // Define options for the desired format
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format the date using Intl.DateTimeFormat
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);

  // Extract the formatted components
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const year = parts.find((part) => part.type === "year")?.value;
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;
  const ampm = parts.find((part) => part.type === "dayPeriod")?.value; // "AM" or "PM"

  // Combine components to form the final string
  const finalDate = `${month} ${day}, ${year} - ${hour}:${minute} ${ampm}`;

  return finalDate;
}

export function formatDateToMMMDDYYYY(dateStr: string): string {
  const date = new Date(dateStr);

  // Validate date
  if (isNaN(date.getTime())) {
    return "Invalid date input";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options).replace(/,/g, ",");
}

export function formatTimeToAMPM(time: string): string {
  const [hoursStr, minutesStr] = time.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Validate time input
  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return "Invalid time input";
  }

  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = (((hours + 11) % 12) + 1).toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${period}`;
}

export function isValidTimeInput(time: string): boolean {
  const timeRegex = /^(0?[0-9]|1[0-2]):[0-5][0-9] ?([AaPp][Mm])?$/; // Matches HH:mm AM/PM format
  return timeRegex.test(time);
}
