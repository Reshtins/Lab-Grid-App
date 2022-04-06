import { Record } from "@airtable/blocks/models";
import {
  FieldSearch,
  FieldToColumnMapFunction,
  FilenameField,
  FormatterFunction,
  ProgrammingType,
} from ".";
import { CsvColumnMap, CsvHeader } from "./csv";
import { MetadataType } from "./frontend";
import { FieldSearchList } from "./utils";

/**
 * @interface GridProps
 * @airline The airline name to create a lab grid for
 * @iata The IATA code for airline
 * @pacFilePrefix
 * @contentRecords The films/tv records in the programming cycle
 * @languageRecords Records in the "Languges" table
 * @chosenCycle The programming cycle to create the grid for
 */
export interface GridProps {
  airline: string;
  iata: string;
  pacFilePrefix: string;
  contentRecords: Record[];
  languageRecords: Record[];
  pacDistributorRecords?: Record[];
  programmingType: ProgrammingType;
  cycleName: string;
  overwrite?: boolean;
  metadataType: MetadataType | "";
}

export interface AirlineFilenameLookup {
  [iata: string]: FilenameConfigMap;
}

export interface FilenameConfigMap {
  [fieldname: string | FilenameField]: {
    configName: string;
    company: string;
    isTrailer?: boolean;
    codec?: string;
  };
}

export type Vendors =
  | "Panasonic"
  | "Bluebox"
  | "Lufthansa Systems"
  | "Viasat"
  | "Immifly"
  | "Safran"
  | "Intelsat"
  | "Thales Avionics";

export type VendorLongName =
  | "Panasonic Avionics"
  | "Bluebox Aviation"
  | "Lufthansa Systems"
  | "Viasat"
  | "Immifly"
  | "Safran"
  | "Thales Avionics";

/**
 * @interface SystemConfig
 */
export interface SystemConfig<CsvRow> {
  /**
   * @systemName Unused
   */
  systemName: string;
  /**
   * @vendor The vendor of the system
   */
  vendor: Vendors;
  /**
   * @vendorLongName The long vendor of the system
   */
  vendorLongName?: VendorLongName;
  /**
   * @systems Object relating to the creating and parsing the
   */
  oemSystems?: (System | string)[];
  /**
   * @filename System trailer information
   */
  filenameConfig: SystemFilenameConfig;
  /**
   * @filename System trailer information
   */
  trailerFilename?: SystemFilenameConfig;
  /**
   * @oemEndConditions Unused
   */
  oemEndConditions?: string[];

  /**
   * @systemFields Map fields to CSV columns that are specific to the OEM System
   */
  systemMap?: CsvFieldMap<CsvRow>[];

  /**
   * @otherFields
   */
  otherFields?: FieldSearchList;
}

export interface System {
  name: string;
  checkOem?: boolean;
  formatter?: FormatterFunction<any>;
  formatterProps?: any;
}

export interface CalculatedFields {
  columnName: string | string[];
  calculations: {
    pixlField: string | string[];
    formatter?: FieldToColumnMapFunction;
    search?: FieldSearch[];
    props?: any[];
  };
}

export interface SystemFilenameConfig {
  configName: string;
  fieldname: FilenameField | "";
  extension: string;
  filenameFunction: FilenameFunction;
  id?: { fieldname?: string; value?: string };
  fileFormat?: string | ((record: Record) => string);
  encoding?: string;
  quality?: string;
  bitrate?: string;
  aspect?: string;
  oemSearch?: FieldSearchList;
  delivery?: string;
  shipping?: string | { TV: string; Film: string };
  filetype?: SystemFileType;
  isDub?: boolean;
  isTrailer?: boolean;
  additionalFilenames?: boolean | { subs: boolean; dubs: boolean };
}

export type SystemFileType =
  | "image"
  | "video"
  | "subtitle"
  | "basename"
  | "lab";

export type RecordType = "Movie" | "Series" | "Season" | "Episode";
export interface FilenameFunction {
  (record: Record, additionalFilenameProps?: AdditionalFilenameProps): string;
}

export interface FilenamePreset {
  [key: string]: SystemFilenameConfig;
}

export interface AdditionalFilenameProps {
  pacFilePrefix?: string;
  contentLanguages: ContentLanguageMaps;
  pacSerialNumber?: number;
  systems?: (System | string)[];
  config?: SystemFilenameConfig;
  recordType?: RecordType;
}

export type ContentLanguageMaps = {
  audio: Map<string, Record>;
  subs: Map<string, Record>;
};

export interface CsvFieldMap<CsvRow> {
  csvColumnName: keyof CsvRow | (keyof CsvRow)[];
  pixlFieldName?: string;
  pixlAudioName?: { key: string; fieldname: string };
  pixlSubName?: { key: string; fieldname: string };
  formatFunction?: FormatterFunction<any>;
  fieldsearch?: FieldSearch[];
  getAllFieldValues?: boolean;
  formatProps?: any;
  asCellValue?: boolean;
  oemValues?: boolean;
  filename?: boolean;
  trailerFilename?: boolean;
  value?: string | object;
  systemValue?: keyof SystemConfig<CsvRow>;
  filenameKey?: keyof SystemFilenameConfig;
  subKey?: string | string[];
}

export interface CsvMap<CsvRow> {
  csvHeader: CsvHeader<CsvRow>[];
  defaultRow: CsvRow;
  columnMap: CsvColumnMap<CsvRow>;
  systemConfigs: SystemConfig<CsvRow>[];
  meta?: CsvColumnMap<CsvRow>[];
}

export type AirlineCsvMap<CsvRow> = {
  [iata: string]: CsvMap<CsvRow>;
};

export interface SystemGridMapperArgs<CsvRow> {
  record: Record;
  columnMap: CsvColumnMap<CsvRow>;
  systemConfigs: SystemConfig<CsvRow>[];
  meta?: CsvColumnMap<CsvRow>[];
  defaultRow: CsvRow;
  rowNum: number;
  isLab?: boolean;
  overwrite?: boolean;
  pacSerialNumber?: number;
  pacFilePrefix: string;
  contentLanguages: ContentLanguageMaps;
}

export interface MapFieldToCsv<CsvRow> {
  record: Record;
  fieldMap: CsvFieldMap<CsvRow>[];
  initRow: CsvRow;
  systemConfig?: SystemConfig<CsvRow>;
  linkedValues?: {
    oem: string;
    audio: Map<string, Record>;
    subs: Map<string, Record>;
  };
  rowNum?: number;
  pacSerialNumber?: number;
  filename?: string;
  trailerFilename?: string;
}
