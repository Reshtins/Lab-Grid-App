import { Record } from "@airtable/blocks/models";
import {
  PROGRAMMING_LINK_CELLS,
  FILM_FIELDS,
  TV_FIELDS,
} from "../../constants/fields";
import {
  AudioField,
  FormatterFunction,
  LinkedCellValue,
  ProgrammingType,
} from "../../types";

export const getAudioFieldname = (
  num: number = 1,
  field: AudioField = "audio"
) => {
  switch (field) {
    case "sub":
      return num !== 5 ? `Sub/CC ${num}` : null;
    case "subType":
      return num !== 5 ? `Subtitle ${num} Type` : null;
    case "audioType":
      return num !== 1 ? `Audio ${num} Type` : null;
    case "audio":
      return `Audio ${num}`;
    default:
      return null;
  }
};

/***
 * Used for getting the list of fields from the table for recordQuery
 */
const addToCommonFields = () => {
  const additionalFields: string[] = [];
  for (let i = 1; i <= 10; i++) {
    additionalFields.push(`Audio ${i}`);
    if (i != 1) {
      additionalFields.push(`Audio ${i} Type`);
    }

    if (i <= 5) {
      additionalFields.push(`Sub/CC ${i}`);
      additionalFields.push(`Subtitle ${i} Type`);
    }

    if (i <= 10) {
      additionalFields.push(`Filename ${i}`);
    }

    if (i <= 3) {
      additionalFields.push(`OEM System ${i}`);
      additionalFields.push(`OEM End ${i}`);
    }
  }

  return additionalFields;
};

/**
 * Retrieve the fieldnames for the programming type
 * @param programmingType
 * @returns
 */
export const getProgrammingFields = (programmingType: ProgrammingType | "") => {
  const additionalFields = addToCommonFields();
  switch (programmingType) {
    case "Film":
      return {
        linkedField: PROGRAMMING_LINK_CELLS.films,
        programmingFields: [...FILM_FIELDS, ...additionalFields],
      };
    case "TV":
      return {
        linkedField: PROGRAMMING_LINK_CELLS.tv,
        programmingFields: [...TV_FIELDS, ...additionalFields],
      };
    default:
      return {
        linkedField: null,
        programmingFields: null,
      };
  }
};

/**
 * Get the first linked record ID in a linked record field
 * @param linkedRecordField The field from a record
 * @returns Linked record field ID
 */
export const getLookupOrLinkedId = (linkedRecordField: any) => {
  let id = "";
  if (Array.isArray(linkedRecordField)) {
    const first = linkedRecordField[0];
    if (first.id) id = first.id;
    if (first.value) id = first.value.id;
  }

  return id;
};

/**
 * Get the OEM systems in the record
 * @param contentRecord The record
 */
export const getOemSystems = (contentRecord: Record) => {
  const recordOemSystems: string[] = [];
  const recordSystemMap = new Map<string, string>();

  for (let oemNumber = 1; oemNumber < 4; oemNumber++) {
    const fieldname = `OEM System ${oemNumber}`;
    const fieldvalue = contentRecord.getCellValueAsString(fieldname);
    if (fieldvalue) {
      recordSystemMap.set(fieldname, fieldvalue);
      recordOemSystems.push(fieldvalue);
    }
  }

  return {
    recordOems: recordOemSystems.join(", "),
    recordSystemMap,
  };
};

export const getCellValueByIndex = (
  record: Record,
  fieldname: string,
  index = 0
) => {
  const linkedRecord = record.getCellValue(fieldname) as LinkedCellValue[];
  if (linkedRecord.length > 0 && linkedRecord[index]) {
    return linkedRecord[index].name;
  }

  return "";
};
export const createLanguageMap = (languageRecords: Record[]) => {
  const languageIdLookup = new Map<string, Record>();

  languageRecords.map((cur) => {
    if (cur) languageIdLookup.set(cur.id, cur);
  });

  return languageIdLookup;
};

/**
 * Get all "Audio #" and "Sub/CC #" fields in a record
 * @param contentRecord
 * @param languageIdMap
 * @param maxAudioCount
 * @returns
 */
export const getAudioLanguagesById = (
  contentRecord: Record,
  languageIdMap: Map<string, Record>,
  maxAudioCount = 10,
  maxSubCount = 5
) => {
  const audio = new Map<string, Record>();
  const subs = new Map<string, Record>();
  const highest = Math.max(maxSubCount, maxAudioCount);

  for (let index = 1; index <= highest; index++) {
    if (index <= maxAudioCount) {
      const audioFieldname = `Audio ${index}`;
      const audioLanguageRecord = contentRecord.getCellValue(audioFieldname);

      const audioId = getLookupOrLinkedId(audioLanguageRecord);

      if (audioId && languageIdMap.has(audioId)) {
        const audioIso = languageIdMap.get(audioId);
        audio.set(`${index}`, audioIso);
      } else {
        audio.set(`${index}`, null);
      }
    }

    if (index <= maxSubCount) {
      const subFieldName = `Sub/CC ${index}`;
      const subLanguageRecord = contentRecord.getCellValue(subFieldName);
      const subId = getLookupOrLinkedId(subLanguageRecord);

      if (subId && languageIdMap.has(subId) && languageIdMap.get(subId)) {
        subs.set(`${index}`, languageIdMap.get(subId));
      } else {
        subs.set(`${index}`, null);
      }
    }
  }

  return { audio, subs };
};

export const getFilenameFromField: FormatterFunction<null> = ({
  record,
  fieldname,
}) => {
  if (Array.isArray(fieldname)) {
    fieldname = fieldname[0];
  }

  return fieldname ? record.getCellValueAsString(fieldname).substring(10) : " ";
};

/**
 *
 * @param contentRecord
 * @param languageNameMap
 * @param maxAudioCount
 * @returns
 */
export const getAudioLanguagesByName = (
  contentRecord: Record,
  languageNameMap: Map<string, Record>,
  maxAudioCount: number = 10
) => {
  const audio = new Map<string, string>();

  for (let index = 1; index <= maxAudioCount; index++) {
    const cellName = `Audio ${index}`;
    const languageName = contentRecord
      .getCellValueAsString(cellName)
      .toLowerCase();

    if (languageName && languageNameMap[languageName]) {
      const found = languageNameMap[languageName];
      const foundIso = found.getCellValueAsString("ISO639-1");
      audio.set(`${index}`, foundIso ?? null);
    } else {
      audio.set(`${index}`, null);
    }
  }

  return audio;
};

export const getCellLengthFormula: FormatterFunction<{
  column: string;
}> = ({ row, props }) => `=LEN(${props.column}${row})`;

export const getProjectedCellFormula: FormatterFunction<{
  column: string;
  end: string;
  lengthCol: string;
}> = ({ row, props: { end, column, lengthCol } }) =>
  `=((COUNTA(${column}${row}:${end}${row})*128+900)*${lengthCol}5*60*1024)/(8*1000*1000)`;
