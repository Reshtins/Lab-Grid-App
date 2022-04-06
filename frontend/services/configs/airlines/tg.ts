import { LabGridRow, SystemConfig } from "../../../types";
import { defaultSystemMap, pacPresets } from "./filenamePresets";

export const tgSystems: SystemConfig<LabGridRow>[] = [
  {
    systemName: "PAC EX2",
    vendor: "Panasonic",
    oemSystems: ["eX2"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...pacPresets.sd,
      fieldname: "Filename 1",
      configName: "PAC EX2",
      shipping: {
        Film: "Panasonic Avionics Corporation (Cloud)",
        TV: "Stellar KL",
      },
      oemSearch: [{ queries: [{ find: "eX2" }] }],
    },
  },
  {
    systemName: "PAC S3K",
    vendor: "Panasonic",
    oemSystems: ["S3000i"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...pacPresets.sd,
      fieldname: "Filename 2",
      configName: "PAC S3K",
      extension: "m1.mpg",
      aspect: "4x3",
      shipping: {
        Film: "Panasonic Avionics Corporation (Cloud)",
        TV: "Stellar KL",
      },
      oemSearch: [{ queries: [{ find: /S3000i|S3k/gi }] }],
    },
    trailerFilename: {
      ...pacPresets.tr,
      fieldname: "Filename 3",
      configName: "PAC TR1",
      aspect: "4x3",
      extension: "m1.mpg",
      shipping: {
        Film: "Panasonic Avionics Corporation (Cloud)",
        TV: "Stellar KL",
      },
    },
  },
];
