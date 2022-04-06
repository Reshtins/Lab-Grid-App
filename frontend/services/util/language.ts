import { Record } from "@airtable/blocks/models";
import { ContentLanguageMaps, FormatterFunction } from "../../types";
import { flattenCellAsString } from "./";

export const getSubtitleAndType: FormatterFunction<{
  subtitleType: string;
}> = ({ record, fieldname, props }) => {
  const sub = flattenCellAsString({
    record,
    fieldname,
  });

  return `${sub} ${record.getCellValueAsString(props.subtitleType)}`;
};

export const getIsoLanguage = (
  contentRecord: Record,
  fieldname: string,
  contentLanguages: ContentLanguageMaps,
  isoType = "ISO639-2T"
) => {
  const languagesField = contentRecord.getCellValueAsString(fieldname);
  let language = "";

  if (contentLanguages.audio) {
    contentLanguages.audio.forEach((r) => {
      if (languagesField === r.name) {
        language = r.getCellValueAsString(isoType);
      }
    });
  }

  return language;
};

export const getShortSubtitleType: FormatterFunction<{
  subtitleType: string;
}> = ({ record, fieldname, props }) => {
  const { subtitleType } = props;

  const subType = record.getCellValueAsString(subtitleType);
  let shortSubType = "";
  switch (subType) {
    case "Embedded":
      shortSubType += "EMB";
      break;
    case "Closed Caption":
      shortSubType += "CC";
      break;
    case "Dynamic Sub":
      shortSubType += "DYN";
      break;
  }
  const lang = flattenCellAsString({
    record,
    fieldname,
    props: { delimmiter: "" },
  });

  return `${lang} ${shortSubType}`;
};
