// Add filter with date like tomorrow or 10 march (will add post on that date)
export const detectScheduledDate = (text, today) => {
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

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
    const targetDate = new Date(today.getFullYear(), month, day, 12); // avoiding UTC offset

    if (formatDate(targetDate) < formattedToday) {
      targetDate.setFullYear(today.getFullYear() + 1);
    }

    return formatDate(targetDate);
  }

  return null;
};
