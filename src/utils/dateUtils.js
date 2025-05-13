import dayjs from "./dayjs-setup";

export const formatDateWithCapitalMonth = (date) => {
  const formattedDate = dayjs(date).locale("uk").format("DD MMMM YYYY");
  return formattedDate.replace(/^\d+\s([а-я])/i, (match, p1) => match.replace(p1, p1.toUpperCase()));
};

export const timeAgo = (timestamp) => {
  return dayjs(timestamp).fromNow(); //automatically in Ukrainian
};
