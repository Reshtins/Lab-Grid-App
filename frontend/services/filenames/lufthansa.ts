import { Record } from "@airtable/blocks/models";
import { v4 as uuidv4 } from "uuid";
import {
  ContentLanguageMaps,
  FilenameFunction,
  SystemFilenameConfig,
} from "../../types";
import { getSystemId } from "../util";
import { getDateFromCell } from "../util/datetime";
import { getLookupOrLinkedId } from "../util/fieldParsers";

export const createLsyUuid = () => uuidv4();

const getBasename = (contentRecord: Record) => {
  const type = contentRecord.getCellValueAsString("Programming");
  let title = "";

  if (type === "Film") {
    title = contentRecord
      .getCellValueAsString("Film")
      .replace(/[^a-zA-Z0-9]/g, "");
  } else if (type === "TV") {
    const seriesName = contentRecord
      .getCellValueAsString("Series")
      .replace(/[^a-zA-Z0-9]/g, "");
    const seasonNum = contentRecord
      .getCellValueAsString("Season #")
      .padStart(2, "0");
    const episodeNum = contentRecord
      .getCellValueAsString("Episode #")
      .padStart(2, "0");
    title = `${seriesName}S${seasonNum}Ep${episodeNum}`;
  }
  return `${title}`;
};

const mezzanineName = (
  contentRecord: Record,
  config: SystemFilenameConfig,
  audioLanguages: Record[] | string
) => {
  const { extension = "", isTrailer } = config;
  const langId = getLookupOrLinkedId(contentRecord.getCellValue("Audio 1"));
  const base = getBasename(contentRecord);
  const trailer = isTrailer ? "Trailer" : "";

  let language = "ENG";

  if (langId) {
    if (Array.isArray(audioLanguages)) {
      const found = audioLanguages.find((r) => r.id === langId);

      if (found) {
        language = found.getCellValueAsString("ISO639-2T").toUpperCase();
      }
    } else {
      language = audioLanguages;
    }
  }

  return `${trailer}${base}_${language}${extension}`;
};

const withUuid = (
  contentRecord: Record,
  uuid: string,
  config: SystemFilenameConfig
) => {
  const { isTrailer, extension } = config;

  const { year } = getDateFromCell(
    contentRecord.getCellValue("Theatrical release")
  );
  const iata = contentRecord.getCellValueAsString("IATA");
  const base = getBasename(contentRecord);
  const trailer = isTrailer ? "TR" : "";

  return `${uuid}_${iata}_${trailer}_${base}_${year}${extension}`;
};

const lufthansaFilename: FilenameFunction = (
  contentRecord,
  additionalProps
) => {
  const { config, contentLanguages } = additionalProps;
  const { id } = config;

  // const lab = contentRecord.getCellValueAsString("Lab");

  if (id && id.value) {
    return withUuid(contentRecord, id.value, config);
  } else if (id && id.fieldname) {
    const recordId = contentRecord.getCellValueAsString(id.fieldname);
    if (recordId) return withUuid(contentRecord, recordId, config);
  }
  const audioArray = [...contentLanguages.audio.values()];

  return mezzanineName(contentRecord, config, audioArray);
};

export const lufthansaUuidFilename: FilenameFunction = (
  contentRecord,
  additionalProps
) => {
  const { config } = additionalProps;
  const { id } = config;

  if (id && id.value) {
    return withUuid(contentRecord, id.value, config);
  } else if (id && id.fieldname) {
    const recordId = contentRecord.getCellValueAsString(id.fieldname);
    if (recordId) return withUuid(contentRecord, recordId, config);
  }

  const newId = getSystemId(
    contentRecord,
    config,
    "Lufthansa Systems",
    config.fieldname
  );

  return withUuid(contentRecord, newId, config);
};

export const lufthansaMezzanineFilename: FilenameFunction = (
  contentRecord,
  additionalProps
) => {
  const { config, contentLanguages } = additionalProps;
  const audioArray = [...contentLanguages.audio.values()];
  return mezzanineName(contentRecord, config, audioArray);
};

export const lufthanasaAdditionalFilenames = (
  contentRecord: Record,
  contentLanguages: ContentLanguageMaps,
  option: SystemFilenameConfig["additionalFilenames"]
) => {
  const basename = getBasename(contentRecord);
  const additionalFilenames: any = {};
  const isoKey = "ISO639-2T";

  let addSubs = true;
  let addDubs = true;

  if (typeof option === "object") {
    addDubs = option.dubs;
    addSubs = option.subs;
  }

  if (addDubs) {
    contentLanguages.audio.forEach((langRecord, key) => {
      const keyNumber = parseInt(key);

      if (keyNumber > 1 && keyNumber <= 6 && langRecord) {
        const iso = langRecord.getCellValueAsString(isoKey).toUpperCase();
        const columnName = `Dub Filename ${keyNumber - 1}`;
        additionalFilenames[columnName] = `${basename}_${iso}.mp4`;
      }
    });
  }

  if (addSubs) {
    contentLanguages.subs.forEach((langRecord, key) => {
      const keyNumber = parseInt(key);
      if (langRecord && keyNumber < 3) {
        const iso = langRecord.getCellValueAsString(isoKey).toUpperCase();
        const columnName = `Sub Filename ${key}`;
        additionalFilenames[columnName] = `${basename}_${iso}.vtt`;
      }
    });
  }

  return additionalFilenames;
};

export default lufthansaFilename;
