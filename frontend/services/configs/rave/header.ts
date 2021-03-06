import { RaveCtrHeader, RaveMediaHeader } from "../../../types";
import { createSubfields } from "../../util/csvFields";

export const raveCtrHeader: RaveCtrHeader = [
  "Title",
  "Episode Title",
  "Season #",
  "Episode #",
  "Priority",
  "Applications",
  "Genre",
  "Media Category",
  "Runtime",
  "Version",
  "New/HO",
  "Start",
  "End",
  ...createSubfields(
    "Audio",
    "Audio",
    [{ csvField: "Audio", value: "value", addNumber: true }],
    8
  ),
  "Sub BurnIn 1",
  "Sub BurnIn 2",
  ...createSubfields(
    "Dynamic",
    "Dynamic",
    [{ csvField: "Dynamic", value: "value", addNumber: true }],
    5
  ),
  "Filename",
  "Aspect",
  "Resolution",
  "Trailer",
  "Pre-Roll 1",
  "Pre-Roll 2",
  "Pre-Roll 3",
  "Post-Roll",
  "Seat Class",
  "Route",
];

export const raveMediaHeader: RaveMediaHeader = [
  "MediaId",
  "Parent Title",
  "Exhibition Start",
  "Exhibition End",
  "Media Type",
  "Media Category",
  "Thumbnall",
  "Rating",
  "ParentalLock",
  "Priority",
  "Collection",
  "Artist",
  "Album",
  "Media File",
  "Preview File",
  "MF_Widescreen",
  "MF_MPEG Format",
  "PF_Widescreen",
  "PF_MPEG Formate",
  "RunTime",
  "Encrypt",
  "Media Provider",
  "Encoding Lab",
  "Poster Art",
  "BurnedIn Subtitles",
  "Genres",
  "Themes",
  "Routes",
  "SeatZones",
  "Default Language",
  "Subtype",
  "Featured",
  "PPVcontent",
  "Images",
  "Year",
  "Language",
  "Channel Number",
  "Season",
  "Episode",
  "Box Type",
  "ArrivalType",
  "Tags",
  "Rating_PEP",
  "Apps",
];

export const raveMediaGuiHeader = [
  "Parent Title",
  "Title",
  "Episode Title",
  "Language",
  "Synopsis",
  "SubtitleFilename",
  "MKVSubtitleFilename",
  "HLSSubtitleFilename",
  "ClosedCaptioned",
  "AudioStreamIndex",
  "ArtistsCastMembers",
  "LabelPublisher",
  "Directors",
  "DvsStreamIndex",
];
