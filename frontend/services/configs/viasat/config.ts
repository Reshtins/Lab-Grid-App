import { ViasatConfigMap } from "../../../types/systems/viasat";
import { viasatPreset } from "../airlines";
import {
  viasatFilmColumns,
  viasatSharedColumns,
  viasatTvColumns,
} from "./columns";

export const viasatConfig: ViasatConfigMap = {
  QF: {
    systems: [
      {
        systemName: "Blu Wow",
        vendor: "Bluebox",
        categories: {
          Film: [
            {
              fieldname: "Categories",
              queries: [{ isNot: /FHD|7HD|Audio Descriptive/ }],
            },
          ],
          TV: [
            {
              fieldname: ["Primary Categories", "Secondary Categories"],
              queries: [{ isNot: /FHD|7HD|Audio Descriptive/ }],
            },
          ],
        },
        filenameConfig: {
          ...viasatPreset.sd,
          fieldname: "Filename 6",
          oemSearch: [{ queries: [{ find: "Viasat" }] }],
        },
      },
    ],
    columnMap: {
      shared: viasatSharedColumns,
      film: viasatFilmColumns,
      tv: viasatTvColumns,
    },
  },
};
