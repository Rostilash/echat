import { formatDate } from "../../../utils/dateUtils";

const monthNames = {
  січня: 0,
  лютого: 1,
  березня: 2,
  квітня: 3,
  травня: 4,
  червня: 5,
  липня: 6,
  серпня: 7,
  вересня: 8,
  жовтня: 9,
  листопада: 10,
  грудня: 11,
};

// Add filter with date like tomorrow or 10 march (will add post on that date)
export const detectScheduledDate = (text, today) => {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formattedToday = formatDate(today);
  const lowercaseText = text.toLowerCase();

  if (lowercaseText.includes("завтра")) {
    return formatDate(tomorrow);
  }

  if (lowercaseText.includes("сьогодні")) {
    return formattedToday;
  }

  const datePattern = /(\d{1,2})\s+(січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня)/iu;
  const match = lowercaseText.match(datePattern);

  if (match) {
    const day = parseInt(match[1], 10);
    const month = monthNames[match[2]];
    const targetDate = new Date(today.getFullYear(), month, day, 12); // to avoid timezone issues

    if (formatDate(targetDate) < formattedToday) {
      targetDate.setFullYear(today.getFullYear() + 1);
    }

    return formatDate(targetDate);
  }

  return null;
};
