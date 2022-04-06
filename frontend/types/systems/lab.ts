import { Record } from "@airtable/blocks/models";
import { ContentLanguageMaps, CsvFieldMap, SystemConfig } from "..";
import { CsvColumnMap, CsvHeader } from "../csv";

export interface LabGridFilenameArgs {
  rowNum: number;
  pacSerialNumber: number;
  pacFilePrefix: string;
  record: Record;
  config: SystemConfig<LabGridRow>;
  columns: LabGridRow;
  contentLanguages: ContentLanguageMaps;
  overwrite?: boolean;
}

export type LabGridFieldMap = CsvFieldMap<LabGridRow>;

export interface LabConfigMap {
  [iata: string]: {
    systems: SystemConfig<LabGridRow>[];
    columnMap: CsvColumnMap<LabGridRow>;
    csvHeader?: LabGridHeader[];
  };
}

export type LabGridHeader = CsvHeader<LabGridRow>;
export interface LabGridRow {
  No: string;
  Airline: string;
  "PO Number": string;
  "Movie/Series Title": string;
  "Episode Title"?: string;
  "Season No"?: string;
  "Episode No"?: string;
  "Production Code": string;
  Distributor: string;
  Lab: string;
  Year: string;
  "Runtime (min)": string;
  "Cycle Start": string;
  "Language 1": string;
  "Language 2": string;
  "Language 3": string;
  "Language 4": string;
  "Language 5": string;
  "Language 6": string;
  "Subtitle 1": string;
  "Subtitle 2": string;
  "Subtitle 3"?: string;
  "Subtitle 4"?: string;
  "Aspect Ratio": string;
  Version: string;
  Vendor: string;
  System: string;
  "File Format": string;
  "Trailer Filename": string;
  "Movie Filename": string;
  "Dub Filename 1": string;
  "Dub Filename 2": string;
  "Dub Filename 3": string;
  "Dub Filename 4": string;
  "Dub Filename 5": string;
  "Sub Filename 1": string;
  "Sub Filename 2": string;
  "File Type": string;
  Delivery: string;
  "Shipping To": string;
  "Delivery Deadline": string;
  Cost: string;
}

export type WestLabHeaderKey = keyof WestLabGridColumns;
export type WestLabHeaders = CsvHeader<WestLabGridColumns>;

export interface WestLabGridColumns {
  Airline: string;
  Cycle: string;
  "Hardware Vendor": string;
  System: string;
  "West Title ID": null;
  Title: string;
  "Dist. Code": null;
  Distributor: string;
  Lab: string;
  Version: string;
  Runtime: string;
  Rating: string;
  "Rating Warning": string;
  Year: string;
  Country: string;
  Languages: WestLabGridCell;
  "Embed Subs": WestLabGridCell;
  "Aspect Ratio": string;
  "Trailer Aspect Ratio": string;
  "Feature Format": string;
  "Trailer Format": string;
  "Bit Rate": string;
  "Feature Qty": string;
  "Trailer Qty": string;
  Filename: string;
  "Trailer Filename": string;
  "DY Sub": WestLabGridCell;
  "Hardware File Due Date": string;
  "Ship To": string;
  "PO #": string;
  "TECH Bill To": string;
  Notes: string;
}

export type WestLabGridFieldMap = CsvFieldMap<WestLabGridColumns>;

export interface WestLabGridCell {
  [columnName: string]: { label: string };
}
