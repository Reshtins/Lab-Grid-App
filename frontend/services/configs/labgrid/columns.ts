import { LabGridRow, LabGridFieldMap } from "../../../types";
import {
  getDateByFormat,
  getTvLabName,
  formatLabTitle,
  getSubtitleAndType,
} from "../../util";

export const defaultLabGrid: LabGridRow = {
  No: "",
  Airline: "",
  "PO Number": "",
  "Movie/Series Title": "",
  "Episode Title": "",
  "Season No": "",
  "Episode No": "",
  "Production Code": "",
  Distributor: "",
  Lab: "",
  Year: "",
  "Runtime (min)": "",
  "Cycle Start": "",
  "Language 1": "",
  "Language 2": "",
  "Language 3": "",
  "Language 4": "",
  "Language 5": "",
  "Language 6": "",
  "Subtitle 1": "",
  "Subtitle 2": "",
  "Aspect Ratio": "",
  Version: "",
  Vendor: "",
  System: "",
  "File Format": "",
  "Trailer Filename": "",
  "Movie Filename": "",
  "Dub Filename 1": "",
  "Dub Filename 2": "",
  "Dub Filename 3": "",
  "Dub Filename 4": "",
  "Dub Filename 5": "",
  "Sub Filename 1": "",
  "Sub Filename 2": "",
  "File Type": "",
  Delivery: "",
  "Shipping To": "",
  "Delivery Deadline": "",
  Cost: "",
};

export const sharedColumns: LabGridFieldMap[] = [
  {
    csvColumnName: "Airline",
    pixlFieldName: "IATA",
  },
  {
    csvColumnName: "Runtime (min)",
    pixlFieldName: "Duration (mins)",
  },
  {
    csvColumnName: "Cycle Start",
    pixlFieldName: "Cycle Start",
    asCellValue: true,
    formatFunction: getDateByFormat,
    formatProps: { format: "D MMMM YYYY" },
  },
  {
    csvColumnName: "Language 1",
    pixlFieldName: "Audio 1",
  },
  {
    csvColumnName: "Language 2",
    pixlFieldName: "Audio 2",
  },
  {
    csvColumnName: "Language 3",
    pixlFieldName: "Audio 3",
  },
  {
    csvColumnName: "Language 4",
    pixlFieldName: "Audio 4",
  },
  {
    csvColumnName: "Language 5",
    pixlFieldName: "Audio 5",
  },
  {
    csvColumnName: "Language 6",
    pixlFieldName: "Audio 6",
  },
  {
    csvColumnName: "Subtitle 1",
    pixlFieldName: "Sub/CC 1",
    formatFunction: getSubtitleAndType,
    formatProps: { subtitleType: "Subtitle 1 Type" },
  },
  {
    csvColumnName: "Subtitle 2",
    pixlFieldName: "Sub/CC 2",
    formatFunction: getSubtitleAndType,
    formatProps: { subtitleType: "Subtitle 2 Type" },
  },
  {
    csvColumnName: "Aspect Ratio",
    pixlFieldName: "Aspect Ratio",
  },
  {
    csvColumnName: "Year",
    pixlFieldName: "Theatrical release",
    asCellValue: true,
    formatFunction: getDateByFormat,
    formatProps: { format: "YYYY" },
  },
  {
    csvColumnName: "Episode Title",
    value: "-",
  },
  {
    csvColumnName: "Season No",
    value: "-",
  },
  {
    csvColumnName: "Episode No",
    value: "-",
  },
  {
    csvColumnName: "Production Code",
    value: "-",
  },
  {
    csvColumnName: "Distributor",
    pixlFieldName: "Distributor",
  },
];

export const filmColumns: LabGridFieldMap[] = [
  {
    csvColumnName: "Movie/Series Title",
    pixlFieldName: "Film",
    formatFunction: formatLabTitle,
  },
  {
    csvColumnName: "Lab",
    pixlFieldName: "Lab",
  },
  {
    csvColumnName: "Version",
    pixlFieldName: "Version",
  },
  {
    csvColumnName: "File Type",
    value: "RECALL",
  },
  // {
  //   csvColumnName: "System",
  //   systemValue: "systems"
  // },
];

export const tvColumns: LabGridFieldMap[] = [
  {
    csvColumnName: "Movie/Series Title",
    pixlFieldName: "Series",
    formatFunction: formatLabTitle,
  },
  {
    csvColumnName: "Episode Title",
    pixlFieldName: "Episode",
    formatFunction: formatLabTitle,
  },
  {
    csvColumnName: "Season No",
    pixlFieldName: "Season #",
    formatFunction: formatLabTitle,
  },
  {
    csvColumnName: "Episode No",
    pixlFieldName: "Episode #",
  },
  {
    csvColumnName: "File Format",
    value: "TV Master",
  },
  {
    csvColumnName: "Lab",
    pixlFieldName: "Lab",
    formatFunction: getTvLabName,
  },
  {
    csvColumnName: "Version",
    value: "-",
  },
  {
    csvColumnName: "Vendor",
    value: "-",
  },
  {
    csvColumnName: "System",
    value: "-",
  },
  {
    csvColumnName: "Trailer Filename",
    value: "-",
  },
  {
    csvColumnName: "Movie Filename",
    value: "-",
  },
  {
    csvColumnName: "Shipping To",
    value: "Stellar Entertainment (Kuala Lumpur)",
  },
];
