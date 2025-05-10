// utils/dayjs-setup.js
import dayjs from "dayjs";
import "dayjs/locale/uk";

// plugins
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// add plugins
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

// locale
dayjs.locale("uk");

export default dayjs;
