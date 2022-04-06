export interface UserSettings {
  status: "idle" | "loading";
  overwrite: boolean;
  csvOnly: boolean;
  logOnly: boolean;

  programmingType: ProgrammingType | "";
  metadataType: MetadataType | "";
  cycle: {
    name: string;
    id: string;
  };
  airlineId: string;
}

export type ProgrammingType = "Film" | "TV";

export enum MetadataType {
  Lab = "Lab Grid",
  Pac = "PAC MMA",
  Gantt = "Gantt Chart",
  Viasat = "Viasat",
  Immfly = "Immfly",
  RaveCtr = "RaveCtr",
  RaveGui = "RaveGui",
  RaveMedia = "RaveMedia",
  BlueboxMeta = "Bluebox Metadata",
  BlueboxGrid = "Bluebox Grid",
}

export interface MetadataPick {
  label: MetadataType | string;
  value: MetadataType | "";
  configMap?: any;
  isFilenameRequired?: boolean;
}
