import pacSerialNumbers from "../../formatters/pacSerialNumbers";

import {
  CsvBuilder,
  LabGridFilenameArgs,
  LabGridRow,
  RecordUpdateObject,
} from "../../../types";
import { labConfigMap, defaultLabGrid } from "../../configs";
import defaultLabHeaders from "../../configs/labgrid/headers";
import { recordToHashMap, getAudioLanguagesById, gridMapper } from "../../util";
import createLabTvRow from "./createLabTvRow";
import createLabGridRow from "./createLabGridRow";

/**
 * LAB GRID GENERATOR
 */

/**
 * Create a lab grid and update programming table with filenames if they are empty
 *
 * @param gridProps
 * @param loggerCallback callback for loggin purposes
 * @returns
 */
const createLabGrid: CsvBuilder = (
  gridProps,
  loggerCallback: (message: string) => void
) => {
  const {
    airline,
    iata,
    pacFilePrefix,
    cycleName: chosenCycle,
    contentRecords,
    languageRecords,
    overwrite = false,
    programmingType,
  } = gridProps;

  const labGridRows: LabGridRow[] = [];
  const labConfig = labConfigMap[iata];
  const languageIdLookup = recordToHashMap(languageRecords);

  if (!labConfig) {
    return null;
  }

  const headers = labConfig.csvHeader ?? defaultLabHeaders;

  let currentPacSerialNumber = 1;

  // Get existing PAC serial numbers
  const { maxSerial, recordPacLookup } = pacSerialNumbers(
    {
      contentRecords,
      airlineSystems: labConfig.systemConfigs,
      chosenCycle,
      iata,
    },
    loggerCallback
  );

  const { columnMap } = labConfig;

  if (overwrite) {
    loggerCallback("OVERWRITING CURRENT FILENAMES");
  } else {
    currentPacSerialNumber = maxSerial + 1;
    loggerCallback(`Total existing PAC files in cycle: ${maxSerial}`);
    loggerCallback(`PAC filename start index: ${currentPacSerialNumber}`);
  }

  const listToUpdate: RecordUpdateObject[] = [];

  let fileAdd = 0;
  let labRowIndex = 1;
  let hasFilenames = false;
  // const headerSet = new Set<string>(headers);

  for (let index = 0; index < contentRecords.length; index++) {
    const record = contentRecords[index];
    const recordIata = record.getCellValueAsString("IATA");
    const cycleName = record.getCellValueAsString("Cycle Name");
    const contentLanguages = getAudioLanguagesById(record, languageIdLookup);

    if (recordIata !== iata || cycleName !== chosenCycle) {
      continue;
    }

    let pacSerialNumber = currentPacSerialNumber;

    if (
      !overwrite &&
      recordPacLookup.has(record.id) &&
      recordPacLookup.get(record.id).serialNumber > 0
    ) {
      // If record already has a PAC serial number assinged
      pacSerialNumber = recordPacLookup.get(record.id).serialNumber;
    }

    const recordToUpdate: RecordUpdateObject = {
      id: record.id,
      fields: {},
    };

    const mappedRow = gridMapper(record, columnMap, defaultLabGrid);

    mappedRow["Airline"] = airline;
    const LabFilenameArgs: LabGridFilenameArgs = {
      rowNum: labRowIndex,
      record,
      pacFilePrefix,
      pacSerialNumber,
      contentLanguages,
      columns: mappedRow,
      overwrite,
      config: null,
    };

    const systemRows = labConfig.systemConfigs.reduce(
      (addedRows: LabGridRow[], systemConfig) => {
        const { isValid, row, fieldsToUpdate } = createLabGridRow({
          ...LabFilenameArgs,
          config: systemConfig,
        });

        if (isValid) {
          hasFilenames = true;
          if (programmingType === "Film") {
            labRowIndex++;
            addedRows.push(row);
          }
          if (fieldsToUpdate) {
            recordToUpdate.fields = {
              ...recordToUpdate.fields,
              ...fieldsToUpdate,
            };
          }
        }

        return addedRows;
      },
      []
    );

    if (programmingType === "Film") {
      fileAdd += systemRows.length;
      labGridRows.push(...systemRows);
    } else {
      labGridRows.push(createLabTvRow(LabFilenameArgs));
      labRowIndex++;
    }

    if (hasFilenames) {
      currentPacSerialNumber++;
    }

    if (hasFilenames || overwrite) {
      listToUpdate.push(recordToUpdate);
    }
  }

  loggerCallback(`Added ${fileAdd} files`);

  return {
    csvItemCount: labGridRows.length,
    listToUpdate,
    csvOutput: labGridRows,
    headers,
  };
};

export default createLabGrid;
