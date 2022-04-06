import { GridProps, RaveConifigMap, RaveCtrRow } from "../../../types";
import { initialRaveMediaRow } from "../../configs";
import {
  getAudioLanguagesById,
  getFilenameFromField,
  gridMapper,
  isOemMatch,
  recordToHashMap,
} from "../../util";

const createRaveMediaRow = (args: GridProps, config: RaveConifigMap) => {
  const { contentRecords, languageRecords } = args;
  const languageIdLookup = recordToHashMap(languageRecords);

  return contentRecords.reduce((csvRow: RaveCtrRow[], record) => {
    const { audio, subs } = getAudioLanguagesById(record, languageIdLookup);

    const systemRows = config.systems.reduce((rows, systemConfig) => {
      const mappedRow = gridMapper(
        record,
        config.mediaMap,
        initialRaveMediaRow
      );
      const systemRow = { ...mappedRow };

      if (isOemMatch(record, systemConfig)) {
        systemRow["Parent Title"] = getFilenameFromField({
          record,
          fieldname: systemConfig.filenameConfig.fieldname,
        });

        rows.push(systemRow);
      }

      return rows;
    }, []);

    return csvRow;
  }, []);
};
export default createRaveMediaRow;
