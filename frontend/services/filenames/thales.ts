import { FilenameFunction } from "../../types";

// function avantFilename(iata, contentRecord, audioArray, subsArray) {
const thalesFilename: FilenameFunction = (contentRecord, additionalProps) => {
  const { audioLanguages, subLanguages, config } = additionalProps;
  const { isTrailer, extension = "M4.mpg", aspect } = config;

  const iata = contentRecord.getCellValueAsString("IATA");

  const audioArray = Array.isArray(audioLanguages)
    ? audioLanguages.map((r) => r.getCellValue("Thales Legacy") as string)
    : [audioLanguages];
  const subsArray = Array.isArray(subLanguages)
    ? subLanguages.map((r) => r.getCellValue("Thales Legacy") as string)
    : [];

  let aspectLanguage = "";
  let filenameAudio = audioArray.join("");

  if (contentRecord.getCellValue("Programming") == "TV") {
    aspectLanguage +=
      "S" +
      contentRecord.getCellValue("Season #") +
      "E" +
      contentRecord.getCellValue("Episode #");
  }

  if (
    contentRecord.getCellValueAsString("Aspect Ratio") == "16x9" ||
    aspect === "16x9"
  ) {
    aspectLanguage += "_169_";
  } else if (
    contentRecord.getCellValueAsString("Aspect Ratio") == "4x3" ||
    aspect === "4x3"
  ) {
    aspectLanguage += "_43_";
  }
  if (filenameAudio.length == 3) {
    aspectLanguage += filenameAudio + filenameAudio;
  } else {
    aspectLanguage += filenameAudio;
  }
  for (let filenameSubs of subsArray) {
    if (filenameSubs) {
      aspectLanguage += filenameSubs + "SUB";
    }
  }
  if (contentRecord.getCellValueAsString("Version").includes("Edited")) {
    aspectLanguage += "_Ed_";
  } else if (contentRecord.getCellValueAsString("Version") == "Theatrical") {
    aspectLanguage += "_Th_";
  }

  let feature = iata + "_";
  if (contentRecord.getCellValue("Programming") == "Film") {
    feature += contentRecord
      .getCellValueAsString("Title")
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 39 - aspectLanguage.length);
    if (isTrailer) {
      // trailer += feature + "TR" + aspectLanguage + "M4.mpg";
    }
    feature += aspectLanguage + extension;
  } else if (contentRecord.getCellValue("Programming") == "TV") {
    feature +=
      contentRecord
        .getCellValueAsString("Series")
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 41 - aspectLanguage.length) +
      aspectLanguage +
      extension;
  }

  return feature;
};

export default thalesFilename;
