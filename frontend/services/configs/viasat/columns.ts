import { ViasatFieldMap, ViasatRow } from "../../../types";
import {
  formatLabTitle,
  getCellLengthFormula,
  getDateByFormat,
  getFilenameFromField,
  getProjectedCellFormula,
  modifyFieldValue,
  replaceSubstring,
  sliceFieldValue,
  splitAndJoinString,
} from "../../util";

export const defaultViasatRow: ViasatRow = {
  Title: {},
  Subtitle: {},
  Synopsis: {},
  "Series Synopsis": {},
  "People Score": "",
  "Category List": "",
  Genre: "",
  Rating: "",
  "Rating Advisor": "",
  Director: "",
  Cast: {},
  Languages: {},
  "Sub Embed": {},
  "Closed Caps": "",
  "Sub Dynamic": {},
  Length: "",
  "Projected Size (MB)": "",
  "Year of Release": "",
  Status: "",
  "Start Date": "",
  "End Date": "",
  "TH or ED": "",
  Ratio: "",
  Dist: "",
  Lab: "",
  "Pre-roll 1 (Prev Cycle Ad Pools)": "",
  "Pre-roll 2 (Curr Cycle Ad Pools)": "",
  "Pre-roll 3 (Warning Slate)": "",
  "Dated Version": "",
  "Feature File Name (.mp4)": "",
  "Poster Image File Name (.jpg)": "",
  "Series Image File Name (.jpg)": "",
  "Episode Image File Name (.jpg)": "",
  R: "",
};

export const viasatSharedColumns: ViasatFieldMap[] = [
  {
    csvColumnName: "Lab",
    pixlFieldName: "Lab",
  },
  {
    csvColumnName: "Genre",
    pixlFieldName: "Genres",
  },
  {
    csvColumnName: "Rating",
    pixlFieldName: "Rating (AUS)",
  },
  {
    csvColumnName: "Feature File Name (.mp4)",
    pixlFieldName: "Filename 6",
    formatFunction: getFilenameFromField,
  },
  {
    csvColumnName: "Length",
    pixlFieldName: "Duration (mins)",
  },
  {
    csvColumnName: "Start Date",
    pixlFieldName: "Cycle Start",
    formatFunction: getDateByFormat,
    asCellValue: true,
    formatProps: {
      format: "MM/DD/YYYY",
    },
  },
  {
    csvColumnName: "End Date",
    pixlFieldName: "Exhibition End",
    asCellValue: true,
    formatFunction: getDateByFormat,
    formatProps: {
      format: "MM/DD/YYYY",
    },
  },
  {
    csvColumnName: "Ratio",
    pixlFieldName: "Aspect Ratio",
    formatFunction: replaceSubstring,
    formatProps: {
      regex: /x/gi,
      value: ":",
    },
  },
  {
    csvColumnName: "Status",
    value: "New",
  },
];

export const viasatFilmColumns: ViasatFieldMap[] = [
  {
    csvColumnName: "Title",
    pixlFieldName: "Title",
  },
  {
    csvColumnName: "Title",
    pixlFieldName: "Title",
    formatFunction: getCellLengthFormula,
    formatProps: { column: "B" },
    subKey: "CC",
  },
  {
    csvColumnName: "Synopsis",
    pixlFieldName: "Synopsis (<280)",
    subKey: "value",
  },
  {
    csvColumnName: "Synopsis",
    pixlFieldName: "Synopsis (<280)",
    formatFunction: getCellLengthFormula,
    formatProps: { column: "D" },
    subKey: "CC",
  },
  {
    csvColumnName: "People Score",
    pixlFieldName: "People Score",
    formatFunction: modifyFieldValue,
    formatProps: {
      type: "/",
      value: 2,
    },
  },
  {
    csvColumnName: "Rating Advisor",
    pixlFieldName: "Rating Advisory (ViaSat)",
  },
  {
    csvColumnName: "Director",
    pixlFieldName: "Director",
  },
  {
    csvColumnName: "Cast",
    pixlFieldName: "Cast",
    formatFunction: splitAndJoinString,
    formatProps: {
      limit: 3,
      delimmiter: ",",
    },
  },
  {
    csvColumnName: "Cast",
    pixlFieldName: "Cast",
    formatFunction: getCellLengthFormula,
    formatProps: { column: "L" },
    subKey: "CC",
  },
  {
    csvColumnName: "TH or ED",
    pixlFieldName: "Version",
    formatFunction: sliceFieldValue,
    formatProps: { index: 2 },
  },
  {
    csvColumnName: "Year of Release",
    pixlFieldName: "Theatrical release",
  },
  {
    csvColumnName: "Projected Size (MB)",
    pixlFieldName: "Title",
    formatFunction: getProjectedCellFormula,
    formatProps: {
      column: "N",
      end: "S",
      lengthCol: "Y",
    },
  },
];

export const viasatTvColumns: ViasatFieldMap[] = [
  {
    csvColumnName: "Title",
    pixlFieldName: "Title",
  },
  {
    csvColumnName: "Title",
    pixlFieldName: "Season #",
    subKey: "Season",
  },
  {
    csvColumnName: "Title",
    pixlFieldName: "Episode #",
    subKey: "Episode",
  },
  {
    csvColumnName: "Title",
    pixlFieldName: "Title",
    formatFunction: getCellLengthFormula,
    formatProps: { column: "B" },
    subKey: "CC",
  },
  {
    csvColumnName: "Subtitle",
    pixlFieldName: "Episode",
    formatFunction: formatLabTitle,
  },
  {
    csvColumnName: "Subtitle",
    pixlFieldName: "Episode",
    formatFunction: getCellLengthFormula,
    formatProps: { column: "F" },
    subKey: "CC",
  },
  {
    csvColumnName: "Synopsis",
    pixlFieldName: "Synopsis (<190)",
  },
  {
    csvColumnName: "Synopsis",
    pixlFieldName: "Synopsis (<190)",
    formatFunction: getCellLengthFormula,
    formatProps: { column: "H" },
    subKey: "CC",
  },
  {
    csvColumnName: "Series Synopsis",
    pixlFieldName: "Series Synopsis",
  },
  {
    csvColumnName: "Series Synopsis",
    pixlFieldName: "Series Synopsis",
    formatFunction: getCellLengthFormula,
    formatProps: { column: "J" },
    subKey: "CC",
  },
  {
    csvColumnName: "Projected Size (MB)",
    pixlFieldName: "Title",
    formatFunction: getProjectedCellFormula,
    formatProps: {
      column: "P",
      end: "O",
      lengthCol: "T",
    },
  },
];
