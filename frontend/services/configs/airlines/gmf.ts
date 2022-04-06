import { blueboxPresets } from ".";
import { LabGridRow, SystemConfig } from "../../../types";
import { defaultSystemMap } from "./filenamePresets";

export const gmfLabSystems: SystemConfig<LabGridRow>[] = [
  {
    systemName: "Blu Wow",
    vendor: "Bluebox",
    oemSystems: ["Wow"],
    filenameConfig: {
      ...blueboxPresets.sd,
      fieldname: "Filename 1",
    },
    systemMap: defaultSystemMap,
  },
];
