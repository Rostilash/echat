import { Timestamp } from "firebase/firestore";
import dayjs from "./dayjs-setup";

// convert if date '22 Травня 2025'
export const formatDateWithCapitalMonth = (date) => {
  const formattedDate = dayjs(date).locale("uk").format("DD MMMM YYYY");
  return formattedDate.replace(/^\d+\s([а-я])/i, (match, p1) => match.replace(p1, p1.toUpperCase()));
};
// convert if timestamp;
export const formatFullDateTime = (timestamp) => {
  if (!timestamp) return "";

  const fixedTimestamp = typeof timestamp.toDate === "function" ? timestamp : new Timestamp(timestamp.seconds, timestamp.nanoseconds);

  const date = fixedTimestamp.toDate();
  return dayjs(date).format("HH:mm, DD MMMM YYYY");
};

export const timeAgo = (timestamp) => {
  return dayjs(timestamp).fromNow(); //automatically in Ukrainian
};

// "YYYY-MM-DD"
export const formatDate = (date) => date.toISOString().split("T")[0];
