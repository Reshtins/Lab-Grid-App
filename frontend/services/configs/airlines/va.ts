import {
  CsvFieldMap,
  GanttRow,
  LabGridRow,
  SystemConfig,
} from "../../../types";
import { getFilenameFromField } from "../../util";
import {
  pacPresets,
  lufthansaPreset,
  defaultSystemMap,
} from "./filenamePresets";

export const vaSystems: SystemConfig<LabGridRow>[] = [
  {
    systemName: "LSY BCN",
    vendor: "Lufthansa Systems",
    oemSystems: ["BoardConnect"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...lufthansaPreset.bcn,
      configName: "LSY BCN",
      fieldname: "Filename 1",
      extension: "",
      id: {
        fieldname: "Boardconnect UUID",
      },
      additionalFilenames: { subs: true, dubs: false },
      oemSearch: [{ queries: [{ find: "LSY Boardconnect" }] }],
    },
    trailerFilename: {
      ...lufthansaPreset.bcn,
      configName: "LSY TR1",
      fieldname: "Filename 8",
      extension: "",
      id: {
        fieldname: "Boardconnect Trailer UUID",
      },
    },
  },
  {
    systemName: "LSY MEZ",
    vendor: "Lufthansa Systems",
    oemSystems: ["BoardConnect"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...lufthansaPreset.mez,
      configName: "LSY MEZ",
      fieldname: "Filename 2",
      additionalFilenames: { subs: true, dubs: false },
      oemSearch: [{ queries: [{ find: "LSY Boardconnect" }] }],
    },
    trailerFilename: {
      ...lufthansaPreset.mez,
      configName: "LSY TR2",
      fieldname: "Filename 9",
    },
  },
  {
    systemName: "PAC EXW",
    vendor: "Panasonic",
    oemSystems: ["eXW"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...pacPresets.exw,
      oemSearch: [
        {
          queries: [{ find: "eXW" }],
        },
      ],
      configName: "PAC EXW",
      fieldname: "Filename 3",
    },
  },
];

export const vaGanttFilenames: CsvFieldMap<GanttRow>[] = [
  {
    csvColumnName: "Pac Filename EXW",
    pixlFieldName: "Filename 3",
    formatFunction: getFilenameFromField,
  },
  {
    csvColumnName: "LSY Boardconnect Filename",
    pixlFieldName: "Filename 1",
    formatFunction: getFilenameFromField,
    fieldsearch: [
      {
        fieldname: "Filename 1",
        queries: [{ fieldname: "Lab", isNot: "Stellar" }],
      },
      {
        fieldname: "Filename 2",
        queries: [{ fieldname: "Lab", find: "Stellar" }],
      },
    ],
  },
  {
    csvColumnName: "LSY Boardconnect Trailer Filename",
    pixlFieldName: "Filename 8",
    formatFunction: getFilenameFromField,
  },
];
