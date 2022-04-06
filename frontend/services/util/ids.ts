import { Record } from "@airtable/blocks/models";
import { SystemFilenameConfig, Vendors } from "../../types";
import { createLsyUuid } from "../filenames/lufthansa";
import { getPacSerialNumberFromString } from "./pac";

export const getSystemId = (
  record: Record,
  filenameConfig: SystemFilenameConfig,
  vendor: Vendors,
  fieldname?: string
) => {
  fieldname = fieldname ?? filenameConfig.fieldname ?? "Broad";

  if (!fieldname) return "";

  switch (vendor) {
    case "Panasonic":
      const filename = record.getCellValueAsString(filenameConfig.fieldname);
      return getPacSerialNumberFromString(filename).toString();
    case "Lufthansa Systems":
      const id = record.getCellValueAsString(fieldname);
      return id ? id : createLsyUuid();
    default:
      return "";
  }
};
