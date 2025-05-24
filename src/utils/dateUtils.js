import { Timestamp } from "firebase/firestore";
import dayjs from "./dayjs-setup";

// convert if date '22 Травня 2025'
export const formatDateWithCapitalMonth = (date) => {
  const formattedDate = dayjs(date).locale("uk").format("DD MMMM YYYY");
  return formattedDate.replace(/^\d+\s([а-я])/i, (match, p1) => match.replace(p1, p1.toUpperCase()));
};
// convert if timestamp; 20:48, 23 травня 2025
export const formatFullDateTime = (timestamp) => {
  if (!timestamp) return "";

  const fixedTimestamp = typeof timestamp.toDate === "function" ? timestamp : new Timestamp(timestamp.seconds, timestamp.nanoseconds);

  const date = fixedTimestamp.toDate();
  return dayjs(date).format("HH:mm, DD MMMM");
};

// day ago
export const timeAgo = (timestamp) => {
  const date = timestamp?.toDate?.() || new Date(timestamp);
  return dayjs(date).fromNow();
};

// convert date into normal date that we can use in functions
//  Fri May 23 2025 20:48:42 GMT+0300 ;
export const convertTimeFireStore = (fireStamp) => {
  const jsDate = fireStamp.toDate();
  return jsDate;
};

// "YYYY-MM-DD"
export const formatDate = (date) => date.toISOString().split("T")[0];
