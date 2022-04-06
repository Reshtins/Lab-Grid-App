import { pacPresets } from "../airlines";
import { appendToCellValue } from "../../util";
import {
  pacSharedColumns,
  pacFilmColumns,
  pacTvColumns,
  defaultPacRow,
} from "./columns";

import { AirlineCsvMap, PacMmaRow, SystemFilenameConfig } from "../../../types";
import { pacMmaHeaders } from "./headers";

import { qfPacCsvMap } from "./presets/qf";

export const pacConfigMap: AirlineCsvMap<PacMmaRow> = {
  QF: qfPacCsvMap,
  CI: {
    csvHeader: pacMmaHeaders,
    defaultRow: defaultPacRow,
    systemConfigs: [
      {
        systemName: "PAC EX2",
        vendor: "Panasonic",
        oemSystems: ["eX2", "eX3"],
        filenameConfig: {
          ...(pacPresets.sd as SystemFilenameConfig),
          configName: "PAC EX2",
          fieldname: "Filename 1",
          oemSearch: {
            Film: [
              {
                queries: [
                  { find: "eX2" },
                  {
                    fieldname: "Type",
                    isNot: "Classic",
                  },
                ],
                value: "eX2 eXcite",
              },
            ],
            TV: [
              {
                queries: [{ find: "eX2" }, { find: "eX3" }],
                value: "eX2 eXcite, eX3",
              },
            ],
          },
        },
        trailerFilename: {
          ...pacPresets.tr,
          configName: "PAC TR1",
          fieldname: "Filename 8",
        },
      },
      {
        systemName: "PAC EX3",
        vendor: "Panasonic",
        oemSystems: ["eX2", "eX3"],
        filenameConfig: {
          ...(pacPresets.sd as SystemFilenameConfig),
          fieldname: "Filename 2",
          configName: "PAC EX3",
          oemSearch: {
            Film: [
              {
                queries: [
                  { find: "eX3" },
                  {
                    fieldname: "Type",
                    isNot: "Classic",
                  },
                ],
                value: "eX3",
              },
            ],
            TV: [],
          },
        },
        trailerFilename: {
          ...pacPresets.tr,
          configName: "PAC TR1",
          fieldname: "Filename 8",
        },
      },
      {
        systemName: "PAC EXK",
        vendor: "Panasonic",
        oemSystems: ["eXK"],
        filenameConfig: {
          ...(pacPresets.sd as SystemFilenameConfig),
          configName: "PAC EXK",
          fieldname: "Filename 3",
          oemSearch: {
            Film: [
              {
                queries: [
                  { find: "eX3" },
                  {
                    fieldname: "Type",
                    isNot: "Classic",
                  },
                ],
                value: "eXK Retrofit",
              },
            ],
            TV: [],
          },
        },
        trailerFilename: {
          ...pacPresets.tr,
          configName: "PAC TR1",
          fieldname: "Filename 8",
        },
      },
      {
        systemName: "PAC S3K",
        vendor: "Panasonic",
        oemSystems: ["S3000i"],
        filenameConfig: {
          ...(pacPresets.sd as SystemFilenameConfig),
          configName: "PAC S3K",
          fieldname: "Filename 4",
          oemSearch: {
            Film: [
              {
                queries: [
                  { find: "S3000i" },
                  {
                    fieldname: "Type",
                    isNot: "Classic",
                  },
                ],
                value: "System S3ki",
              },
              {
                queries: [
                  { find: "S3000i" },
                  {
                    fieldname: "Type",
                    find: "Classic",
                  },
                ],
                value: "eX2 eXcite,eX3,eXK Retrofit,System S3ki",
              },
            ],
            TV: [
              {
                queries: [{ find: "eXK" }, { find: "S3000i" }],
                value: "eXK Retrofit,System S3ki",
              },
            ],
          },
        },
        trailerFilename: {
          ...pacPresets.tr,
          configName: "PAC TR1",
          fieldname: "Filename 8",
        },
      },
      {
        systemName: "DMPES",
        vendor: "Panasonic",
        oemSystems: ["DMPES"],
        // maxSoundtracks: 1,
        // noSubtitles: true,
        filenameConfig: {
          ...(pacPresets.sd as SystemFilenameConfig),
          configName: "PAC DMP",
          fieldname: "Filename 7",
          oemSearch: {
            Film: [
              {
                queries: [{ find: "DMPES" }],
                value: "DMPES",
              },
            ],
            TV: [],
          },
        },
        trailerFilename: {
          ...pacPresets.tr,
          configName: "PAC TR1",
          fieldname: "Filename 8",
        },
      },
    ],
    columnMap: {
      shared: [
        ...pacSharedColumns,
        {
          csvColumnName: "Aspect",
          pixlFieldName: "Aspect Ratio",
          formatFunction: appendToCellValue,
          formatProps: { appendValue: "Fixed" },
        },
      ],
      film: pacFilmColumns,
      tv: pacTvColumns,
    },
    meta: [
      {
        shared: [
          {
            csvColumnName: "Metadata Language",
            value: "English",
          },
        ],
        film: [],
        tv: [
          {
            csvColumnName: ["Title", "Release Title", "Short Title"],
            pixlFieldName: "Episode",
          },
          {
            csvColumnName: "Series Title",
            pixlFieldName: "Series",
          },
        ],
      },
      {
        shared: [
          {
            csvColumnName: "Metadata Language",
            value: "Chinese",
          },
        ],
        film: [
          {
            csvColumnName: ["Title", "Release Title", "Short Title"],
            pixlFieldName: "Chinese Title",
          },
        ],
        tv: [],
      },
      {
        shared: [
          {
            csvColumnName: "Metadata Language",
            value: "Japanese",
          },
        ],
        film: [
          {
            csvColumnName: ["Title", "Release Title", "Short Title"],
            pixlFieldName: "Japanese Title",
          },
        ],
        tv: [],
      },
    ],
  },
  // GA: {},
  // ZL: {},
  // VA: {}
};
