import { RaveAirlineMap } from "../../../types";
import ravFilename from "../../filenames/ravFilename";
import { classicFileFormat } from "../../formatters/fileFormat";
import { raveCtrMap, raveGuiMap, raveMediaMap } from "./fieldMap";

export const raveConfig: RaveAirlineMap = {
  CI: {
    systems: [
      {
        systemName: "Saf RAV",
        vendor: "Safran",
        oemSystems: ["RAVE"],
        filenameConfig: {
          configName: "Saf RAV",
          fieldname: "Filename 6",
          oemSearch: [{ queries: [{ find: "RAVE" }] }],
          extension: ".mp4",
          fileFormat: classicFileFormat,
          shipping: "Safran Passenger Innovations (Brea)",
          filenameFunction: ravFilename,
          delivery: "Smartjog",
        },
        trailerFilename: {
          configName: "Saf TR1",
          fieldname: "Filename 10",
          filenameFunction: ravFilename,
          extension: "_TR.mp4",
        },
      },
    ],
    ctrMap: raveCtrMap,
    mediaMap: raveMediaMap,
    guiMap: raveGuiMap,
  },
};
