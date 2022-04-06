import { immflyPresets } from "..";
import { AirlineCsvMap } from "../../../types";
import { ImmflyRow } from "../../../types/systems/immfly";
import immFilename from "../../filenames/immifly";
import { formatLabTitle } from "../../util";
import { immflySharedMap } from "./columns";

export const immflyConfig: AirlineCsvMap<ImmflyRow> = {
  CI: {
    systemConfigs: [
      {
        systemName: "Imm MP4",
        vendor: "Immifly",
        oemSystems: ["Immfly"],
        filenameConfig: {
          ...immflyPresets.sd,
          fieldname: "Filename 5",
          configName: "Imm MP4",
        },
        trailerFilename: {
          configName: "Imm TR1",
          fieldname: "Filename 9",
          filenameFunction: immFilename,
          extension: "_TR.mp4",
        },
        languages: [
          {
            shared: [
              {
                csvColumnName: "Languages/translations",
                value: "English",
              },
              {
                csvColumnName: "cast",
                pixlFieldName: "Cast",
              },
              {
                csvColumnName: "director_name",
                pixlFieldName: "Director",
              },
            ],
            film: [
              {
                csvColumnName: "title",
                pixlFieldName: "Film",
                formatFunction: formatLabTitle,
              },
              {
                csvColumnName: "synopsis",
                pixlFieldName: "Synopsis (<200)",
              },
            ],
            tv: [
              {
                csvColumnName: "title",
                pixlFieldName: "Series",
                formatFunction: formatLabTitle,
              },
              {
                csvColumnName: "episode_title",
                pixlFieldName: "Episode",
                formatFunction: formatLabTitle,
              },
              {
                csvColumnName: "synopsis",
                pixlFieldName: "Synopsis (<190)",
              },
            ],
          },
          {
            shared: [
              {
                csvColumnName: "Languages/translations",
                value: "Traditional chinese",
              },
              {
                csvColumnName: "director_name",
                pixlFieldName: "Director (Chinese Traditional)",
              },
              {
                csvColumnName: "cast",
                pixlFieldName: "Cast (Chinese Traditional)",
              },
            ],
            film: [
              {
                csvColumnName: "title",
                pixlFieldName: "Taiwanese Title",
              },
              {
                csvColumnName: "synopsis",
                pixlFieldName: "Synopsis Chinese Traditional",
              },
            ],
            tv: [
              {
                csvColumnName: "synopsis",
                pixlFieldName: "Episode Synopsis Chinese Traditional",
              },
            ],
          },
          {
            shared: [
              {
                csvColumnName: "Languages/translations",
                value: "Japanese",
              },
              {
                csvColumnName: "director_name",
                pixlFieldName: "Director (Japanese)",
              },
              {
                csvColumnName: "cast",
                pixlFieldName: "Cast (Japanese)",
              },
              {
                csvColumnName: "synopsis",
                pixlFieldName: "Synopsis Japanese",
              },
            ],
            film: [
              {
                csvColumnName: "title",
                pixlFieldName: "Japanese Title",
              },
            ],
            tv: [
              {
                csvColumnName: "title",
                pixlFieldName: "Series (Japanese)",
                formatFunction: formatLabTitle,
              },
              {
                csvColumnName: "episode_title",
                pixlFieldName: "Episode (Japanese)",
                formatFunction: formatLabTitle,
              },
            ],
          },
        ],
      },
    ],
    columnMap: {
      shared: [
        ...immflySharedMap,
        {
          csvColumnName: "genre",
          pixlFieldName: "Category",
          fieldsearch: [
            {
              queries: [{ find: /New Releases/i }],
              formatterFunction: "All, New On Board",
            },
            {
              queries: [{ find: /Family/i }],
              formatterFunction: "All, Family",
            },
            {
              queries: [{ find: /International/i }],
              formatterFunction: "All, International",
            },
            {
              queries: [{ find: /Favourites/i }],
              formatterFunction: "All, Favourites",
            },
            {
              queries: [{ find: /Drama/i }],
              formatterFunction: "All, The Couch",
            },
            {
              queries: [{ find: /Asian/i }],
              formatterFunction: "All, Asian TV",
            },
            {
              queries: [{ find: /Kids/i }],
              formatterFunction: "Kids Watch",
            },
          ],
        },
      ],
      film: [
        {
          csvColumnName: "director_name",
          pixlFieldName: "Director",
        },
        {
          csvColumnName: "cast",
          pixlFieldName: "Cast",
        },
      ],
      tv: [
        {
          csvColumnName: "episode_number",
          pixlFieldName: "Episode #",
        },
        {
          csvColumnName: "season_number",
          pixlFieldName: "Season #",
        },
      ],
    },
  },
};

export const immflyList = Object.keys(immflyConfig);
