import dayjs from "dayjs";
import { FormatterFunction } from "../../types";

export const getDateFromCell = (cellValue: any) => {
  const date = Array.isArray(cellValue) ? cellValue[0] : cellValue;

  const obj = {
    year: "",
    month: "",
    day: "",
  };

  const { value } = typeof date === "string" ? { value: date } : date ?? {};

  if (value) {
    const [year = "", month = "", day = ""] = value.split("-");
    (obj.year = year), (obj.month = month), (obj.day = day);
  }

  return obj;
};

/**
 * Get the date in 'MMYY' format
 * @param date
 * @returns
 */
export const getPacDate = (date: any) => {
  const { year, month } = getDateFromCell(date);
  const shortYear = year.slice(2);
  return `${month}${shortYear}`;
};

/**
 * Return date in YYMM format
 * @param date
 * @returns
 */
export const getShortDate = (date: any) => {
  const { year, month } = getDateFromCell(date);
  const shortYear = year.slice(2);
  return `${shortYear}${month}`;
};

export const getDateByFormat: FormatterFunction<{ format: string }> = (
  args
) => {
  const { record, fieldname, props } = args;
  const { format } = props;

  let f = Array.isArray(fieldname) ? fieldname[0] : fieldname;

  const date = record.getCellValue(f);

  if (!date) {
    return "";
  }

  const { year, month, day } = getDateFromCell(date);
  return dayjs(`${year}-${month}-${day}`).format(format);
};

export const getFullTime: FormatterFunction<{ format: string }> = ({
  record,
  fieldname,
}) => {
  fieldname = Array.isArray(fieldname) ? fieldname[0] : fieldname;
  const time = parseInt(record.getCellValueAsString(fieldname));

  if (isNaN(time)) {
    return "";
  }

  const hours = `${Math.floor(time / 60)}`;
  const minutes = `${time % 60}`;

  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
};
