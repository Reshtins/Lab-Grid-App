import { FieldSearch, FilenameField, FormatterFunction, Vendors } from "..";

export interface GanttChartColumns {
  commonFields: {
    films: CommonGanttFields;
    tv: CommonGanttFields;
  };
  languages: { columnName: GanttLanguage; value: string | FieldSearch }[];
  subs: { columnName: GanttSubLanguage; value: number }[];
  files:
    | GanttChartFiles[]
    | {
        Film: GanttChartFiles[];
        TV: GanttChartFiles[];
      };
}

export interface GanttChartFiles {
  label: string;
  filenameField: FilenameField;
  vendor: Vendors;
  formatterFunction?: FormatterFunction<any>;
  formatterProps?: any;
  search?: FieldSearch;
}

export interface CommonGanttFields {
  Asset: FieldSearch;
  Title: FieldSearch;
  "Ep Title": FieldSearch;
  Season: FieldSearch;
  "Ep#": FieldSearch;
  "Prod Code": FieldSearch;
  "Credit Start": FieldSearch;
  "Actual Runtime": FieldSearch;
  Aspect: FieldSearch;
  "Master Status": FieldSearch;
  Version: FieldSearch;
  Distributor: FieldSearch;
  Lab: FieldSearch;
}

export interface GanttConfig {
  [iata: string]: GanttChartColumns;
}

type GanttLanguage = "L1" | "L2" | "L3" | "L4" | "L5" | "L6";
type GanttSubLanguage = "Sub1" | "Sub2" | "Sub3" | "Sub4" | "Sub5" | "Sub6";

type GanntColumnName =
  | keyof CommonGanttFields
  | GanttSubLanguage
  | GanttLanguage
  | string;

export type GanttRow = {
  [key in GanntColumnName]: string;
};
