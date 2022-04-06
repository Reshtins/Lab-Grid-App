import {
  defaultViasatRow,
  viasatConfig,
  viasatFilmHeader,
  viasatTvHeader,
} from "../../configs";
import { createViasatFilename } from "../../filenames/viasat";
import {
  filterFieldSearch,
  getAudioLanguagesById,
  getFieldSearchList,
  recordToHashMap,
} from "../../util";

import { gridMapper } from "../../util/gridMapper";

import { CsvBuilder, ViasatRow } from "../../../types";

const createViasatChart: CsvBuilder = (cycleData, logger) => {
  const {
    contentRecords,
    iata,
    languageRecords,
    programmingType,
    pacDistributorRecords,
  } = cycleData;

  const config = viasatConfig[iata];
  const languageIdLookup = recordToHashMap(languageRecords);
  const distributorMap = recordToHashMap(pacDistributorRecords, "Name");

  const header = programmingType === "Film" ? viasatFilmHeader : viasatTvHeader;

  const initCsvRows = [];

  for (let index = 0; index < 3; index++) {
    initCsvRows.push({ ...defaultViasatRow });
  }

  let csvItemCount = 0;
  let rowNum = 5;

  const csvOutput = contentRecords.reduce((rows: ViasatRow[], record) => {
    const contentLanguages = getAudioLanguagesById(record, languageIdLookup);

    const programmingType = record.getCellValueAsString("Programming");
    const recordDistributor = distributorMap.get(
      record.getCellValueAsString("Distributor")
    );

    const distrbutor = {
      name: recordDistributor.getCellValueAsString("Name (3 char)"),
      filmLab:
        programmingType === "Film"
          ? recordDistributor.getCellValueAsString("Film Lab (3 char)")
          : "STL",
    };

    const systemRows = config.systems.map((system) => {
      const row = gridMapper<ViasatRow>(
        record,
        config.columnMap,
        { ...defaultViasatRow },
        rowNum
      );
      const categorySearch = getFieldSearchList(
        system.categories,
        programmingType
      );

      const categories = filterFieldSearch(record, categorySearch, "|");
      row["Category List"] = categories.join("|");

      if (programmingType === "Film") {
        row["Poster Image File Name (.jpg)"] = createViasatFilename(record, {
          config: { ...system.filenameConfig, filetype: "image" },
        });
        row["Lab"] = distrbutor?.filmLab;
      } else if (programmingType === "TV") {
        row["Series Image File Name (.jpg)"] = createViasatFilename(record, {
          config: { ...system.filenameConfig, filetype: "image" },
          recordType: "Series",
        });
        row["Episode Image File Name (.jpg)"] = createViasatFilename(record, {
          config: { ...system.filenameConfig, filetype: "image" },
          recordType: "Episode",
        });
      }

      if (distrbutor.name) {
        row["Dist"] = distrbutor.name;
      }

      const { audio, subs } = contentLanguages;
      if (audio) {
        audio.forEach((languageRecord, key) => {
          const num = parseInt(key);
          const headerKey = `Lang ${num}`;

          if (languageRecord && num < 7) {
            row.Languages = {
              ...row.Languages,
              [headerKey]: {
                label: headerKey,
                value: languageRecord
                  .getCellValueAsString("ISO639-2B")
                  .toUpperCase(),
              },
            };
          }
        });
      }

      let ccCount = 0;
      let embedCount = 0;
      let dynCount = 0;

      if (subs) {
        subs.forEach((languageRecord, key) => {
          const type = record.getCellValueAsString(`Subtitle ${key} Type`);
          const embedKey = `Sub Embed ${embedCount + 1}`;
          const dynKey = `Sub Dynamic ${dynCount + 1}`;

          if (languageRecord) {
            const value = languageRecord
              .getCellValueAsString("ISO639-2B")
              .toUpperCase();

            if (type === "Embedded" && embedCount < 2) {
              row["Sub Embed"] = {
                ...row["Sub Embed"],
                ...{
                  [embedKey]: {
                    label: embedKey,
                    value: value,
                  },
                },
              };
              embedCount++;
            } else if (type === "Closed Caption" && ccCount < 1) {
              row["Closed Caps"] = value;
              ccCount++;
            } else if (type === "Dynamic Sub" && dynCount < 2) {
              row["Sub Dynamic"] = {
                ...row["Sub Dynamic"],
                ...{
                  [dynKey]: {
                    label: dynKey,
                    value: value,
                  },
                },
              };
              dynCount++;
            }
          }
        });
      }
      rowNum++;
      csvItemCount++;

      return { ...row };
    });

    rows.push(...systemRows);

    return rows;
  }, initCsvRows);

  return {
    csvItemCount,
    csvOutput,
    headers: header,
    listToUpdate: null,
  };
};

export default createViasatChart;
