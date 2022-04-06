import { FieldInfo } from "json2csv";
import { CsvFieldMap, CsvMapCreator, HeaderParserFunction } from "../../types";
import { getAudioFieldname } from "./fieldParsers";

/**
 *
 * @param rootName The object property is meant to be
 * @param csvHeaderName What will appear
 * @param subFields
 * @param max the amount of times the header will repeat
 * @returns
 */
export const createSubfields: HeaderParserFunction = (
  rootName,
  csvHeaderName,
  subFields,
  max = 10
) => {
  const fields: FieldInfo<string>[] = [];

  for (let index = 1; index <= max; index++) {
    fields.push(
      ...subFields.map((label) => {
        let value = `${rootName}.${csvHeaderName} ${index}.`;
        let csvField = "";

        if (typeof label !== "string") {
          csvField = label.csvField;
          if (label.addNumber) {
            csvField += ` ${index}`;
          }
          value += `${label.value}`;
        } else {
          csvField = label;
          value += label;
        }

        return {
          label: csvField,
          value,
          default: "",
        };
      })
    );
  }

  return fields;
};

/**
 *
 * @param args
 * @returns
 */
export const createSubkeyFieldsearch = <CsvRow>(
  args: CsvMapCreator<CsvRow>
) => {
  const {
    root: csvColumnName,
    subKeyMap,
    subfieldPrefix = csvColumnName as string,
    audioFieldsearch = "audio",
    rootValue,
  } = args;
  const fieldMaps: CsvFieldMap<CsvRow>[] = [];

  const { start = 1, limit = audioFieldsearch === "audio" ? 10 : 5 } = args;

  for (let i = start; i <= limit; i++) {
    const subfieldname = `${subfieldPrefix} ${i}`;
    const rootPixlField = getAudioFieldname(i, audioFieldsearch);

    const subfieldMaps = subKeyMap.reduce((acc, subfield) => {
      const { rootFieldSearch = [] } = args;
      const { name, addToIndex, audioField, map, searchValue } = subfield;

      let subkeyFieldname = rootPixlField;
      let subkeyValue = searchValue;

      if (addToIndex != undefined) {
        subkeyValue = `${i + addToIndex}`;
      } else if (audioField !== undefined) {
        subkeyFieldname = getAudioFieldname(i, audioField);
      }

      const list = map?.fieldsearch ?? rootFieldSearch;

      const returnValue: CsvFieldMap<CsvRow> = {
        csvColumnName,
        subKey: [subfieldname, name],
      };

      if (rootValue !== undefined) {
        returnValue.value = rootValue;
      }
      const fieldsearch = list.map((f) => {
        if (subkeyFieldname) {
          f = { ...f, fieldname: subkeyFieldname };
        }

        if (subkeyValue) {
          f = { ...f, value: subkeyValue };
        }
        return f;
      });

      if (fieldsearch.length) {
        returnValue.fieldsearch = fieldsearch;
      }

      if (returnValue) {
        acc.push(returnValue);
      }
      return acc;
    }, []);

    if (subfieldMaps.length > 0) {
      fieldMaps.push(...subfieldMaps);
    }
  }

  return fieldMaps;
};
