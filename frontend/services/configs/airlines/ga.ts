import { LabGridRow, SystemConfig } from "../../../types";
import { defaultSystemMap, pacPresets, thalesPresets } from "./filenamePresets";

export const gaLabSystems: SystemConfig<LabGridRow>[] = [
  {
    systemName: "PAC EX2",
    vendor: "Panasonic",
    oemSystems: ["eX2"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...pacPresets.sd,
      oemSearch: [
        {
          queries: [{ find: "eX2" }],
        },
      ],
      configName: "PAC EX2",
      fieldname: "Filename 1",
    },
    trailerFilename: {
      ...pacPresets.sd,
      configName: "PAC TR1",
      fieldname: "Filename 4",
    },
  },
  {
    systemName: "Tha AVA",
    vendor: "Thales Avionics",
    oemSystems: ["AVANT"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...thalesPresets.sd,
      configName: "Tha AVA",
      fieldname: "Filename 2",
      extension: "M4.mpg",
      aspect: "16x9",
    },
    trailerFilename: {
      ...thalesPresets.sd,
      configName: "Tha TR1",
      fieldname: "Filename 5",
      extension: "M4.mpg",
      aspect: "16x9",
    },
  },
  {
    systemName: "Tha i4k",
    vendor: "Thales Avionics",
    oemSystems: ["i4000"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...thalesPresets.sd,
      configName: "Tha i4k",
      fieldname: "Filename 3",
      aspect: "4x3",
      extension: "M1.mpg",
    },
    trailerFilename: {
      ...thalesPresets.sd,
      configName: "Tha TR1",
      fieldname: "Filename 5",
      extension: "M1.mpg",
      aspect: "4x3",
    },
  },
];
