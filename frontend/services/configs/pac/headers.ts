import { PacMmaHeaders, Subfield } from "../../../types";
import { createSubfields } from "../../util/csvFields";

const soundtrackSubfields: Subfield[] = [
  { csvField: "Soundtrack", value: "Language", addNumber: true },
  "Sequence",
  "PID",
  "Encoding",
  "Type",
  "Encrypted",
  "Encoding Type",
];

const subtitleSubfield: Subfield[] = [
  { csvField: "Subtitle", value: "Language", addNumber: true },
  "Type",
  "PID",
  "Sequence",
];

const attributieFields: Subfield[] = [
  { csvField: "Attribute", value: "Name", addNumber: true },
  "Value",
];

export const PAC_MAX_SOUNDTRACKS = 10;
export const PAC_MAX_SUBTITLES = 5;
export const PAC_MAX_ATTRIBUTES = 25;

export const pacMmaHeaders: PacMmaHeaders = [
  "Your Ref",
  "Group Ref",
  "System",
  "Rating",
  "Duration",
  "Aspect",
  "Filename",
  "Year",
  "Encoding",
  "Bitrate",
  "Video Type",
  "Version",
  "Edit",
  "Start Date",
  "End Date",
  "Distributor",
  "Lab",
  "Content Owner",
  "Global Genres",
  "Global Keywords",
  "Credits Start Time",
  ...createSubfields(
    "Soundtracks",
    "Soundtrack",
    soundtrackSubfields,
    PAC_MAX_SOUNDTRACKS
  ),
  ...createSubfields(
    "Subtitles",
    "Subtitle",
    subtitleSubfield,
    PAC_MAX_SUBTITLES
  ),
  "Metadata Language",
  "Title",
  "Release Title",
  "Short Title",
  "Series Title",
  "Season Number",
  "Episode Number",
  "Genre",
  "Director",
  "Cast",
  "Description",
  "Short Description",
  "Review",
  "Year",
  "Country Origin",
  "Country",
  "People Score",
  "Critic Score",
  "Trailer Filename",
  ...createSubfields(
    "Attributes",
    "Attribute",
    attributieFields,
    PAC_MAX_ATTRIBUTES
  ),
  "Standard ID",
  "<end>",
  "UID",
];
