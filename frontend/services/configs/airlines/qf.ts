import { LabGridRow, SystemConfig } from "../../../types";
import createWowFilename from "../../filenames/bluebox";
import { appendToCellValue } from "../../util";
import {
  pacPresets,
  blueboxPresets,
  viasatPreset,
  defaultSystemMap,
} from "./filenamePresets";

export const qfSystems: SystemConfig<LabGridRow>[] = [
  {
    systemName: "PAC SD1",
    vendor: "Panasonic",
    vendorLongName: "Panasonic Avionics",
    oemSystems: ["eX1", "eX2", "eFX"],
    filenameConfig: {
      ...pacPresets.sd,
      fieldname: "Filename 1",
      oemSearch: [
        {
          queries: [{ find: /eX1|eX2|eX3|eFX/gi }],
        },
      ],
    },
    trailerFilename: {
      ...pacPresets.tr,
      fieldname: "Filename 7",
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "PAC AD1",
    vendor: "Panasonic",
    oemSystems: ["eX1", "eX2"],
    filenameConfig: {
      ...pacPresets.sd,
      fieldname: "Filename 2",
      configName: "PAC AD1",
      id: { value: "1" },
      oemSearch: [
        {
          fieldname: "Audio 10 Type",
          queries: [{ find: "Descriptive Audio" }],
        },
      ],
    },
    trailerFilename: {
      ...pacPresets.tr,
      fieldname: "Filename 7",
    },
    systemMap: [
      ...defaultSystemMap,
      {
        csvColumnName: "Language 1",
        pixlFieldName: "Audio 10",
        formatFunction: appendToCellValue,
        formatProps: { appendValue: " Descriptive" },
        fieldsearch: [
          {
            fieldname: "Audio 10",
            queries: [{ hasValue: true }],
          },
        ],
      },
      {
        csvColumnName: "Language 2",
        value: "",
      },
      {
        csvColumnName: "Language 3",
        value: "",
      },
      {
        csvColumnName: "Language 4",
        value: "",
      },
      {
        csvColumnName: "Language 5",
        value: "",
      },
      {
        csvColumnName: "Language 6",
        value: "",
      },
      {
        csvColumnName: "Subtitle 1",
        value: "",
      },
      {
        csvColumnName: "Subtitle 2",
        value: "",
      },
    ],
  },
  {
    systemName: "PAC FHD",
    vendor: "Panasonic",
    oemSystems: ["eX3"],
    filenameConfig: {
      ...pacPresets.fhd,
      fieldname: "Filename 3",
      oemSearch: {
        TV: [
          {
            queries: [
              {
                fieldname: ["Primary Categories", "Secondary Categories"],
                find: "FHD",
              },
            ],
          },
        ],
        Film: [{ queries: [{ fieldname: "Categories", find: "FHD" }] }],
      },
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "PAC 7HD",
    vendor: "Panasonic",
    oemSystems: ["eX3"],
    filenameConfig: {
      ...pacPresets.hd,
      fieldname: "Filename 4",
      oemSearch: {
        Film: [
          {
            queries: [
              {
                fieldname: "Categories",
                find: "7HD",
              },
            ],
          },
        ],
        TV: [
          {
            queries: [
              {
                fieldname: ["Primary Categories", "Secondary Categories"],
                find: "7HD",
              },
            ],
          },
        ],
      },
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "PAC EXW",
    vendor: "Panasonic",
    oemSystems: ["eX3"],
    filenameConfig: {
      ...pacPresets.exw,
      fieldname: "Filename 5",
      oemSearch: [{ queries: [{ find: "eXW" }] }],
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "Via WIF",
    vendor: "Viasat",
    oemSystems: ["W-IFE"],
    filenameConfig: {
      ...viasatPreset.sd,
      fieldname: "Filename 6",
      oemSearch: [{ queries: [{ find: "Viasat" }] }],
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "Bluebox Wow",
    vendor: "Bluebox",
    oemSystems: ["Wow"],
    filenameConfig: {
      ...blueboxPresets.sd,
      configName: "Blu Wow",
      fieldname: "Filename 8",
      oemSearch: [{ queries: [{ find: "Bluebox Wow" }] }],
    },
    systemMap: defaultSystemMap,
  },
];
