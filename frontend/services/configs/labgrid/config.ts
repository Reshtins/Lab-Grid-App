import { AirlineCsvMap, LabGridRow } from "../../../types";

import {
  sharedColumns,
  filmColumns,
  tvColumns,
  defaultLabGrid,
} from "./columns";
import { getShortSubtitleType } from "../../util/language";
import defaultLabHeaders, { gmfHeaders } from "./headers";

import {
  ciSystems,
  gaLabSystems,
  jqLabSystems,
  qfSystems,
  tgSystems,
  vaSystems,
} from "../airlines";
import { gmfLabSystems } from "../airlines/gmf";
import { zlSystems } from "../airlines/zl";

export const labConfigMap: AirlineCsvMap<LabGridRow> = {
  QF: {
    systemConfigs: [...qfSystems],
    csvHeader: defaultLabHeaders,
    defaultRow: defaultLabGrid,
    columnMap: {
      shared: sharedColumns,
      film: filmColumns,
      tv: tvColumns,
    },
  },
  CI: {
    systemConfigs: [...ciSystems],
    csvHeader: defaultLabHeaders,
    defaultRow: defaultLabGrid,
    columnMap: {
      shared: sharedColumns,
      film: filmColumns,
      tv: tvColumns,
    },
  },
  GA: {
    systemConfigs: [...gaLabSystems],
    csvHeader: defaultLabHeaders,
    defaultRow: defaultLabGrid,
    columnMap: {
      shared: sharedColumns,
      film: filmColumns,
      tv: tvColumns,
    },
  },
  VA: {
    systemConfigs: [...vaSystems],
    csvHeader: defaultLabHeaders,
    defaultRow: defaultLabGrid,
    columnMap: {
      shared: sharedColumns,
      film: filmColumns,
      tv: tvColumns,
    },
  },
  TG: {
    systemConfigs: [...tgSystems],
    csvHeader: defaultLabHeaders,
    defaultRow: defaultLabGrid,
    columnMap: {
      shared: sharedColumns,
      film: filmColumns,
      tv: tvColumns,
    },
  },
  GMF: {
    csvHeader: gmfHeaders,
    defaultRow: defaultLabGrid,
    systemConfigs: [...gmfLabSystems],
    columnMap: {
      shared: [
        ...sharedColumns,
        {
          csvColumnName: "Subtitle 3",
          pixlFieldName: "Sub/CC 3",
          formatFunction: getShortSubtitleType,
          formatProps: { subtitleType: "Subtitle 3 Type" },
        },
      ],
      film: filmColumns,
      tv: tvColumns,
    },
  },
  JQ: {
    systemConfigs: [...jqLabSystems],
    csvHeader: defaultLabHeaders,
    defaultRow: defaultLabGrid,
    columnMap: {
      shared: sharedColumns,
      film: filmColumns,
      tv: tvColumns,
    },
  },
  ZL: {
    systemConfigs: [...zlSystems],
    csvHeader: defaultLabHeaders,
    defaultRow: defaultLabGrid,
    columnMap: {
      shared: sharedColumns,
      film: filmColumns,
      tv: tvColumns,
    },
  },
};

export const labGridAirlineList = Object.keys(labConfigMap);
