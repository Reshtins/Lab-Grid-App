import { FieldInfo } from "json2csv";
import { CsvFieldMap, SystemConfig } from "../configs";
import { CsvColumnMap, CsvHeader } from "../csv";
import { FieldSearchList } from "../utils";

type SumField = {
  [headerKey: string]: {
    cellNumber: number;
    value: string;
    CC: string;
  };
};

type TitleField = {
  [key: string]: {
    Title: string;
    cellNumber: number;
    Season?: string;
    Episode?: string;
    CC: string;
  };
};

export interface ViasatLanguages {
  [key: string]: FieldInfo<string>;
}

export interface ViasatRow {
  Title: TitleField;
  Subtitle?: SumField;
  Synopsis: SumField;
  "Series Synopsis"?: SumField;
  "People Score": string;
  "Category List": string;
  Genre: string;
  Rating: string;
  "Rating Advisor": string;
  Director: string;
  Cast: SumField;
  Languages: ViasatLanguages;
  "Sub Embed": ViasatLanguages;
  "Closed Caps": string;
  "Sub Dynamic": ViasatLanguages;
  Length: string;
  "Projected Size (MB)": string;
  "Year of Release": string;
  Status: string;
  "Start Date": string;
  "End Date": string;
  "TH or ED"?: string;
  Ratio: string;
  Dist: string;
  Lab: string;
  "Pre-roll 1 (Prev Cycle Ad Pools)": string;
  "Pre-roll 2 (Curr Cycle Ad Pools)": string;
  "Pre-roll 3 (Warning Slate)": string;
  "Dated Version": string;
  "Feature File Name (.mp4)": string;
  "Poster Image File Name (.jpg)"?: string;
  "Series Image File Name (.jpg)"?: string;
  "Episode Image File Name (.jpg)"?: string;
  R: "";
}

export type ViasatFieldMap = CsvFieldMap<ViasatRow>;
export type ViasatHeader = CsvHeader<ViasatRow>[];

export interface ViasatSystemConfig extends SystemConfig<ViasatRow> {
  categories?: FieldSearchList;
}

export interface ViasatConfigMap {
  [iata: string]: {
    systems: ViasatSystemConfig[];
    columnMap: CsvColumnMap<ViasatRow>;
  };
}
