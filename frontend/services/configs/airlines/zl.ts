import { LabGridRow, SystemConfig } from "../../../types";
import { defaultSystemMap, intelsatPreset } from "./filenamePresets";

export const zlSystems: SystemConfig<LabGridRow>[] = [
  {
    systemName: "Int Gog",
    vendor: "Intelsat",
    oemSystems: ["Gogo"],
    systemMap: defaultSystemMap,
    filenameConfig: {
      ...intelsatPreset.sd,
      configName: "Int Gog",
      fieldname: "Filename 1",
      oemSearch: [{ queries: [{ find: "Intelsat Gogo" }] }],
    },
  },
];
