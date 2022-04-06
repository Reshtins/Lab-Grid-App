import { BlueboxConfigMap } from "../../../types";
import {
  appendToCellValue,
  formatLabTitle,
  getDateByFormat,
  getFilenameFromField,
  splitAndJoinString,
} from "../../util";
import { blueboxPresets } from "../airlines/filenamePresets";

export const blueboxConfig: BlueboxConfigMap = {
  QF: {
    systems: [
      {
        systemName: "Blu Wow",
        vendor: "Bluebox",
        totalDubs: 6,
        totalSubs: 3,
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
              queries: [{ isNot: /FHD|7HD/ }],
            },
          ],
        },
        filenameConfig: {
          ...blueboxPresets.sd,
          fieldname: "Filename 8",
        },
      },
    ],
    columnMap: {
      shared: [
        {
          csvColumnName: "Genre",
          pixlFieldName: "Genres",
        },
        {
          csvColumnName: "Rating",
          pixlFieldName: "Rating",
        },
        {
          csvColumnName: "Runtime",
          pixlFieldName: "Duration (mins)",
          formatFunction: appendToCellValue,
          formatProps: {
            appendValue: " mins",
          },
        },
        {
          csvColumnName: "Start Date",
          pixlFieldName: "Cycle Start",
          asCellValue: true,
          formatFunction: getDateByFormat,
          formatProps: { format: "DD/MM/YYYY" },
        },
        {
          csvColumnName: "Status",
          value: "NEW",
        },
        {
          csvColumnName: "Content From",
          pixlFieldName: "Lab",
        },
        {
          csvColumnName: "Content Delivery Method",
          value: "Smartjog",
        },
        {
          csvColumnName: "DRM",
          value: "Yes",
        },
        {
          csvColumnName: "Content Filename",
          pixlFieldName: "Filename 8",
          formatFunction: getFilenameFromField,
        },
      ],
      film: [
        {
          csvColumnName: "Title",
          pixlFieldName: "Title",
        },
        {
          csvColumnName: "Production Year",
          pixlFieldName: "Theatrical release",
        },
        {
          csvColumnName: "Cast",
          pixlFieldName: "Cast",
        },
        {
          csvColumnName: "Director",
          pixlFieldName: "Director",
          formatFunction: splitAndJoinString,
          formatProps: {
            limit: 3,
            delimmiter: ",",
          },
        },
        {
          csvColumnName: "Synopsis",
          pixlFieldName: "Synopsis (<280)",
          formatFunction: formatLabTitle,
        },
      ],
      tv: [
        {
          csvColumnName: "Synopsis",
          pixlFieldName: "Synopsis (<190)",
          formatFunction: formatLabTitle,
        },
      ],
    },
  },
};
