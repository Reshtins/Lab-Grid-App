import {
  CsvFieldMap,
  CsvMap,
  PacMmaRow,
  SystemFilenameConfig,
} from "../../../../types";
import {
  prependToCellValue,
  appendToCellValue,
  getFilenameFromField,
  getRowNumber,
  createSubkeyFieldsearch,
  getOemEndDate,
} from "../../../util";
import { pacPresets } from "../../airlines";
import {
  defaultPacRow,
  pacSharedColumns,
  pacFilmColumns,
  pacTvColumns,
} from "../columns";
import { pacMmaHeaders } from "../headers";

const defaultSystemMap: CsvFieldMap<PacMmaRow>[] = [
  {
    csvColumnName: "System",
    oemValues: true,
  },
  {
    csvColumnName: "Trailer Filename",
    pixlFieldName: "Filename 7",
  },
  {
    csvColumnName: "Encoding",
    filenameKey: "encoding",
    systemValue: "filenameConfig",
  },
  {
    csvColumnName: "Bitrate",
    filenameKey: "bitrate",
    systemValue: "filenameConfig",
  },
  {
    csvColumnName: "End Date",
    formatFunction: getOemEndDate,
  },
  {
    csvColumnName: "Director",
    pixlFieldName: "Director",
    formatFunction: prependToCellValue,
    formatProps: { prependValue: "DIRECTOR|", fieldLimit: 3 },
  },
  {
    csvColumnName: "Cast",
    pixlFieldName: "Cast",
    fieldsearch: [
      {
        queries: [{ fieldname: "Genres", find: "Animation" }],
        formatterFunction: prependToCellValue,
        formatterFieldname: "Cast",
        formatterProps: { prependValue: "VOICES|", fieldLimit: 3 },
      },
      {
        queries: [{ fieldname: "Genres", isNot: "Animation" }],
        formatterFunction: prependToCellValue,
        formatterFieldname: "Cast",
        formatterProps: { prependValue: "STARS|", fieldLimit: 3 },
      },
    ],
  },
];

const qfTrailer: SystemFilenameConfig = {
  ...pacPresets.tr,
  configName: "PAC TR1",
  fieldname: "Filename 7",
};

export const qfPacCsvMap: CsvMap<PacMmaRow> = {
  csvHeader: pacMmaHeaders,
  defaultRow: defaultPacRow,
  systemConfigs: [
    {
      vendor: "Panasonic",
      systemName: "PAC SD1",
      oemSystems: ["eX1", "ex2", "ex3"],
      filenameConfig: {
        ...pacPresets.sd,
        fieldname: "Filename 1",
        oemSearch: [
          {
            queries: [{ find: "eX1" }],
            value: "eX1 eX2 InSeat A330, eX1 A330 NG ALST",
          },
          {
            queries: [{ find: "eX2" }],
            value: "eX2 A380 SkyCam",
          },
          {
            queries: [{ find: "eX3" }],
            value: "A380 NG eX3",
          },
        ],
      },
      systemMap: [
        ...defaultSystemMap,
        {
          csvColumnName: "Filename",
          pixlFieldName: "Filename 1",
        },
      ],
      trailerFilename: qfTrailer,
    },
    {
      vendor: "Panasonic",
      oemSystems: ["eFX"],
      trailerFilename: qfTrailer,
      systemMap: [
        ...defaultSystemMap,
        {
          csvColumnName: "Filename",
          pixlFieldName: "Filename 1",
        },
      ],
      systemName: "PAC EFX Duration",
      filenameConfig: {
        ...pacPresets.sd,
        configName: "PAC EFX Duration",
        fieldname: "Filename 1",
        oemSearch: [
          {
            queries: [{ find: "eFX" }],
            value: "eFX B737, B737 eFX NG",
          },
        ],
      },
    },
    {
      vendor: "Panasonic",
      systemName: "PAC AD1",
      oemSystems: ["PAC AD"],
      filenameConfig: {
        ...pacPresets.sd,
        configName: "PAC AD1",
        fieldname: "Filename 2",
        oemSearch: [
          {
            fieldname: "Audio 10 Type",
            queries: [{ find: "Descriptive Audio" }],
            value:
              "eX1 eX2 InSeat A330, eX1 A330 NG ALST, eX2 A380 SkyCam, A380 NG eX3, eFX B737, B737 eFX NG",
          },
        ],
      },
      systemMap: [
        ...defaultSystemMap,
        {
          csvColumnName: "Filename",
          pixlFieldName: "Filename 2",
        },
        ...createSubkeyFieldsearch<PacMmaRow>({
          root: "Soundtracks",
          subfieldPrefix: "Soundtrack",
          start: 2,
          rootValue: "",
          subKeyMap: [
            { name: "Language", fieldname: "" },
            { name: "Sequence", fieldname: "" },
            { name: "PID", fieldname: "" },
            { name: "Type", fieldname: "" },
            { name: "Encoding", fieldname: "" },
            { name: "Encrypted", fieldname: "" },
            { name: "Encoding Type", fieldname: "" },
          ],
        }),
        ...createSubkeyFieldsearch<PacMmaRow>({
          root: "Subtitles",
          subfieldPrefix: "Subtitle",
          audioFieldsearch: "sub",
          rootValue: "",
          subKeyMap: [
            { name: "Language", fieldname: "" },
            { name: "PID", fieldname: "" },
            { name: "Sequence", fieldname: "" },
            { name: "Type", fieldname: "" },
          ],
        }),
      ],
    },
    {
      vendor: "Panasonic",
      systemName: "PAC FHD",
      oemSystems: ["eX1", "ex2", "ex3"],
      systemMap: [
        ...defaultSystemMap,
        {
          csvColumnName: "Filename",
          pixlFieldName: "Filename 3",
        },
        {
          csvColumnName: "Encoding",
          value: "FHD MPEG4",
        },
      ],
      filenameConfig: {
        ...pacPresets.fhd,
        configName: "PAC FHD",
        fieldname: "Filename 3",
        oemSearch: {
          TV: [
            {
              fieldname: ["Primary Categories", "Secondary Categories"],
              queries: [{ find: "FHD" }],
              value: "eX3 InSeat B787",
            },
          ],
          Film: [
            {
              fieldname: "Categories",
              queries: [{ find: "FHD" }],
              value: "eX3 InSeat B787",
            },
          ],
        },
      },
      trailerFilename: qfTrailer,
    },
    {
      vendor: "Panasonic",
      trailerFilename: qfTrailer,
      oemSystems: ["eX1", "ex2", "ex3"],
      systemName: "PAC 7HD",
      systemMap: [
        ...defaultSystemMap,
        {
          csvColumnName: "Filename",
          pixlFieldName: "Filename 4",
        },
        {
          csvColumnName: "Encoding",
          value: "HD MPEG4",
        },
        {
          csvColumnName: "Director",
          pixlFieldName: "Director",
        },
      ],
      filenameConfig: {
        ...pacPresets.fhd,
        configName: "PAC 7HD",
        fieldname: "Filename 4",
        oemSearch: {
          TV: [
            {
              fieldname: ["Primary Categories", "Secondary Categories"],
              queries: [{ find: "7HD" }],
              value: "eX3 InSeat B787",
            },
          ],
          Film: [
            {
              fieldname: "Categories",
              queries: [{ find: "7HD" }],
              value: "eX3 InSeat B787",
            },
          ],
        },
      },
    },
    {
      vendor: "Panasonic",
      trailerFilename: qfTrailer,
      oemSystems: ["eX1", "ex2", "ex3"],
      systemName: "PAC eXW",
      filenameConfig: {
        ...pacPresets.exw,
        configName: "PAC eXW",
        fieldname: "Filename 5",
        oemSearch: [
          {
            queries: [{ find: "eXW" }],
            value: "eXW Qstream A330 B737 B717, eXW B717 HTML5",
          },
        ],
      },
      systemMap: [
        ...defaultSystemMap,
        {
          csvColumnName: "Filename",
          pixlFieldName: "Filename 5",
        },
        {
          csvColumnName: "Director",
          pixlFieldName: "Director",
        },
        {
          csvColumnName: "Cast",
          pixlFieldName: "Cast",
        },
      ],
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
    film: [
      ...pacFilmColumns,
      {
        csvColumnName: "Trailer Filename",
        pixlFieldName: "Filename 7",
        formatFunction: getFilenameFromField,
      },
      {
        csvColumnName: "Attributes",
        subKey: ["Attribute 1"],
        value: { name: "action_id", Value: "500010501290102" },
      },
      {
        csvColumnName: "Attributes",
        subKey: ["Attribute 2"],
        value: { name: "no_year_display", Value: "1" },
      },
      {
        csvColumnName: "Attributes",
        subKey: ["Attribute 3"],
        value: { name: "contenttype", Value: "movies_listing" },
      },
      {
        csvColumnName: "Attributes",
        subKey: ["Attribute 4"],
        value: { name: "field3", Value: "badge01" },
      },
      {
        csvColumnName: "Attributes",
        subKey: ["Attribute 4", "Value"],
        fieldsearch: [
          {
            fieldname: "Categories",
            queries: [{ find: /FHD|7HD/gi }],
            value: "badge01,badge10",
          },
        ],
      },
      {
        csvColumnName: "Attributes",
        subKey: ["Attribute 5"],
        value: { name: "advisory_text", Value: "Advisory Text (PAC)" },
      },
      {
        csvColumnName: "Attributes",
        subKey: ["Attribute 6"],
        value: { name: "tone", Value: "Tone (PAC)" },
      },
    ],
    tv: [
      ...pacTvColumns,
      {
        csvColumnName: "Attributes",
        subKey: ["Attribute 1"],
        value: {
          name: "action_id",
          Value: "0500011301270103",
        },
      },
      {
        csvColumnName: "Attributes",
        subKey: ["Attribute 2"],
        value: {
          name: "no_year_display",
          Value: "Episode",
        },
      },
    ],
  },
  meta: [
    {
      shared: [
        {
          csvColumnName: "Your Ref",
          formatFunction: getRowNumber,
        },
        {
          csvColumnName: "Metadata Language",
          value: "English",
        },
      ],
      film: [
        {
          csvColumnName: ["Title", "Release Title", "Short Title"],
          pixlFieldName: "Title",
          fieldsearch: [
            {
              queries: [
                {
                  fieldname: "Audio 10",
                  hasValue: true,
                },
              ],
              fieldname: "Title",
              formatterFunction: appendToCellValue,
              formatterProps: { appendValue: " (Audio Descriptive)" },
            },
          ],
        },
      ],
      tv: [
        {
          csvColumnName: ["Title", "Release Title", "Short Title"],
          pixlFieldName: "Episode",
        },
        {
          csvColumnName: "Series Title",
          pixlFieldName: "Series",
        },
        {
          csvColumnName: "Season Number",
          pixlFieldName: "Season #",
        },
        {
          csvColumnName: "Episode Number",
          pixlFieldName: "Episode #",
        },
      ],
    },
    {
      shared: [
        {
          csvColumnName: "Your Ref",
          formatFunction: getRowNumber,
        },
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
          csvColumnName: "Your Ref",
          formatFunction: getRowNumber,
        },
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
};
