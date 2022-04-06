import {
  BlueboxMetadataHeaders,
  BlueboxProgrammingHeaders,
} from "../../../types";
import { createSubfields } from "../../util/csvFields";

// const audioDubFields: Subfield[] = ["Language"];

export const blueboxProgrammingSubfields = {
  dubs: "Audio Dubs",
  subs: "Dynamic Subs",
};

export const blueboxProgrammingHeaders: BlueboxProgrammingHeaders = [
  "Movie/Series Title",
  "Bluebox Movie Filename",
  ...createSubfields(
    blueboxProgrammingSubfields.dubs,
    blueboxProgrammingSubfields.dubs,
    [blueboxProgrammingSubfields.dubs],
    6
  ),
  ...createSubfields(
    blueboxProgrammingSubfields.subs,
    blueboxProgrammingSubfields.subs,
    [blueboxProgrammingSubfields.subs],
    3
  ),
];

export const blueboxMetadataHeaders: BlueboxMetadataHeaders = [
  "Category",
  "Sub-Category",
  "Title",
  "Title Length Check",
  "Genre",
  "Rating",
  "Runtime",
  "Production Year",
  "Cast",
  "Director",
  "Reserved1",
  "Reserved2",
  "Reserved3",
  "Start Date",
  "End Date",
  "Status",
  "featured",
  "featured order",
  "Synopsis",
  "Synopsis Length",
  "Content From",
  "Content Delivery Method",
  "Reserved4",
  "DRM",
  "Reserved5",
  "Thumbnail Image Filename",
  "Synopsis Image Filename",
  "Dubs",
  "Subs",
  "Dynamic Subs",
  "Content Filename",
  "Reserved6",
];
