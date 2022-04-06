import { CsvBuilder, ImmflyRow } from "../../../types";
import { immflyHeader } from "../../configs";
import { defaultImmflyRow } from "../../configs/immfly/columns";
import { immflyConfig } from "../../configs/immfly/config";

import {
  findOemNumber,
  getAudioLanguagesById,
  getDateByFormat,
  getFilenameFromField,
  getOemSystems,
  recordToHashMap,
  gridMapper,
} from "../../util";

const createImmflyGrid: CsvBuilder = (gridArgs, logger) => {
  const { iata, contentRecords, languageRecords } = gridArgs;

  const config = immflyConfig[iata];
  const languageIdLookup = recordToHashMap(languageRecords);
  let nid = 1;

  const csvOutput = contentRecords.reduce((rows: ImmflyRow[], record) => {
    const { recordOems, recordSystemMap } = getOemSystems(record);
    const contentLanguages = getAudioLanguagesById(record, languageIdLookup);

    if (recordOems.includes("Immfly")) {
      const systemRows = config.systemConfigs.map((system) => {
        const oemNumber = findOemNumber(recordSystemMap, /Immfly/);
        const mappedRow = gridMapper(
          record,
          config.columnMap,
          { ...defaultImmflyRow },
          system
        );

        mappedRow.ID = `${nid}`;
        mappedRow.end_date = getDateByFormat({
          record,
          fieldname: `OEM End ${oemNumber}`,
          props: { format: "DD/MM/YYYY" },
        });

        mappedRow.languages = [...contentLanguages.audio.values()]
          .reduce((audio: string[], audioRecord) => {
            if (audioRecord) audio.push(audioRecord.name);
            return audio;
          }, [])
          .join(", ");

        const dynSubs: string[] = [];
        const embSubs: string[] = [];
        [...contentLanguages.subs.values()].map((audioRecord, index) => {
          if (audioRecord) {
            const subType = record.getCellValueAsString(
              `Subtitle ${index + 1} Type`
            );

            if (subType === "Embedded") {
              embSubs.push(audioRecord.name);
            } else if (
              subType === "Dynamic Sub" ||
              subType === "Closed Caption"
            ) {
              dynSubs.push(audioRecord.name);
            }
          }
        });

        mappedRow.subtitles = dynSubs.join(", ");
        mappedRow.embedded_subtitles = embSubs.join(", ");

        const { languages } = system;
        const filename = getFilenameFromField({
          record,
          fieldname: system.filenameConfig.fieldname,
        });
        mappedRow.filename = filename;

        return languages.map((language) =>
          gridMapper(record, language, { ...mappedRow }, system)
        );
      }, []);

      rows.push(...systemRows.flat());
      nid++;
    }

    return rows;
  }, []);

  return {
    csvItemCount: csvOutput.length,
    csvOutput,
    headers: immflyHeader,
    listToUpdate: null,
  };
};

export default createImmflyGrid;
