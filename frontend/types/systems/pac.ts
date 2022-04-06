import { Record } from "@airtable/blocks/models";
import {
  CalculatedFields,
  CsvFieldLabel,
  CsvFieldMap,
  SystemConfig,
  CsvColumnMap,
  FieldSearch,
} from "..";
import { CsvHeader } from "../csv";

export interface PacConfigMap {
  [iata: string]: {
    systems: PacSystemConfig[];
    columnMap: PacGridColumnMap;
    attributes: PacAttributesMap;
    meta: {
      film: PacAdditionalMeta[];
      tv: PacAdditionalMeta[];
    };
  };
}

export interface PacSystemConfig extends SystemConfig<PacMmaRow> {
  maxSoundtracks?: number;
  noSubtitles?: boolean;
  getAllSystems?: boolean;
}

export type PacGridColumnMap = CsvColumnMap<PacMmaRow>;
export type PacAttributesMap = CsvColumnMap<PacAttributeColumn>;
export type PacGridFieldMap = CsvFieldMap<PacMmaRow>;

export interface PacAdditionalMeta {
  titleField: string | CalculatedFields;
  language: string;
  descriptionField: string | CalculatedFields;
  shortDescriptionField?: string | CalculatedFields;
}

export interface PacAttributeColumn {
  number: number;
  name?: string;
  value?: string;
  pixlFieldname?: string | string[];
  search?: FieldSearch[];
}

export type PacMmaHeaders = CsvHeader<PacMmaRow>[];

interface PacSoundtrack {
  [key: string]: {
    Language: string;
    Sequence: string;
    PID: string;
    Encoding: string;
    Type: string;
    Encrypted: string;
    "Encoding Type": string;
  };
}

interface PacSubtitle {
  [key: string]: {
    Language: string;
    Type: string;
    PID: string;
    Sequence: string;
  };
}

interface PacAttribute {
  [key: string]: {
    Name?: string;
    Value?: string;
  };
}

export interface PacMetadataFunction {
  (props: {
    record: Record;
    rowNum: number;
    metadata: PacAdditionalMeta;
    systemRow: PacMmaRow;
    rowConfig: PacSystemConfig;
  }): PacMmaRow;
}

export interface PacMmaRow {
  "Your Ref": string;
  "Group Ref": string;
  System: string;
  Rating: string;
  Duration: string;
  Aspect: string;
  Filename: string;
  "Release Year": CsvFieldLabel;
  Encoding: string;
  Bitrate: string;
  "Video Type": string;
  Version: string;
  Edit: string;
  "Start Date": string;
  "End Date": string;
  Distributor: string;
  Lab: string;
  "Content Owner": string;
  "Global Genres": string;
  "Global Keywords": string;
  "Credits Start Time": string;

  // 10 Sountrack columns
  Soundtracks: PacSoundtrack;

  // 5 Subtitle columns
  Subtitles: PacSubtitle;

  "Metadata Language": string;
  Title: string;
  "Release Title": string;
  "Short Title": string;
  "Series Title": string;
  "Season Number": string;
  "Episode Number": string;
  Genre: string;
  Director: string;
  Cast: string;
  Description: string;
  "Short Description": string;
  Review: string;
  Year: string;
  "Country Origin": string;
  Country: string;
  "People Score": string;
  "Critic Score": string;
  "Trailer Filename": string;

  Attributes: PacAttribute; // Up to 25

  "Standard ID": string;
  "<end>": string;
  UID: string;
}
