import { Record } from "@airtable/blocks/models";

import { parsePacInfo } from "../util/pac";
import { PacMmaRow, SystemConfig } from "../../types";

interface pacSerialNumberProps<CsvRow> {
  contentRecords: Record[];
  airlineSystems: SystemConfig<CsvRow>[];
  chosenCycle: string;
  iata: string;
}

const pacSerialNumbers = <CsvRow>(
  {
    contentRecords,
    airlineSystems,
    chosenCycle,
    iata,
  }: pacSerialNumberProps<CsvRow>,
  loggerCallback: (message: string) => void
) => {
  let maxSerial = 0;

  // Lookup PAC serial number info via Record ID
  // Key: Record ID
  // Value: Existing serial number and array index
  const recordPacLookup = new Map<
    string,
    { serialNumber: number; index: number }
  >();

  // Lookup record ID via PAC serial number
  // Key: Record's PAC serial number
  // Value: Record ID
  const pacNumberLookup = new Map<number, string>();

  for (let index = 0; index < contentRecords.length; index++) {
    const record = contentRecords[index];
    const recordIata = record.getCellValueAsString("IATA");
    const cycleName = record.getCellValueAsString("Cycle Name");
    if (recordIata === iata && cycleName === chosenCycle) {
      const { pacRecordsMap, recordPacNumber } = parsePacInfo(
        record,
        airlineSystems
      );

      if (pacRecordsMap.size > 1) {
        const numbers = Array.from(pacRecordsMap.keys()).join(", ");

        loggerCallback(
          `Multiple PAC serial numbers found in 
          ${record.name}: ${numbers}`
        );
      }

      if (pacNumberLookup.has(recordPacNumber)) {
        const match = pacNumberLookup.get(recordPacNumber);
        const { index: matchIndex } = recordPacLookup.get(match);
        const matchingRecord = contentRecords[matchIndex];

        if (matchingRecord) {
          loggerCallback(
            `Conflict in serial number: ${recordPacNumber} used by 
            ${record.name} === ${matchingRecord.name}`
          );
        }
      }

      if (recordPacNumber > maxSerial) {
        maxSerial = recordPacNumber;
      }
      recordPacLookup.set(record.id, {
        serialNumber: recordPacNumber,
        index,
      });
    }
  }

  return { maxSerial, recordPacLookup: recordPacLookup };
};

export default pacSerialNumbers;
