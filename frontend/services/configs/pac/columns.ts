import { PacGridFieldMap, PacMmaRow } from "../../../types";
import { createSubkeyFieldsearch, getOemEndDate } from "../../util";
import { getFullTime, getDateByFormat } from "../../util/datetime";

export const pacSharedColumns: PacGridFieldMap[] = [
  {
    csvColumnName: ["Title", "Release Title", "Short Title"],
    pixlFieldName: "Title",
  },
  {
    csvColumnName: "Group Ref",
    value: "",
  },
  {
    csvColumnName: "Rating",
    pixlFieldName: "Rating (AUS)",
  },
  {
    csvColumnName: "Duration",
    pixlFieldName: "Duration (h:mm)",
    formatFunction: getFullTime,
  },
  {
    csvColumnName: "Aspect",
    pixlFieldName: "Aspect Ratio",
  },
  {
    csvColumnName: "Start Date",
    pixlFieldName: "Cycle Start",
    formatFunction: getDateByFormat,
    formatProps: { format: "DD-MMM-YY" },
  },
  {
    csvColumnName: "Lab",
    pixlFieldName: "Lab",
  },
  {
    csvColumnName: "Release Year",
    pixlFieldName: "Theatrical release",
    asCellValue: true,
    formatFunction: getDateByFormat,
    formatProps: { format: "YYYY" },
  },
  {
    csvColumnName: "Year",
    pixlFieldName: "Theatrical release",
    asCellValue: true,
    formatFunction: getDateByFormat,
    formatProps: { format: "YYYY" },
  },
  {
    csvColumnName: "<end>",
    value: "<end>",
  },
  ...createSubkeyFieldsearch<PacMmaRow>({
    root: "Soundtracks",
    subfieldPrefix: "Soundtrack",
    audioFieldsearch: "audio",
    rootFieldSearch: [{ queries: [{ hasValue: true }] }],
    subKeyMap: [
      { name: "Language", audioField: "audio" },
      { name: "Sequence", addToIndex: 0 },
      { name: "PID", addToIndex: 48 },
      {
        name: "Type",
        audioField: "audioType",
      },
      {
        name: "Encoding",
        searchValue: "Stereo",
      },
      {
        name: "Encrypted",
        searchValue: "No",
      },
      {
        name: "Encoding Type",
        searchValue: "MP3",
      },
    ],
  }),
  ...createSubkeyFieldsearch<PacMmaRow>({
    root: "Subtitles",
    subfieldPrefix: "Subtitle",
    limit: 5,
    audioFieldsearch: "sub",
    rootFieldSearch: [{ queries: [{ hasValue: true }] }],
    subKeyMap: [
      { name: "Language", audioField: "sub" },
      { name: "PID", addToIndex: 59 },
      { name: "Sequence", addToIndex: 0 },
      {
        name: "Type",
        audioField: "subType",
        map: {
          fieldsearch: [
            { queries: [{ find: "Embedded" }], value: "embedded" },
            { queries: [{ find: "Dynamic Sub" }], value: "subtitle" },
            { queries: [{ find: "Closed Caption" }], value: "closedCaption" },
          ],
        },
      },
    ],
  }),
  {
    csvColumnName: "Soundtracks",
    subKey: ["Soundtrack 1", "Type"],
    pixlFieldName: "Audio 1",
    value: "Dialog",
  },
];

/**
 * Columns used for Film programming
 */
export const pacFilmColumns: PacGridFieldMap[] = [
  {
    csvColumnName: "Release Year",
    pixlFieldName: "Theatrical release",
    asCellValue: true,
    formatFunction: getDateByFormat,
    formatProps: { format: "YYYY" },
  },
  {
    csvColumnName: "Video Type",
    value: "Movie",
  },
  {
    csvColumnName: "Version",
    pixlFieldName: "Version",
    fieldsearch: [
      {
        queries: [{ find: "Theatrical" }],
        value: "Theatrical",
      },
      {
        queries: [{ isNot: "Theatrical" }],
        value: "Edited",
      },
      {
        queries: [{ find: "standard" }],
        value: "Standard",
      },
      {
        queries: [{ isNot: "special" }],
        value: "Special",
      },
      {
        queries: [{ isNot: "saudi" }],
        value: "Saudi",
      },
    ],
  },
  {
    csvColumnName: "Edit",
    pixlFieldName: "Version",
    fieldsearch: [
      {
        queries: [{ find: "Theatrical" }],
        value: "Standard",
      },
    ],
  },
  {
    csvColumnName: "Country Origin",
    pixlFieldName: "Country of Origin",
  },
  {
    csvColumnName: "People Score",
    pixlFieldName: "People Score",
  },
  {
    csvColumnName: "Critic Score",
    pixlFieldName: "Critic Score",
  },

  {
    csvColumnName: "Genre",
    pixlFieldName: "Genres",
  },
  {
    csvColumnName: "Director",
    pixlFieldName: "Director",
  },
  {
    csvColumnName: "Cast",
    pixlFieldName: "Cast",
  },
  {
    csvColumnName: ["Title", "Release Title", "Short Title"],
    pixlFieldName: "Title",
  },
];

export const pacTvColumns: PacGridFieldMap[] = [
  {
    csvColumnName: "Video Type",
    value: "TV Episode",
  },
];

export const defaultPacRow: PacMmaRow = {
  "Your Ref": "",
  "Group Ref": "",
  System: "",
  Rating: "",
  Duration: "",
  Aspect: "",
  Filename: "",
  "Release Year": {
    label: "Year",
    value: "",
  },
  Encoding: "",
  Bitrate: "",
  "Video Type": "",
  Version: "",
  Edit: "",
  "Start Date": "",
  "End Date": "",
  Distributor: "",
  Lab: "",
  "Content Owner": "",
  "Global Genres": "",
  "Global Keywords": "",
  "Credits Start Time": "",
  Soundtracks: {},
  Subtitles: {},
  "Metadata Language": "",
  Title: "",
  "Release Title": "",
  "Short Title": "",
  "Series Title": "",
  "Season Number": "",
  "Episode Number": "",
  Genre: "",
  Director: "",
  Cast: "",
  Description: "",
  "Short Description": "",
  Review: "",
  Year: "",
  "Country Origin": "",
  Country: "",
  "People Score": "",
  "Critic Score": "",
  "Trailer Filename": "",
  Attributes: {},
  "Standard ID": "",
  "<end>": "",
  UID: "",
};
