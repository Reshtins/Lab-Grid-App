import {
  CsvColumnMap,
  WestLabGridColumns,
  WestLabGridFieldMap,
} from "../../../types";
import { getDateByFormat } from "../../util/datetime";

const westLabGridMapping: WestLabGridFieldMap[] = [
  {
    csvColumnName: "Airline",
    pixlFieldName: "Airline",
  },
  {
    csvColumnName: "Cycle",
    pixlFieldName: "Cycle Start",
    asCellValue: true,
    formatFunction: getDateByFormat,
    formatProps: { format: "MMM-YY" },
  },
  {
    csvColumnName: "Distributor",
    pixlFieldName: "Distributor",
  },
  {
    csvColumnName: "Lab",
    pixlFieldName: "Lab",
  },
  {
    csvColumnName: "Version",
    pixlFieldName: "Version",
  },
];

export const westColumnMap: CsvColumnMap<WestLabGridColumns> = {
  shared: westLabGridMapping,
  film: [],
  tv: [],
};

export const defaultWestRow: WestLabGridColumns = {
  Airline: "",
  Cycle: "",
  "Hardware Vendor": "",
  System: "",
  "West Title ID": null,
  Title: "",
  "Dist. Code": null,
  Distributor: "",
  Lab: "",
  Version: "",
  Runtime: "",
  Rating: "",
  "Rating Warning": "",
  Year: "",
  Country: "",
  Languages: {},
  "Embed Subs": {},
  "Aspect Ratio": "",
  "Trailer Aspect Ratio": "",
  "Feature Format": "",
  "Trailer Format": "",
  "Bit Rate": "",
  "Feature Qty": "",
  "Trailer Qty": "",
  Filename: "",
  "Trailer Filename": "",
  "DY Sub": {},
  "Hardware File Due Date": "",
  "Ship To": "",
  "PO #": "",
  "TECH Bill To": "",
  Notes: "",
};
