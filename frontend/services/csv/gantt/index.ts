import { ganttConfigMap, ganttHeaders } from "../../configs";
import {
  createLanguageMap,
  getOemSystems,
  execFieldSearch,
  getFilenameFromField,
  getAudioLanguagesById,
} from "../../util";
import { CsvBuilder, GanttChartFiles, GanttRow } from "../../../types";

const createGanttChart: CsvBuilder = (cycleData, logger) => {
  const { contentRecords, iata, languageRecords } = cycleData;
  let totalFilenames = 0;

  const header = ganttHeaders[iata];
  const airlineConfig = ganttConfigMap[iata];
  const languageMap = createLanguageMap(languageRecords);

  if (header && airlineConfig) {
    const csvOutput = contentRecords.reduce((row, record) => {
      const programmingType = record.getCellValueAsString("Programming");
      const commonFieldsConfig =
        programmingType === "Film"
          ? airlineConfig.commonFields.films
          : airlineConfig.commonFields.tv;

      const oemSystems = getOemSystems(record);

      let filenameCount = 0;
      const fileConfig: GanttChartFiles[] = [];

      if (Array.isArray(airlineConfig.files)) {
        fileConfig.push(...airlineConfig.files);
      } else if (airlineConfig.files[programmingType]) {
        fileConfig.push(...airlineConfig.files[programmingType]);
      }

      const filenameFields = fileConfig.reduce(
        (field: Partial<GanttRow>, fileInfo) => {
          let filename = "";
          if (fileInfo.search) {
            const result = execFieldSearch(record, fileInfo.search);

            if (result) {
              filename = getFilenameFromField({
                record,
                fieldname: fileInfo.filenameField,
              });
            }
          } else if (fileInfo.filenameField) {
            filename = getFilenameFromField({
              record,
              fieldname: fileInfo.filenameField,
            });
          }

          if (!!filename) {
            filenameCount++;
            field[fileInfo.label] = filename;
          }

          return field;
        },
        {}
      );

      const isValid = oemSystems.recordOems.length > 0 && filenameCount > 0;
      totalFilenames += filenameCount;

      if (isValid) {
        const commonFields = Object.entries(commonFieldsConfig).reduce(
          (field: Partial<GanttRow>, [columnName, search]) => {
            let value = "";
            if (search.value) {
              value = search.value;
            } else if (search.fieldname) {
              value = record.getCellValueAsString(search.fieldname);
            } else {
              value = execFieldSearch(record, search);
            }

            field[columnName] = value;
            return field;
          },
          {}
        );

        const { audio, subs } = getAudioLanguagesById(record, languageMap);

        const languageFields = airlineConfig.languages.reduce(
          (field: Partial<GanttRow>, language) => {
            const { columnName, value: fieldname } = language;

            let value = "";

            if (typeof fieldname === "string" && audio.get(fieldname)) {
              value = audio.get(fieldname).getCellValueAsString("ISO639-2T");
              field[columnName] = value.toUpperCase();
            }

            return field;
          },
          {}
        );

        const subFields = airlineConfig.subs.reduce(
          (field: Partial<GanttRow>, language) => {
            const { columnName, value: fieldnum } = language;
            const sub = `${fieldnum}`;
            const typeField = `Subtitle ${sub} Type`;
            const subType = record.getCellValueAsString(typeField);

            let type = "";
            let value = "";

            switch (subType) {
              case "Embedded":
                type = "EMB";
                break;
              case "Closed Caption":
                type = "CC";
                break;
              case "Dynamic Sub":
                type = "DYN";
                break;
            }

            if (subs && typeof sub === "string" && subs.get(sub)) {
              const iso = subs
                .get(sub)
                .getCellValueAsString("ISO639-2T")
                .toUpperCase();
              value = `${iso} ${type}`;
            }

            field[columnName] = value.trim();

            return field;
          },
          {}
        );

        row.push({
          ...commonFields,
          ...languageFields,
          ...subFields,
          ...filenameFields,
        });
      }
      return row;
    }, []);

    if (totalFilenames === 0) {
      logger(
        "[WARNING] No filenames have been found in the cycle, generate filenames by selecting the create lab grid option"
      );
    }

    return {
      csvItemCount: csvOutput.length,
      csvOutput: csvOutput,
      headers: header,
      listToUpdate: null,
    };
  }
};

export default createGanttChart;
