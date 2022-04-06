import { LabGridRow, SystemConfig } from "../../../types";
import createPacFilename from "../../filenames/pac";
import { createViasatFilename } from "../../filenames/viasat";
import {
  pacPresets,
  blueboxPresets,
  defaultSystemMap,
} from "./filenamePresets";

export const jqLabSystems: SystemConfig<LabGridRow>[] = [
  {
    systemName: "PAC SD1",
    vendor: "Panasonic",
    oemSystems: ["eX1", "eX2", "eFX"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...pacPresets.sd,
      fieldname: "Filename 1",
      oemSearch: [{ queries: [{ find: /eX1|eX2|eX3|eFX/gi }] }],
    },
    trailerFilename: {
      ...pacPresets.tr,
      fieldname: "Filename 7",
    },
  },
  {
    systemName: "PAC AD1",
    vendor: "Panasonic",
    oemSystems: ["eX1", "eX2"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...pacPresets.sd,
      fieldname: "Filename 2",
      configName: "PAC AD1",
      oemSearch: [
        {
          queries: [
            {
              fieldname: "Audio 10 Type",
              find: "Descriptive Audio",
            },
          ],
        },
      ],
    },
    trailerFilename: {
      ...pacPresets.tr,
      fieldname: "Filename 7",
    },
  },
  {
    systemName: "PAC FHD",
    vendor: "Panasonic",
    oemSystems: ["eX3"],
    systemMap: defaultSystemMap,
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
        Film: [
          {
            queries: [{ fieldname: "Categories", find: "FHD" }],
          },
        ],
      },
    },
    trailerFilename: {
      ...pacPresets.tr,
      fieldname: "Filename 7",
    },
  },
  {
    systemName: "PAC 7HD",
    vendor: "Panasonic",
    oemSystems: ["eX3"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...pacPresets.hd,
      fieldname: "Filename 4",
      oemSearch: {
        Film: [
          {
            fieldname: "Categories",
            queries: [{ find: "7HD" }],
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
    trailerFilename: {
      ...pacPresets.tr,
      fieldname: "Filename 7",
    },
  },
  {
    systemName: "PAC EXW",
    vendor: "Panasonic",
    oemSystems: ["eX3"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...pacPresets.exw,
      fieldname: "Filename 5",
      oemSearch: [{ queries: [{ find: "eXW" }] }],
    },
    trailerFilename: {
      ...pacPresets.tr,
      fieldname: "Filename 7",
      configName: "PAC Tr1",
      extension: "m4.mpg",
      isTrailer: true,
      filenameFunction: createPacFilename,
    },
  },
  {
    systemName: "Via WIF",
    vendor: "Viasat",
    oemSystems: ["W-IFE"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      fieldname: "Filename 6",
      configName: "Via WIF",
      fileFormat: "MP4, VBR 900kb/s",
      extension: ".mp4",
      delivery: "Aspera",
      shipping: "VIASAT",
      oemSearch: [{ queries: [{ find: "Viasat" }] }],
      filenameFunction: createViasatFilename,
    },
  },
  {
    systemName: "Bluebox Wow",
    vendor: "Bluebox",
    oemSystems: ["Wow"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...blueboxPresets.sd,
      configName: "Blu Wow",
      fieldname: "Filename 8",
    },
  },
];
