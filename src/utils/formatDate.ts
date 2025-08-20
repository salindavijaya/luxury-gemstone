import { format, parseISO } from "date-fns";

export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "MMM d, yyyy");
  } catch {
    return "";
  }
};
