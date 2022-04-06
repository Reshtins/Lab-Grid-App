import {
  raveConfig,
  raveCtrHeader,
  raveMediaGuiHeader,
  raveMediaHeader,
} from "../../configs";

import {
  CsvBuilder,
  GridProps,
  MetadataType,
  RaveConifigMap,
} from "../../../types";
import createRaveMediaRow from "./createRaveMediaRow";
import createCtrRow from "./createRaveCtrRow";
import createRaveGuiRow from "./createRaveGuiRow";

const createRaveGrid: CsvBuilder = (cycleData, logger) => {
  const { iata, metadataType } = cycleData;

  const config = raveConfig[iata];

  if (!config) {
    return null;
  }

  let callback: (arg0: GridProps, config: RaveConifigMap) => any[];
  let headers: any[];

  switch (metadataType) {
    case MetadataType.RaveCtr:
      callback = createCtrRow;
      headers = raveCtrHeader;
      break;
    case MetadataType.RaveMedia:
      callback = createRaveMediaRow;
      headers = raveMediaHeader;
      break;
    case MetadataType.RaveGui:
      callback = createRaveGuiRow;
      headers = raveMediaGuiHeader;
      break;
  }

  if (!callback) {
    return null;
  }

  const csvOutput = callback(cycleData, config);

  return {
    csvItemCount: 0,
    csvOutput,
    headers,
    listToUpdate: null,
  };
};

export default createRaveGrid;
