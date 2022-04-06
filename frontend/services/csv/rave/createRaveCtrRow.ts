import { initialRaveCtrRow, raveCtrHeader } from "../../configs";
import {
  getAudioLanguagesById,
  getFilenameFromField,
  getOemSystems,
  gridMapper,
  isOemMatch,
  recordToHashMap,
} from "../../util";
import { GridProps, RaveConifigMap, RaveCtrRow } from "../../../types";

const createCtrRow = (args: GridProps, config: RaveConifigMap) => {
  const { contentRecords, languageRecords } = args;
  const languageIdLookup = recordToHashMap(languageRecords);

  return contentRecords.reduce((csvRow: RaveCtrRow[], record) => {
    const mappedRow = gridMapper(record, config.ctrMap, initialRaveCtrRow);
    const { audio, subs } = getAudioLanguagesById(record, languageIdLookup);

    audio.forEach((audioRecord, key) => {
      if (audioRecord) {
        const label = `Audio ${key}`;
        const value = audioRecord.getCellValueAsString("Thales Legacy");
        mappedRow.Audio = {
          ...mappedRow.Audio,
          [label]: { value, label },
        };
      }
    });

    subs.forEach((sub, key) => {
      if (sub) {
        const iso = sub.getCellValueAsString("ISO639-2T");
        const headerKey = `Sub BurnIn ${key}`;
        mappedRow[headerKey] = iso;
      }
    });

    const systemRows = config.systems.reduce((list, systemConfig) => {
      if (isOemMatch(record, systemConfig)) {
        const systemRow = { ...mappedRow };

        systemRow.Filename = getFilenameFromField({
          record,
          fieldname: systemConfig.filenameConfig.fieldname,
        });

        list.push(systemRow);
      }
      return list;
    }, []);
    csvRow.push(...systemRows);

    return csvRow;
  }, []);
};
export default createCtrRow;
