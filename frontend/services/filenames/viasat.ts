import { FilenameFunction, SystemFileType, RecordType } from "../../types";
import { getShortDate } from "../util/datetime";

export const createViasatFilename: FilenameFunction = (
  contentRecord,
  additionalProps
) => {
  const iata = contentRecord.getCellValueAsString("IATA");
  const pad = "00";
  const date = getShortDate(contentRecord.getCellValue("Cycle Start"));
  const programmingType = contentRecord.getCellValueAsString("Programming");
  let filename = iata;

  const { config, recordType } = additionalProps;
  const { filetype = "video", extension = ".mp4" } = config;

  filename += date;
  filename += getViasatFiletype(filetype, recordType, programmingType);

  if (programmingType == "Film") {
    filename += contentRecord
      .getCellValueAsString("Film")
      .replace(/[^a-zA-Z0-9]/g, "");
  } else if (programmingType == "TV") {
    filename +=
      contentRecord
        .getCellValueAsString("Series")
        .replace(/[^a-zA-Z0-9]/g, "") + "_";
    filename +=
      "S" +
      (pad + contentRecord.getCellValueAsString("Season #")).slice(-pad.length);
    filename +=
      "E" +
      (pad + contentRecord.getCellValueAsString("Episode #")).slice(
        -pad.length
      );
  }
  filename += extension;
  return filename;
};

const getViasatFiletype = (
  filetype: SystemFileType,
  recordType: RecordType,
  programmingType: string
) => {
  switch (filetype) {
    case "image":
      if (recordType === "Series") {
        return "_TV_Image-Series";
      } else if (recordType === "Episode") {
        return "_TV_Image-Episode";
      }
      return "_Movie_Image-Poster_";
    case "video":
      return programmingType === "Film" ? "_Movie_Feature_" : "_TV_Program_";
    default:
      return "";
  }
};
