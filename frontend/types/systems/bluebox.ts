import { CsvFieldMap, SystemConfig } from "../configs";
import { CsvColumnMap, CsvHeader } from "../csv";
import { FieldSearchList } from "../utils";

export interface BlueboxProgrammingRow {
  "Movie/Series Title": string;
  "Bluebox Movie Filename": string;
  "Audio Dubs": { [audioNameAndNumber: string]: string };
  "Dynamic Subs": { [subNameAndNumber: string]: string };
}

export type BlueboxProgrammingHeaders = CsvHeader<BlueboxProgrammingRow>[];

export interface BlueboxMetadataRow {
  Category: string;
  "Sub-Category": string;
  Title: string;
  "Title Length Check": string;
  Genre: string;
  Rating: string;
  Runtime: string;
  "Production Year": string;
  Cast: string;
  Director: string;
  Reserved1: string;
  Reserved2: string;
  Reserved3: string;
  "Start Date": string;
  "End Date": string;
  Status: string;
  featured: string;
  "featured order": string;
  Synopsis: string;
  "Synopsis Length": string;
  "Content From": string;
  "Content Delivery Method": string;
  Reserved4: string;
  DRM: string;
  Reserved5: string;
  "Thumbnail Image Filename": string;
  "Synopsis Image Filename": string;
  Dubs: string;
  Subs: string;
  "Dynamic Subs": string;
  "Content Filename": string;
  Reserved6: string;
}

export type BlueboxMetadataHeaders = CsvHeader<BlueboxMetadataRow>[];
export interface BlueboxSystemConfig extends SystemConfig<BlueboxMetadataRow> {
  totalDubs: number;
  totalSubs: number;
  categories?: FieldSearchList;
}

export type BlueboxMetadataFieldMap = CsvFieldMap<BlueboxMetadataRow>;
export interface BlueboxConfigMap {
  [iata: string]: {
    systems: BlueboxSystemConfig[];
    columnMap: CsvColumnMap<BlueboxMetadataRow>;
  };
}
