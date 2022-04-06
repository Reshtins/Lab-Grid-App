import { Record } from "@airtable/blocks/models";
import { FilenameFunction } from "../../types";
import { getDateByFormat } from "../util/datetime";

const isoName = "ISO639-1";
const languagesCallback = (r: Record) =>
  r ? r.getCellValueAsString(isoName) : "";

// icao, contentRecord, audioArray, subsArray
const ravFilename: FilenameFunction = (contentRecord, additionalProps) => {
  const icao = contentRecord.getCellValueAsString("ICAO");
  const {
    config,
    contentLanguages: { audio, subs },
  } = additionalProps;
  const { isTrailer } = config;

  // const cycleStartDate = contentRecord.getCellValueAsString("Cycle Start");
  const date = getDateByFormat({
    record: contentRecord,
    fieldname: "Cycle Start",
    props: {
      format: "MMYY",
    },
  });

  const audioLanguages = [...audio.values()];
  const subLanguages = [...subs.values()];

  let filename = `${icao}_${date}_`;
  const filenameAudio = Array.isArray(audioLanguages)
    ? audioLanguages.map(languagesCallback).join("")
    : "";
  const filenameSubs = subLanguages.map(languagesCallback).join("S");

  if (contentRecord.getCellValue("Programming") == "Film") {
    filename += contentRecord
      .getCellValueAsString("Title")
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 35 - (filenameAudio + filenameSubs).length);
  } else if (contentRecord.getCellValue("Programming") == "TV") {
    let seasonEp =
      "_S" +
      contentRecord.getCellValueAsString("Season #") +
      "E" +
      contentRecord.getCellValueAsString("Episode #");
    filename +=
      contentRecord
        .getCellValueAsString("Series")
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 35 - (filenameAudio + filenameSubs + seasonEp).length) +
      seasonEp;
  }

  if (isTrailer) {
    filename += "_TR";
  } else {
    filename += "_" + filenameAudio;

    if (filenameSubs) {
      filename += filenameSubs + "S";
    }
  }

  filename += ".mp4";
  return filename;
};

export default ravFilename;
