import { Record } from "@airtable/blocks/models";
import { PacMmaRow, SystemConfig } from "../../types";

/**
 * Get the PAC serial numbers from the film/tv programming tables
 *
 * @param contentRecord
 * @param airlineSystems
 * @returns
 */
export const parsePacInfo = <CsvRow>(
  contentRecord: Record,
  airlineSystems: SystemConfig<CsvRow>[]
) => {
  let recordPacNumber = 0;
  const pacRecordsMap = new Map<number, string>();

  airlineSystems.map((system) => {
    if (system.vendor === "Panasonic" && system.filenameConfig.fieldname) {
      const filename = contentRecord.getCellValueAsString(
        system.filenameConfig.fieldname
      );
      if (filename) {
        const num = getPacSerialNumberFromString(filename);
        pacRecordsMap.set(num, contentRecord.id);
        recordPacNumber = num;
      }
    }
  });

  return {
    recordPacNumber,
    pacRecordsMap,
  };
};

export const getPacSerialNumberFromString = (filename: string) => {
  const serialNumIndex = 18;
  const serialNumEnd = serialNumIndex + 4;

  return parseInt(filename.substring(serialNumIndex, serialNumEnd));
};
