import { UserSettings } from "../types";

export const TABLE_NAMES = {
  airline: "Airlines",
  cycle: "Programming Cycles",
  tvProgramming: "TV Programming",
  filmsProgramming: "Film Programming",
  languages: "Languages",
  csv: "CSV Files",
  distributors: "Distributors",
};

export const DEFAULT_SETTINGS: UserSettings = {
  status: "idle",
  overwrite: false,
  csvOnly: false,

  programmingType: "",
  metadataType: "",
  cycle: { id: "", name: "" },
  airlineId: "",
  // logOnly: process.env.NODE_ENV === "development",
  logOnly: false,
};

export const LANGUAGE_FIELDS = [
  "ISO639-1",
  "ISO639-2T",
  "ISO639-2B",
  "Thales Legacy",
];

export const PROGRAMMING_LINK_CELLS = {
  films: "Programmed Films",
  tv: "Programmed TV",
};

export const PROGRAMMING_FIELDS = [
  "Distributor",
  "Lab",
  "Airline",
  "Duration (mins)",
  "Cycle",
  "Cycle Start",
  "Cycle Start ISO",
  "Category",
  "Programming",
  "IATA",
  "Cycle Name",
  "Title",
  "Genres",
  "Theatrical release",
  "Rating",
  "Director",
  "Cast",
  "Duration (h:mm)",
  "Aspect Ratio",
  "Country of Origin",
  "Rating (AUS)",
  "People Score",
  "Version",
  "Exhibition End",
  "Critic Score",
  "ICAO",
  "Boardconnect UUID",

  "Director (Chinese Traditional)",
  "Cast (Chinese Traditional)",
  "Director (Japanese)",
  "Cast (Japanese)",
  "Synopsis Japanese",
];

export const FILM_FIELDS = [
  ...PROGRAMMING_FIELDS,
  "Film",
  "Synopsis (<280)",
  "Categories",
  "Chinese Title",
  "Synopsis Chinese Simplified",
  "Japanese Title",
  "Synopsis Japanese",
  "Advisory Text (PAC)",
  "Tone (PAC)",
  "Intelligence (PAC)",
  "Rating Advisory (ViaSat)",
  "Type",
  "Boardconnect Trailer UUID",

  "Taiwanese Title",
  "Japanese Title",
  "Synopsis (<200)",
  "Synopsis Chinese Traditional",
];

export const TV_FIELDS = [
  ...PROGRAMMING_FIELDS,
  "Series",
  "Episode",
  "Season",
  "Season #",
  "Episode #",
  "Production Code",
  "Primary Categories",
  "Secondary Categories",
  "Series Synopsis",
  "Synopsis (<190)",
  "Genre (PAC MMA)",

  "Episode Synopsis Chinese Traditional",
  "Series (Japanese)",
  "Episode (Japanese)",
];

export const OEM_FIELDS = {
  systems: ["OEM System 1", "OEM System 2", "OEM System 3", "OEM System 4"],
};
