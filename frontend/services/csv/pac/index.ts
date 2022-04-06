import pacAttributeMapper from "./pacAttributeMapper";
import pacMetadata from "./pacMetadata";
import createPacSystemRow from "./parsePacSystems";
import { CsvBuilder, PacAdditionalMeta, PacMmaRow } from "../../../types";
import { defaultPacRow, pacConfigMap, pacMmaHeaders } from "../../configs";
import { recordToHashMap, getOemSystems, gridMapper } from "../../util";

const createPacMmaGrid: CsvBuilder = (gridProps) => {
  const { contentRecords, iata } = gridProps;

  const pacConfig = pacConfigMap[iata];
  if (!pacConfig) {
    return null;
  }

  const { systemConfigs: systems, columnMap, meta, attributes } = pacConfig;

  const pacGridRows: PacMmaRow[] = [];
  let rowNum = 1;
  const { pacDistributorRecords = [] } = gridProps;

  const pacDistributorMap = recordToHashMap(pacDistributorRecords, "Name");

  const csvItemCount = contentRecords.reduce((count, record) => {
    const recordIata = record.getCellValueAsString("IATA");
    const programmingType = record.getCellValueAsString("Programming");

    if (recordIata !== iata) return count;
    const distributor = record.getCellValueAsString("Distributor");

    const row = gridMapper(record, columnMap, defaultPacRow);
    row.Distributor = pacDistributorMap.has(distributor)
      ? pacDistributorMap.get(distributor).getCellValueAsString("PAC MMA")
      : "";

    const rowAttributes = pacAttributeMapper({
      record,
      row,
      attributes,
    });

    Object.assign(row, rowAttributes);

    const oemSystems = getOemSystems(record);
    const systemMeta: PacAdditionalMeta[] = meta[programmingType.toLowerCase()];

    systems.map((rowConfig) => {
      const systemRow = createPacSystemRow({
        record,
        rowConfig,
        oemSystems,
        programmingType,
        row,
      });

      if (systemRow && systemRow !== null) {
        systemMeta.map((language) => {
          const csvRow = pacMetadata({
            record,
            rowNum: rowNum++,
            metadata: language,
            systemRow: { ...systemRow },
            rowConfig,
          });
          pacGridRows.push(csvRow);
          count++;
        });
      }
    });

    return count;
  }, 0);

  return {
    csvItemCount,
    csvOutput: pacGridRows,
    headers: pacMmaHeaders,
    listToUpdate: [],
  };
};

export default createPacMmaGrid;
