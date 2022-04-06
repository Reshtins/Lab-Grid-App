import { FilenameFunction } from "../../types";
import { getPacDate } from "../util/datetime";

const immFilename: FilenameFunction = (contentRecord, additionalProps) => {
  const date = getPacDate(contentRecord.getCellValue("Cycle Start"));
  const programmingType = contentRecord.getCellValue("Programming");
  const iata = contentRecord.getCellValueAsString("IATA");

  const {
    contentLanguages: { audio, subs },
    config,
  } = additionalProps;
  const { isTrailer } = config;

  let filename = `${iata}${date}_`;

  const audioLanguages = [...audio.values()];
  const subLanguages = [...subs.values()];

  let filenameAudio = "";
  for (let index = 0; index < audioLanguages.length; index++) {
    if (typeof audioLanguages === "string") {
      filenameAudio += audioLanguages;
    } else if (index in audioLanguages && audioLanguages[index]) {
      filenameAudio += audioLanguages[index].getCellValue("ISO639-2T");
    }
  }

  let filenameSubs = "";
  for (let index = 3; index < subLanguages.length; index++) {
    if (subLanguages[index]) {
      filenameSubs += subLanguages[index].getCellValue("ISO639-2T");
    }
  }

  if (programmingType == "Film") {
    filename += contentRecord
      .getCellValueAsString("Title")
      .replace(/[^a-zA-Z0-9]/g, "");
  } else if (programmingType == "TV") {
    const episode = contentRecord.getCellValueAsString("Episode #")
      ? "E" + contentRecord.getCellValueAsString("Episode #")
      : "";
    filename +=
      contentRecord
        .getCellValueAsString("Series")
        .replace(/[^a-zA-Z0-9]/g, "") +
      "_S" +
      contentRecord.getCellValueAsString("Season #") +
      episode;
  }
  if (isTrailer) {
    filename += "_TR";
  } else {
    filename += "_" + filenameAudio;

    if (filenameSubs) {
      filename += "_" + filenameSubs + "Sub";
    }
  }

  filename += ".mp4";
  return filename;
};

export default immFilename;
