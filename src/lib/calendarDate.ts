// Value for <input type="date"> from a date the API returns.
// Takes the 'YYYY-MM-DD' prefix of the string as is. Never goes through
// new Date(): '2024-03-10' or '2024-03-10T00:00:00.000Z' parse as UTC midnight,
// which is the previous day in Argentina (UTC-3). See inmobiliaria_api#56.
export const toCalendarDate = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value.trim());
  return match ? match[1] : "";
};
