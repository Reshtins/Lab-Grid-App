import { getDateByFormat, getImmflyRating } from "../../util";
import { ImmflyFieldMap, ImmflyRow } from "../../../types";

export const defaultImmflyRow: ImmflyRow = {
  "Languages/translations": "",
  title: "",
  episode_title: "",
  season_number: "",
  episode_number: "",
  genre: "",
  running_time: "",
  rating: "",
  age_restriction: "",
  filename: "",
  "new/holdover": "",
  start_date: "",
  end_date: "",
  country: "",
  director_name: "",
  cast: "",
  synopsis: "",
  title_year: "",
  languages: "",
  subtitles: "",
  embedded_subtitles: "",
  ID: "",
};

export const immflySharedMap: ImmflyFieldMap[] = [
  {
    csvColumnName: "running_time",
    pixlFieldName: "Duration (mins)",
  },
  {
    csvColumnName: "rating",
    pixlFieldName: "Rating",
  },
  {
    csvColumnName: "age_restriction",
    pixlFieldName: "Rating",
    formatFunction: getImmflyRating,
  },
  {
    csvColumnName: "start_date",
    pixlFieldName: "Cycle Start",
    asCellValue: true,
    formatFunction: getDateByFormat,
    formatProps: { format: "DD/MM/YYYY" },
  },
  {
    csvColumnName: "country",
    pixlFieldName: "Country of Origin",
  },
  {
    csvColumnName: "new/holdover",
    value: "New",
  },
  {
    csvColumnName: "title_year",
    asCellValue: true,
    formatFunction: getDateByFormat,
    pixlFieldName: "Theatrical release",
    formatProps: { format: "YYYY" },
  },
];

export const immflyTvMap: ImmflyFieldMap[] = [
  {
    csvColumnName: "season_number",
    pixlFieldName: "Season #",
  },
  {
    csvColumnName: "episode_number",
    pixlFieldName: "Episode #",
  },
];
