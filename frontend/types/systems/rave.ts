import { FieldInfo } from "json2csv";
import { SystemConfig } from "../configs";
import { CsvColumnMap, CsvHeader } from "../csv";

export interface ListFields {
  [key: string]: FieldInfo<string>;
}

export interface RaveCtrRow {
  Title: string;
  "Episode Title": string;
  "Season #": string;
  "Episode #": string;
  Priority: string;
  Applications: string;
  Genre: string;
  "Media Category": string;
  Runtime: string;
  Version: string;
  "New/HO": string;
  Start: string;
  End: string;
  Audio: ListFields;
  "Sub BurnIn 1": string;
  "Sub BurnIn 2": string;
  Dynamic: ListFields;
  Filename: string;
  Aspect: string;
  Resolution: string;
  Trailer: string;
  "Pre-Roll 1": string;
  "Pre-Roll 2": string;
  "Pre-Roll 3": string;
  "Post-Roll": string;
  "Seat Class": string;
  Route: string;
}

export interface RaveMediaRow {
  MediaId: string;
  "Parent Title": string;
  "Exhibition Start": string;
  "Exhibition End": string;
  "Media Type": string;
  "Media Category": string;
  Thumbnall: string;
  Rating: string;
  ParentalLock: string;
  Priority: string;
  Collection: string;
  Artist: string;
  Album: string;
  "Media File": string;
  "Preview File": string;
  MF_Widescreen: string;
  "MF_MPEG Format": string;
  PF_Widescreen: string;
  "PF_MPEG Formate": string;
  RunTime: string;
  Encrypt: string;
  "Media Provider": string;
  "Encoding Lab": string;
  "Poster Art": string;
  "BurnedIn Subtitles": string;
  Genres: string;
  Themes: string;
  Routes: string;
  SeatZones: string;
  "Default Language": string;
  Subtype: string;
  Featured: string;
  PPVcontent: string;
  Images: string;
  Year: string;
  Language: string;
  "Channel Number": string;
  Season: string;
  Episode: string;
  "Box Type": string;
  ArrivalType: string;
  Tags: string;
  Rating_PEP: string;
  Apps: string;
}

export interface RaveMediaGuiRow {
  "Parent Title": string;
  Title: string;
  "Episode Title": string;
  Language: string;
  Synopsis: string;
  SubtitleFilename: string;
  MKVSubtitleFilename: string;
  HLSSubtitleFilename: string;
  ClosedCaptioned: string;
  AudioStreamIndex: string;
  ArtistsCastMembers: string;
  LabelPublisher: string;
  Directors: string;
  DvsStreamIndex: string;
}

export type RaveCtrHeader = CsvHeader<RaveCtrRow>[];
export type RaveMediaHeader = CsvHeader<RaveMediaRow>[];
export type RaveMediaGuiHeader = CsvHeader<RaveMediaGuiRow>[];

export type RaveCtrFieldMap = CsvColumnMap<RaveCtrRow>;
export type RaveMediaFieldMap = CsvColumnMap<RaveMediaRow>;
export type RaveMediaGuiFieldMap = CsvColumnMap<RaveMediaGuiRow>;
export interface RaveConifigMap {
  systems: SystemConfig<any>[];
  ctrMap: RaveCtrFieldMap;
  mediaMap: RaveMediaFieldMap;
  guiMap: RaveMediaGuiFieldMap;
}

export interface RaveCtrConfig {}
export interface RaveAirlineMap {
  [iata: string]: RaveConifigMap;
}
