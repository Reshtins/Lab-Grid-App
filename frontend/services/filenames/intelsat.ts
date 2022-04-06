import { Record } from "@airtable/blocks/models";
import { FilenameFunction } from "../../types";
import { getDateByFormat } from "../util";

const intelsatFilename: FilenameFunction = (contentRecord, additionalProps) => {
  const { contentLanguages, config } = additionalProps;
  const { extension = ".mp4" } = config;
  const date = getDateByFormat({
    record: contentRecord,
    fieldname: "Cycle Start",
    props: { format: "MMYY" },
  });
  const iata = contentRecord.getCellValueAsString("IATA");
  let filename = `${iata}${date}`;

  const programmingType = contentRecord.getCellValue("Programming");

  const audio =
    typeof contentLanguages.audio === "string"
      ? contentLanguages.audio
      : getAudio(contentLanguages.audio);

  const titleRegex = /[^a-zA-Z0-9]/g;

  if (programmingType === "Film") {
    const title = contentRecord
      .getCellValueAsString("Title")
      .replace(titleRegex, "");
    filename += `_${title}`;
  } else if (programmingType === "TV") {
    const season = contentRecord
      .getCellValueAsString("Season #")
      .padStart(2, "0");
    const episode = contentRecord
      .getCellValueAsString("Episode #")
      .padStart(2, "0");

    const series = contentRecord
      .getCellValueAsString("Series")
      .replace(titleRegex, "");

    filename += `${series}_S${season}E${episode}`;
  }

  return `${filename}_${audio}${extension}`;
};

const getAudio = (audio: Map<string, Record>) =>
  [...audio.values()]
    .reduce((list: string[], record) => {
      if (record) {
        list.push(record.getCellValueAsString("ISO639-2T"));
      }
      return list;
    }, [])
    .join("")
    .toUpperCase();

export default intelsatFilename;
