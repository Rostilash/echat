import dayjs from "./dayjs-setup";

// convert if date
export const formatDateWithCapitalMonth = (date) => {
  const formattedDate = dayjs(date).locale("uk").format("DD MMMM YYYY");
  return formattedDate.replace(/^\d+\s([а-я])/i, (match, p1) => match.replace(p1, p1.toUpperCase()));
};
// convert if timestamp;
export const formatFullDateTime = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate(); // дуже важливо: переводимо Firestore Timestamp у Date
  return dayjs(date).format("HH:mm, DD MMMM YYYY");
};

export const timeAgo = (timestamp) => {
  return dayjs(timestamp).fromNow(); //automatically in Ukrainian
};
