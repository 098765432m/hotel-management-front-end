import dayjs from "dayjs";

// Change String to array of dayjs date in date out
export function rangeISOToRangeDayJS(rangeString: string) {
  if (rangeString.length > 0) {
    const parts = rangeString.split(" "); // split to 3 part [date in] [-] [date out]
    console.log(parts);
    return [dayjs(parts[0]), dayjs(parts[2])]; //return array of date in and date out
  } else {
    return null;
  }
}

// Change to YYYY-MM-DD format
export function formatDateToYYYYMMDD(date: dayjs.Dayjs) {
  switch (date.isValid()) {
    case true:
      return date.format("YYYY-MM-DD");
    case false:
      return "";
  }
}
