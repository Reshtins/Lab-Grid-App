import { Record } from "@airtable/blocks/models";

export const classicFileFormat = (record: Record) => {
  if (record.getCellValueAsString("Programming") === "Film") {
    const isClassic = record.getCellValueAsString("Type").includes("Classic");
    return isClassic ? "SD, MPEG4, 1.5Mbps" : "HD, MPEG4, 4.0Mbps";
  }
};
