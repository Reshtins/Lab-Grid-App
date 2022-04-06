import { Record } from "@airtable/blocks/models";
import { FilenameFunction } from "../../types";
import { getShortDate } from "../util/datetime";

export const createWowFilename: FilenameFunction = (
  record,
  additionalProps,
) => {
  const { contentLanguages, config } = additionalProps;
  let filename = getWowBasename(record);

  const { filetype, isDub } = config;

  let audio = "";

  contentLanguages.audio.forEach((val, key) => {
    console.log(key, val);
  });

  if (filetype == "image") {
    filename += `-${audio}.jpg`;
  } else if (filetype == "video") {
    if (audio && isDub) {
      filename += `-DUB_${audio}.mp4`;
    } else if (audio) {
      filename += `_${audio}.mp4`;
    } else {
      filename += `.mp4`;
    }
  } else if (filetype == "subtitle") {
    filename += `-SUB_${audio}.vtt`;
  } else if (filetype === "lab") {
    filename += `-${audio}.mp4`;
  }

  return filename;
};

const getWowBasename = (record: Record) => {
  const iata = record.getCellValueAsString("IATA");
  const date = getShortDate(record.getCellValue("Cycle Start"));
  let filename = `${iata}_${date}-W-D-`;

  if (record.getCellValue("Programming") == "Film") {
    filename += record
      .getCellValueAsString("Film")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/ /g, "_");
  } else if (record.getCellValue("Programming") == "TV") {
    const seriesName = record
      .getCellValueAsString("Series")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/ /g, "_");
    const seasonNum = record.getCellValueAsString("Season #");
    const episodeNum = record.getCellValueAsString("Episode #");

    filename += `${seriesName}_S${seasonNum}_E${episodeNum}`;
  }

  return filename;
};

export const getAdditionalBlueboxFilenames: FilenameFunction = (
  record: Record,
  args
) => {
  const additionalFilenames: any = {};
  const basename = getWowBasename(record);
  const addedColumns = [];
  const { contentLanguages } = args;

  const { audio, subs } = contentLanguages;

  const audioArray = [...audio.values()];

  audio.forEach((langRecord, key) => {
    const keyNumber = parseInt(key);
    if (keyNumber > 1 && keyNumber <= 6 && langRecord) {
      const iso = langRecord.getCellValueAsString("ISO639-1");
      const columnName = `Dub Filename ${keyNumber - 1}`;
      additionalFilenames[columnName] = `${basename}-DUB_${iso}.mp4`;
      addedColumns.push(columnName);
    }
  });

  contentLanguages.subs.forEach((langRecord, key) => {
    const keyNumber = parseInt(key);
    if (langRecord && keyNumber < 3) {
      const iso = langRecord.getCellValueAsString("ISO639-1");
      const columnName = `Sub Filename ${key}`;
      additionalFilenames[columnName] = `${basename}-SUB_${iso}.vtt`;
      addedColumns.push(columnName);
    }
  });

  return additionalFilenames;
};

export default createWowFilename;
