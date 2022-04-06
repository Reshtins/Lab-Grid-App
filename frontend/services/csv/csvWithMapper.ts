import {
  AirlineCsvMap,
  CsvFunctionOutput,
  GridProps,
  MetadataType,
  RecordUpdateObject,
} from "../../types";
import pacSerialNumbers from "../formatters/pacSerialNumbers";
import {
  getAudioLanguagesById,
  recordToHashMap,
  systemGridMapper,
} from "../util";

const csvWithMapper = <CsvRow>(
  args: GridProps,
  loggerCallback: (message: string) => void,
  airlineCsvMap: AirlineCsvMap<CsvRow>
): CsvFunctionOutput | null => {
  const {
    iata,
    contentRecords,
    cycleName,
    languageRecords,
    metadataType,
    overwrite = false,
    pacFilePrefix,
    programmingType,
  } = args;

  let currentPacSerialNumber = 1;

  if (!airlineCsvMap[iata]) {
    return null;
  }

  const config = airlineCsvMap[iata];
  const languageIdLookup = recordToHashMap(languageRecords);

  // Get existing PAC serial numbers
  const { maxSerial, recordPacLookup } = pacSerialNumbers(
    {
      contentRecords,
      airlineSystems: config.systemConfigs,
      chosenCycle: cycleName,
      iata,
    },
    loggerCallback
  );

  const { columnMap, systemConfigs, defaultRow, csvHeader, meta } = config;
  const isLab = metadataType === MetadataType.Lab;

  if (isLab) {
    if (overwrite) {
      loggerCallback("OVERWRITING CURRENT FILENAMES");
    } else {
      currentPacSerialNumber = maxSerial + 1;
      loggerCallback(`Total existing PAC files in cycle: ${maxSerial}`);
      loggerCallback(`PAC filename start index: ${currentPacSerialNumber}`);
    }
  }

  const listToUpdate: RecordUpdateObject[] = [];
  let rowNumber = 1;

  const csvOutput = contentRecords.reduce((csvRows: CsvRow[], record) => {
    const contentLanguages = getAudioLanguagesById(record, languageIdLookup);

    const recordIata = record.getCellValueAsString("IATA");
    const recordType = record.getCellValueAsString("Programming");

    if (recordIata !== iata || programmingType !== recordType) {
      return csvRows;
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

    const { systemRows, recordToUpdate, hasFieldsToUpdate } = systemGridMapper({
      record,
      columnMap,
      systemConfigs,
      defaultRow,
      rowNum: rowNumber,
      pacSerialNumber,
      isLab,
      overwrite,
      pacFilePrefix,
      contentLanguages,
      meta,
    });

    if (hasFieldsToUpdate) {
      listToUpdate.push(recordToUpdate);
    }

    if (systemRows) {
      csvRows.push(...systemRows);
      rowNumber += systemRows.length;
    }

    return csvRows;
  }, []);

  return {
    csvItemCount: csvOutput.length,
    csvOutput,
    headers: csvHeader,
    listToUpdate: listToUpdate,
  };
};

export default csvWithMapper;
