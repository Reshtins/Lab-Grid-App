import { getPacDate } from "../util/datetime";
import { replaceCharAt } from "../util/formatters";

import { FilenameFunction } from "../../types";

const createPacFilename: FilenameFunction = (
  contentRecord,
  additionalProps
) => {
  const { pacFilePrefix, pacSerialNumber, config } = additionalProps;
  const { id, extension, isTrailer } = config;

  const pad = "00000";
  let filename = pacFilePrefix;

  if (contentRecord.getCellValue("Programming") == "Film") {
    filename += isTrailer ? "t" : "m";
  } else if (contentRecord.getCellValue("Programming") == "TV") {
    filename += "s";
  }

  // const configNameUpper = config.toUpperCase();

  const date = getPacDate(contentRecord.getCellValue("Cycle Start"));
  const srno = date + (pad + pacSerialNumber).slice(-pad.length);
  const filetype = extension;

  if (filetype) {
    filename += srno + filetype;
  } else return "";

  if (id && id.value) {
    filename = replaceCharAt(filename, 7, id.value);
  }

  return filename;
};

export default createPacFilename;
