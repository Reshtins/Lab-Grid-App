import {
  AirlineCsvMap,
  CsvColumnMap,
  CsvFieldMap,
  GanttChartColumns,
  GanttRow,
} from "../../../types";
import { appendSubType, getFilenameFromField } from "../../util";
import { vaGanttFilenames } from "../airlines/va";
import ganttHeaders from "./headers";
import { defaultGanttRow } from "./rows";

const commonGanttFields: CsvFieldMap<GanttRow>[] = [
  {
    csvColumnName: "Distributor",
    pixlFieldName: "Distributor",
  },
  {
    csvColumnName: "Lab",
    pixlFieldName: "Lab",
  },
  {
    csvColumnName: "Actual Runtime",
    pixlFieldName: "Duration (mins)",
  },
  {
    csvColumnName: "Aspect",
    pixlFieldName: "Aspect Ratio",
  },
  {
    csvColumnName: "Version",
    pixlFieldName: "Version",
  },
  {
    csvColumnName: "L1",
    pixlAudioName: {
      key: "1",
      fieldname: "ISO639-2T",
    },
  },
  {
    csvColumnName: "L1",
    pixlAudioName: {
      key: "1",
      fieldname: "ISO639-2T",
    },
  },
  {
    csvColumnName: "L2",
    pixlAudioName: {
      key: "2",
      fieldname: "ISO639-2T",
    },
  },
  {
    csvColumnName: "L3",
    pixlAudioName: {
      key: "3",
      fieldname: "ISO639-2T",
    },
  },
  {
    csvColumnName: "L4",
    pixlAudioName: {
      key: "4",
      fieldname: "ISO639-2T",
    },
  },
  {
    csvColumnName: "L5",
    pixlAudioName: {
      key: "5",
      fieldname: "ISO639-2T",
    },
  },
  {
    csvColumnName: "L6",
    pixlAudioName: {
      key: "6",
      fieldname: "ISO639-2T",
    },
  },
  {
    csvColumnName: "Sub1",
    pixlAudioName: {
      key: "1",
      fieldname: "ISO639-2T",
    },
    formatFunction: appendSubType,
  },
  {
    csvColumnName: "Sub2",
    pixlAudioName: {
      key: "2",
      fieldname: "ISO639-2T",
    },
  },
  {
    csvColumnName: "Sub3",
    pixlAudioName: {
      key: "3",
      fieldname: "ISO639-2T",
    },
  },
  {
    csvColumnName: "Sub4",
    pixlAudioName: {
      key: "4",
      fieldname: "ISO639-2T",
    },
  },
  {
    csvColumnName: "Sub5",
    pixlAudioName: {
      key: "5",
      fieldname: "ISO639-2T",
    },
  },
];

const ganttMovieColumns: CsvFieldMap<GanttRow>[] = [
  {
    csvColumnName: "Asset",
    value: "Movie",
  },
  {
    csvColumnName: "Title",
    pixlFieldName: "Film",
  },
];

const ganttTvColumns: CsvFieldMap<GanttRow>[] = [
  {
    csvColumnName: "Asset",
    value: "TV",
  },
  {
    csvColumnName: "Title",
    pixlFieldName: "Series",
  },
  {
    csvColumnName: "Ep Title",
    pixlFieldName: "Episode",
  },
  {
    csvColumnName: "Season",
    pixlFieldName: "Season",
  },
  {
    csvColumnName: "Ep#",
    pixlFieldName: "Episode #",
  },
  {
    csvColumnName: "Prod Code",
    pixlFieldName: "Production Code",
  },
];

const ganttColumnMap: CsvColumnMap<GanttRow> = {
  shared: commonGanttFields,
  film: ganttMovieColumns,
  tv: ganttTvColumns,
};

export const ganttConfigMap: AirlineCsvMap<GanttRow> = {
  QF: {
    csvHeader: ganttHeaders.QF,
    systemConfigs: [],
    columnMap: {
      ...ganttColumnMap,
      shared: [
        ...ganttColumnMap.shared,
        {
          csvColumnName: "PAC Filename eFX/eX1/eX2",
          pixlFieldName: "Filename 1",
          formatFunction: getFilenameFromField,
        },
        {
          csvColumnName: "PAC Filename AD",
          pixlFieldName: "Filename 2",
          formatFunction: getFilenameFromField,
        },
        {
          csvColumnName: "PAC Filename FHD",
          pixlFieldName: "Filename 3",
          formatFunction: getFilenameFromField,
        },
        {
          csvColumnName: "PAC Filename HD",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 4",
        },
        {
          csvColumnName: "PAC Filename eXW",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 5",
        },
        {
          csvColumnName: "PAC Trailer Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 7",
        },
        {
          csvColumnName: "Viasat Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 6",
        },
        {
          csvColumnName: "Bluebox Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 8",
        },
      ],
    },
    defaultRow: defaultGanttRow,
  },
  VA: {
    csvHeader: ganttHeaders.VA,
    systemConfigs: [],
    defaultRow: defaultGanttRow,
    columnMap: {
      ...ganttColumnMap,
      shared: [...ganttColumnMap.shared, ...vaGanttFilenames],
    },
  },
  CI: {
    csvHeader: ganttHeaders.CI,
    systemConfigs: [],
    defaultRow: defaultGanttRow,
    columnMap: {
      ...ganttColumnMap,
      film: [
        ...ganttColumnMap.film,

        {
          csvColumnName: "PAC Filename eX2",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 1",
        },
        {
          csvColumnName: "PAC Filename eX3",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 2",
        },
        {
          csvColumnName: "PAC Filename eXK",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 3",
        },
        {
          csvColumnName: "PAC Filename S3K",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 4",
        },
        {
          csvColumnName: "PAC Filename DMPES",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 7",
        },
        {
          csvColumnName: "PAC Trailer Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 8",
        },
        {
          csvColumnName: "Immfly Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 5",
        },
        {
          csvColumnName: "Immfly Trailer Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 9",
        },
        {
          csvColumnName: "RAVE Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 6",
        },
        {
          csvColumnName: "RAVE Trailer Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 10",
        },
      ],
      tv: [
        ...ganttColumnMap.tv,
        {
          csvColumnName: "PAC Filename eX2",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 1",
        },
        {
          csvColumnName: "PAC Filename S3K",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 4",
        },
        {
          csvColumnName: "Immfly Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 5",
        },
        {
          csvColumnName: "RAVE Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 6",
        },
      ],
    },
  },
  GMF: {
    csvHeader: ganttHeaders.GMF,
    systemConfigs: [],
    defaultRow: defaultGanttRow,
    columnMap: {
      ...ganttColumnMap,
      shared: [
        ...ganttColumnMap.shared,

        {
          csvColumnName: "Bluebox Wow Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 1",
        },
      ],
    },
  },
  TG: {
    csvHeader: ganttHeaders.TG,
    systemConfigs: [],
    defaultRow: defaultGanttRow,
    columnMap: {
      ...ganttColumnMap,
      shared: [
        ...ganttColumnMap.shared,
        {
          csvColumnName: "PAC Filename eX2",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 1",
        },
        {
          csvColumnName: "PAC Filename S3K",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 2",
        },
        {
          csvColumnName: "PAC Trailer Filename",
          formatFunction: getFilenameFromField,
          pixlFieldName: "Filename 3",
        },
      ],
    },
  },
  ZL: {
    columnMap: ganttColumnMap,
    csvHeader: ganttHeaders.ZL,
    systemConfigs: [],
    defaultRow: defaultGanttRow,
  },
};
 
