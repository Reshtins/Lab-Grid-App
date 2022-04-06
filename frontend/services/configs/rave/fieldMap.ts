import {
  CsvColumnMap,
  RaveCtrFieldMap,
  RaveMediaFieldMap,
  RaveMediaGuiFieldMap,
} from "../../../types";
import { getDateByFormat, getOemEndDate } from "../../util";

export const raveCtrMap: RaveCtrFieldMap = {
  shared: [
    {
      csvColumnName: "Genre",
      pixlFieldName: "Genres",
    },
    {
      csvColumnName: "Runtime",
      pixlFieldName: "Duration (mins)",
    },
    {
      csvColumnName: "Version",
      pixlFieldName: "Version",
      fieldsearch: [
        {
          queries: [{ find: "Theatrical" }],
          value: "Th",
        },
        {
          queries: [{ find: "Edited" }],
          value: "Ed",
        },
      ],
    },
    {
      csvColumnName: "New/HO",
      pixlFieldName: "Version",
      fieldsearch: [
        {
          queries: [{ find: /Theatrical|Edited/gi }],
          value: "New",
        },
      ],
    },
    {
      csvColumnName: "Start",
      pixlFieldName: "Cycle Start",
      asCellValue: true,
      formatFunction: getDateByFormat,
      formatProps: { format: "DD/MM/YYYY" },
    },
    {
      csvColumnName: "Aspect",
      pixlFieldName: "Aspect Ratio",
    },
    {
      csvColumnName: "Seat Class",
      value: "ALL",
    },
    {
      csvColumnName: "Route",
      value: "ALL",
    },
  ],
  tv: [
    {
      csvColumnName: "Title",
      pixlFieldName: "Series",
    },
    {
      csvColumnName: "Episode Title",
      pixlFieldName: "Episode",
    },
    {
      csvColumnName: "Season #",
      pixlFieldName: "Season #",
    },
    {
      csvColumnName: "Episode #",
      pixlFieldName: "Episode #",
    },
    {
      csvColumnName: "Resolution",
      value: "480p",
    },
    {
      csvColumnName: "Trailer",
      value: "No",
    },
  ],
  film: [
    {
      csvColumnName: "Title",
      pixlFieldName: "Film",
    },
    {
      csvColumnName: "Resolution",
      pixlFieldName: "Type",
      fieldsearch: [
        { queries: [{ find: /Early Window|Other/gi }], value: "720p" },
      ],
      value: "480p",
    },
    {
      csvColumnName: "Trailer",
      value: "Yes",
    },
  ],
};

export const raveMediaMap: RaveMediaFieldMap = {
  shared: [
    {
      csvColumnName: "Exhibition Start",
      pixlFieldName: "Cycle Start",
      asCellValue: true,
      formatFunction: getDateByFormat,
      formatProps: { format: "DD/MM/YYYY" },
    },
    {
      csvColumnName: "Exhibition End",
      formatFunction: getOemEndDate,
    },
  ],
  film: [],
  tv: [],
};

export const raveGuiMap: RaveMediaGuiFieldMap = {
  shared: [],
  film: [],
  tv: [],
};
