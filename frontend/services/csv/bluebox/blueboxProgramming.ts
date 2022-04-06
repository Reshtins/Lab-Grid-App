import {
  blueboxConfig,
  defaultBlueboxProgramming,
  blueboxProgrammingSubfields,
  blueboxProgrammingHeaders,
} from "../../configs";
import createWowFilename from "../../filenames/bluebox";
import {
  recordToHashMap,
  getOemSystems,
  getAudioLanguagesById,
  getFilenameFromField,
} from "../../util";
import { CsvBuilder } from "../../../types";

const blueboxProgramming: CsvBuilder = (args) => {
  const { contentRecords, languageRecords, iata } = args;
  const labConfig = blueboxConfig[iata];

  if (!labConfig) {
    return null;
  }

  const languageIdLookup = recordToHashMap(languageRecords);
  const csvOutput = [];

  contentRecords.reduce((acc, record) => {
    const { recordOems } = getOemSystems(record);
    const contentLanguages = getAudioLanguagesById(record, languageIdLookup);

    const audioLanguages = contentLanguages.audio
      ? [...contentLanguages.audio.values()]
      : [];
    const subLanguages = contentLanguages.subs
      ? [...contentLanguages.subs.values()]
      : [];

    if (/Bluebox\sWow/.test(recordOems)) {
      labConfig.systems.map((system) => {
        const { filenameConfig, totalDubs, totalSubs } = system;
        const { fieldname } = filenameConfig;
        const row = { ...defaultBlueboxProgramming };
        row["Movie/Series Title"] = record.getCellValueAsString("Title");
        row["Bluebox Movie Filename"] = getFilenameFromField({
          record,
          fieldname,
        });

        const dubs = {};

        for (let index = 1; index <= totalDubs; index++) {
          if (audioLanguages[index]) {
            const f = createWowFilename(record, {
              config: { ...filenameConfig, filetype: "video", isDub: true },
              audioLanguages: [audioLanguages[index]],
            });
            dubs[`${blueboxProgrammingSubfields.dubs} ${index}`] = {
              [blueboxProgrammingSubfields.dubs]: f,
            };
          }
        }

        row[blueboxProgrammingSubfields.dubs] = { ...dubs };

        const subs = {};
        for (let index = 0; index <= totalSubs; index++) {
          if (subLanguages[index]) {
            const s = createWowFilename(record, {
              config: { ...filenameConfig, filetype: "subtitle" },
              audioLanguages: [subLanguages[index]],
            });
            subs[`${blueboxProgrammingSubfields.subs} ${index + 1}`] = {
              [blueboxProgrammingSubfields.subs]: s,
            };
          }
        }

        row[blueboxProgrammingSubfields.subs] = { ...subs };

        csvOutput.push(row);
      });
    }
    return acc;
  }, {});

  console.log(csvOutput);

  return {
    csvItemCount: csvOutput.length,
    csvOutput,
    headers: [...blueboxProgrammingHeaders],
    listToUpdate: [],
  };
};

export default blueboxProgramming;
