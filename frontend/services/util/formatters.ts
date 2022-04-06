import { Record } from "@airtable/blocks/models";
import { getDateByFormat, execFieldSearch } from ".";
import { FieldSearch, FormatterFunction } from "../../types";

/**
 * Format record's field value for Lab Title
 * @param args
 * @returns
 */
export const formatLabTitle: FormatterFunction<null> = (args) =>
  flattenCellAsString(args).replace(/"/g, "");

/**
 * Gets and format the value of a record's field(s) and returns it as a string
 */
export const flattenCellAsString: FormatterFunction<{ delimmiter: string }> = ({
  record,
  fieldname,
  props,
}) => {
  let delimmiter = ",";
  if (props) {
    const { delimmiter: d = "," } = props;
    delimmiter = d;
  }

  if (Array.isArray(fieldname)) {
    return fieldname
      .map((f) => record.getCellValueAsString(f))
      .join(delimmiter);
  } else if (fieldname) {
    return record.getCellValueAsString(fieldname);
  }

  return "";
};

export const getFirstFieldCell: FormatterFunction<null> = ({
  record,
  fieldname,
}) => {
  const f = Array.isArray(fieldname) ? fieldname[0] : fieldname;
  return record.getCellValueAsString(f);
};

/**
 *
 * @param param0
 * @returns
 */
export const getReportType: FormatterFunction<null> = ({ record }) =>
  record.getCellValueAsString("Programming") === "Film" ? "Movie" : "TV";

export const appendToCellValue: FormatterFunction<{
  appendValue: string | string[];
  delimmiter: string;
}> = ({ record, fieldname, props }) => {
  const { appendValue, delimmiter } = props;

  let str = "";

  if (typeof appendValue === "string") {
    str = appendValue;
  } else if (Array.isArray(appendValue)) {
    const d = delimmiter ?? " ";
    str += appendValue.join(d);
  }

  return flattenCellAsString({ record, fieldname, props }) + str;
};

export const appendSubType: FormatterFunction<{
  num: number;
  useInitials?: boolean;
}> = (args) => {
  const {
    record,
    fieldname,
    value,
    props: { num, useInitials = true },
  } = args;
  let sub = value ?? flattenCellAsString({ record, fieldname });
  if (num > 0 && num <= 5) {
    let subType = record.getCellValueAsString(`Subtitle ${num} Type`);
    if (useInitials) {
      switch (subType) {
        case "Embedded":
          subType = "EMB";
          break;
        case "Closed Caption":
          subType = "CC";
          break;
        case "Dynamic Sub":
          subType = "DYN";
          break;
      }
    }
    return `${sub} ${subType}`;
  }

  return sub;
};

export const prependToCellValue: FormatterFunction<{
  prependValue: string | string[];
  delimmiter: string;
  fieldLimit?: number;
}> = (args) => {
  const { props } = args;
  const { prependValue, delimmiter = " ", fieldLimit } = props;
  let str = "";
  if (typeof prependValue === "string") {
    str = prependValue;
  } else if (Array.isArray(prependValue)) {
    str += prependValue.join(delimmiter);
  }
  const cellValue = flattenCellAsString(args);

  if (fieldLimit) {
    return str + cellValue.split(",").slice(0, fieldLimit).join();
  }

  return str + cellValue;
};

export const zeroPad = (num: string | number, places: number) =>
  String(num).padStart(places, "0");

export const insertIntoArray = <T>(arr: T[], index: number, item: T) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index),
];

export const replaceCharAt = (str: string, index: number, char: string) => {
  const tmp = str.split("");
  tmp[index] = char;
  return tmp.join("");
};

/**
 *
 * @param obj Object to update
 * @param value insert value
 * @param propPath path of the property
 * @returns
 */
export const updateObjProp = <T>(
  obj: T,
  value: string,
  propPath: string
): T => {
  const [head, ...rest] = propPath.split(".");
  return !rest.length
    ? (obj[head] = value)
    : updateObjProp(obj[head], value, rest.join("."));
};

export const insertNestedProp = <T>(
  obj: T,
  value: string | object,
  path: string | string[]
) => {
  const [prop, ...rest] = typeof path === "string" ? path.split(".") : path;
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
  newObj[prop] = rest.length ? insertNestedProp(obj[prop], value, rest) : value;
  return newObj;
};

export const appendToCsvRow = (
  csvColumn: string | string[],
  callback: (columnName: string) => void
) => {
  if (typeof csvColumn === "string") {
    callback(csvColumn);
  } else if (Array.isArray(csvColumn)) {
    csvColumn.map((columnName) => appendToCsvRow(columnName, callback));
  }
};

export const recordToHashMap = (records: Record[], key?: string) =>
  new Map<string, Record>(
    records.map((v) => [key ? v.getCellValueAsString(key) : v.id, v])
  );

export const splitAndJoinString: FormatterFunction<{
  limit: number;
  delimmiter: string;
}> = (args) => {
  const str = flattenCellAsString(args);
  return str
    .split(args.props.delimmiter, args.props.limit)
    .join(args.props.delimmiter);
};

export const modifyFieldValue: FormatterFunction<{
  type: "+" | "-" | "/" | "*";
  value: number;
}> = (args) => {
  const { record, fieldname, props } = args;
  const first = Array.isArray(fieldname) ? fieldname[0] : fieldname;
  const { type, value } = props;
  const recordValue = record.getCellValueAsString(first);

  switch (type) {
    case "+":
      return recordValue + value;
    case "-":
      return `${parseInt(recordValue) - value}`;
    case "*":
      return `${parseInt(recordValue) * value}`;
    case "/":
      return `${parseInt(recordValue) / value}`;
    default:
      return recordValue;
  }
};

export const replaceSubstring: FormatterFunction<{
  regex: RegExp;
  replaceValue?: string;
}> = ({ record, fieldname, props }) => {
  const { regex, replaceValue = "" } = props;
  const value = flattenCellAsString({ record, fieldname });
  return value.replace(regex, replaceValue);
};

export const sliceFieldValue: FormatterFunction<{
  index: number;
  start?: number;
}> = ({ record, fieldname, props: { start = 0, index } }) =>
  getFirstFieldCell({ record, fieldname }).slice(start, index);

export const getImmflyRating: FormatterFunction<null> = ({
  record,
  fieldname,
}) => {
  const value = getFirstFieldCell({ record, fieldname });
  switch (value) {
    case "G":
      return "0";
    case "NR":
    case "PG":
    case "PG-13":
      return "13";
    case "R":
      return "21";
    default:
      return "";
  }
};

export const getRowNumber: FormatterFunction<null> = ({ row }) => `${row}`;

export const getOemEndDate: FormatterFunction<{ format: string }> = ({
  record,
  systemConfig,
  props,
}) => {
  const oemList = [];

  if (systemConfig && systemConfig.oemSystems) {
    oemList.push(systemConfig.oemSystems);
  }

  if (oemList.length === 0) {
    return "";
  }

  const rgx = new RegExp(
    oemList
      .reduce((acc: string[], cur) => {
        if (typeof cur === "string") {
          acc.push(cur);
        } else {
          acc.push(cur.name);
        }

        return acc;
      }, [])
      .join("|")
  );
  const { format = "DD-MMM-YY" } = props;

  for (let oem = 1; oem < 4; oem++) {
    const system = record.getCellValueAsString(`OEM System ${oem}`);

    if (system && system.match(rgx)) {
      return getDateByFormat({
        record,
        fieldname: `OEM End ${oem}`,
        props: { format },
      });
    }
  }

  return "";
};
