/**
 * Formats a message timestamp into a pleasant, human-readable string.
 * @param dateString The ISO date string or Date object.
 * @param locale The locale to format for (e.g., 'en', 'ru').
 * @param i18n An object containing 'today' and 'yesterday' translations.
 * @returns A formatted date string.
 */
export const formatChatMessageDate = (
  dateString: string | Date,
  locale = "en-US",
  translations: { today: string; yesterday: string },
): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const timeString = date.toLocaleTimeString(locale, timeOptions);

  if (isToday) {
    return `${translations.today}, ${timeString}`;
  }

  if (isYesterday) {
    return `${translations.yesterday}, ${timeString}`;
  }

  const isThisYear = date.getFullYear() === now.getFullYear();
  if (isThisYear) {
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
