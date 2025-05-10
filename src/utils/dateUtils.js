// utils/dateUtils.js
import dayjs from "dayjs";

export const formatDateWithCapitalMonth = (date) => {
  const formattedDate = dayjs(date).locale("uk").format("DD MMMM YYYY");
  return formattedDate.replace(/^\d+\s([а-я])/i, (match, p1) => match.replace(p1, p1.toUpperCase()));
};
