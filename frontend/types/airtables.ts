export interface LinkedCellValue {
  id: string;
  name: string;
}

export interface RecordUpdateObject {
  id: string;
  fields: { [field: string]: any };
}

export type FilenameField =
  | "Filename 1"
  | "Filename 2"
  | "Filename 3"
  | "Filename 4"
  | "Filename 5"
  | "Filename 6"
  | "Filename 7"
  | "Filename 8"
  | "Filename 9"
  | "Filename 10";

export type AudioField = "audio" | "audioType" | "sub" | "subType";
