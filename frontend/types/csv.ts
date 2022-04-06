import { FieldInfo } from "json2csv";
import { CsvFieldMap } from "./configs";

export interface CsvFieldLabel {
  label: string;
  value: string;
}

export interface CsvColumnMap<CsvRow> {
  shared: CsvFieldMap<CsvRow>[];
  tv: CsvFieldMap<CsvRow>[];
  film: CsvFieldMap<CsvRow>[];
}

export type CsvHeader<CsvRow> = keyof CsvRow | FieldInfo<string>;
