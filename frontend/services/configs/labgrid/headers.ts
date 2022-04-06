import { LabGridHeader } from "../../../types";
import { insertIntoArray } from "../../util/formatters";

const defaultLabHeaders: LabGridHeader[] = [
  "No",
  "Airline",
  "PO Number",
  "Movie/Series Title",
  "Episode Title",
  "Season No",
  "Episode No",
  "Production Code",
  "Distributor",
  "Lab",
  "Year",
  "Runtime (min)",
  "Cycle Start",
  "Language 1",
  "Language 2",
  "Language 3",
  "Language 4",
  "Language 5",
  "Language 6",
  "Subtitle 1",
  "Subtitle 2",
  "Aspect Ratio",
  "Version",
  "Vendor",
  "System",
  "File Format",
  "Trailer Filename",
  "Movie Filename",
  "Dub Filename 1",
  "Dub Filename 2",
  "Dub Filename 3",
  "Dub Filename 4",
  "Dub Filename 5",
  "Sub Filename 1",
  "Sub Filename 2",
  "File Type",
  "Delivery",
  "Shipping To",
  "Delivery Deadline",
  "Cost",
];

export default defaultLabHeaders;

export const gmfHeaders = insertIntoArray<LabGridHeader>(
  defaultLabHeaders,
  21,
  "Subtitle 3"
);
