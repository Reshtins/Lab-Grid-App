import { Record } from "@airtable/blocks/models";
import { FieldInfo } from "json2csv";
import { AudioField, GridProps } from ".";
import { AirlineCsvMap, CsvFieldMap, SystemConfig } from "./configs";

export interface FormatterFunctionArgs<PropType> {
  record: Record;
  fieldname: string | string[];
  value?: string;
  systemConfig?: SystemConfig<any>;
  row?: number;
  props?: PropType;
}

export interface FormatterFunction<PropType> {
  (args: FormatterFunctionArgs<PropType>): string;
}

export type FieldToColumnMapFunction = (
  record: Record,
  mapping: {
    fieldname: string;
    columnName: string;
    formatter?: FormatterFunction<any>;
    formatterProps?: any;
  }[]
) => { [key: string]: string };

/**
 * @interface FieldSearch
 */
export interface FieldSearch {
  /**
   * @fieldname The field name to search in
   */
  readonly fieldname?: string | string[];
  /**
   * @query The string to search in the field for
   */
  readonly queries: QueryObject[];

  /**
   * @value The value to return
   */
  readonly value?: string;

  /**
   * Value to return if search is invalid was found
   */
  readonly defaultValue?: string;

  /**
   * @formatterFunction return value if fieldsearch is true
   */
  formatterFunction?: FormatterFunction<any>;
  /**
   * @formatterFieldname Fieldname to pass when using formatterFunction
   */
  formatterFieldname?: string | string[];
  /**
   * @formatterProps Props to pass into the formatterFunction
   */
  formatterProps?: any;
  /**
   * @csvColumn Column in the CSV the field is mapped to
   */
  csvColumn?: string | string[];
}

export interface SearchResultObject {
  fieldname: string | string[];
  value: string;
  csvColumn?: string | string[];
}

export type FieldSearchList =
  | FieldSearch[]
  | {
      Film: FieldSearch[];
      TV: FieldSearch[];
    };

/**
 * @interface QueryObject
 */
export interface QueryObject {
  readonly fieldname?: string | string[];
  /**
   * @find the value or regex to search the cell for
   */
  readonly find?: string | RegExp;
  /**
   * @isNot check if the field doenst contain the value
   */
  readonly isNot?: string | RegExp;
  /**
   * @hasValue true if the field has a value, false if empty
   */
  readonly hasValue?: boolean;
}

export interface CsvFunctionOutput {
  csvItemCount: number;
  listToUpdate: any[] | null;
  csvOutput: any[];
  headers: any[];
}

export declare type HeaderParserFunction = (
  rootName: string,
  csvHeaderName: string,
  subfields: Subfield[],
  num: number
) => FieldInfo<string>[];

export type Subfield =
  | string
  | { csvField: string; value: string; addNumber?: boolean };

export type CsvBuilder = (
  props: GridProps,
  loggger?: (message: string) => void
) => CsvFunctionOutput | null;

export interface CsvMapCreator<CsvRow> {
  root: keyof CsvRow;
  rootFieldSearch?: FieldSearch[];
  rootValue?: string;
  start?: number;
  limit?: number;
  subfieldPrefix?: string;
  audioFieldsearch?: AudioField;
  subKeyMap: CsvSubkeyCreator<CsvRow>[];
}

export interface CsvSubkeyCreator<CsvRow> {
  name: string;
  map?: Omit<CsvFieldMap<CsvRow>, "csvColumnName">;
  audioField?: AudioField;
  addToIndex?: number;
  searchValue?: string;
  value?: string;
  fieldname?: string;
  appendIndexToName?: boolean;
}
