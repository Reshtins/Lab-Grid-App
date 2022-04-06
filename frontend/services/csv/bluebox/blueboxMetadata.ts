import { Record } from "@airtable/blocks/models";
import {
  defaultBlueboxMetadata,
  blueboxConfig,
  blueboxMetadataHeaders,
} from "../../configs";
import createWowFilename from "../../filenames/bluebox";
import {
  filterFieldSearch,
  findOemNumber,
  getAudioLanguagesById,
  getDateByFormat,
  getFieldSearchList,
  getOemSystems,
  getReportType,
  gridMapper,
  recordToHashMap,
} from "../../util";

import {
  BlueboxMetadataRow,
  CsvBuilder,
  SystemFilenameConfig,
} from "../../../types";

const blueboxTvTitle = (contentRecord: Record) =>
  contentRecord.getCellValueAsString("Episode #")
    ? `${contentRecord
        .getCellValueAsString("Season")
        .replace(
          /(?!^.{1}).([\S]+)\s/g,
          ""
        )}:E${contentRecord.getCellValueAsString("Episode #")} ${contentRecord
        .getCellValueAsString("Episode")
        .replace(/"/g, "")},`
    : `${contentRecord.getCellValueAsString("Episode").replace(/"/g, "")},`;

const boxsetCategory = (record: Record) =>
  `~${record.getCellValueAsString("Series").replace(/"/g, "")}~${record
    .getCellValueAsString("Season")
    .replace(/(?!^.{1}).*\s/g, "")}`;

const titleCheckString = (rownum: number) =>
  `=IF(LEN(C${rownum + 1})>50,"Error: Too Long","")`;

const createBlueboxMetadataGrid: CsvBuilder = (args) => {
  const { contentRecords, iata, languageRecords } = args;
  const config = blueboxConfig[iata];
  const languageIdLookup = recordToHashMap(languageRecords);

  if (!config) {
    return null;
  }

  const regex = /Bluebox\sWow/;
  let currentRow = 1;

  const subCateoryLookup = new Map<string, BlueboxMetadataRow[]>();

  const csvOutput = contentRecords.reduce(
    (rows: BlueboxMetadataRow[], record) => {
      const { recordOems, recordSystemMap } = getOemSystems(record);
      const contentLanguages = getAudioLanguagesById(record, languageIdLookup);

      const oemNumber = findOemNumber(recordSystemMap, regex);
      const programmingType = record.getCellValueAsString("Programming");

      if (regex.test(recordOems) && oemNumber) {
        const systemRows = config.systems.map((systemConfig) => {
          const { columnMap } = config;
          const fileConfig = {
            ...systemConfig.filenameConfig,
            filetype: "image",
          } as SystemFilenameConfig;

          const row = gridMapper(
            record,
            columnMap,
            defaultBlueboxMetadata
          );
          // const row: BlueboxMetadataRow = { ...defaultBlueboxMetadata };
          row.Category = getReportType({ record, fieldname: "" });
          //"Film" ? "Movie" : programmingType;

          const subCategoriesSearch = getFieldSearchList(
            systemConfig.categories,
            programmingType
          );

          if (programmingType === "TV") {
            row["Title"] = blueboxTvTitle(record);
          }

          const subCategories = filterFieldSearch(
            record,
            subCategoriesSearch,
            "|"
          );

          row["Title Length Check"] = titleCheckString(currentRow);

          row["Sub-Category"] = subCategories.join(",");

          row["End Date"] = getDateByFormat({
            record,
            fieldname: `OEM End ${oemNumber}`,
            props: { format: "DD/MM/YYYY" },
          });

          row["Synopsis Length"] = `${row["Synopsis"].length}`;

          row["Thumbnail Image Filename"] = createWowFilename(record, {
            audioLanguages: "th",
            config: fileConfig,
          });
          row["Synopsis Image Filename"] = createWowFilename(record, {
            audioLanguages: "syn",
            config: fileConfig,
          });

          const dubs: string[] = [];
          contentLanguages.audio.forEach((value, key) => {
            if (value && key && key !== "10") {
              dubs.push(value.name);
            }
          });
          row["Dubs"] = dubs.join();
          const subCategoryList = row["Sub-Category"].split(",");

          if (programmingType === "TV") {
            const newCategory = boxsetCategory(record);

            subCategoryList.map((subCategory) => {
              const key = subCategory + newCategory;

              const copy = { ...row };
              copy["Sub-Category"] = key;

              if (subCateoryLookup.has(key)) {
                // subCategoriesMap[key].push(copy);
                const ep = subCateoryLookup.get(key);

                ep.push(copy);

                subCateoryLookup.set(key, ep);
              } else {
                // subCategoriesMap[key] = [copy];
                subCateoryLookup.set(key, [copy]);
              }
            });
          }

          currentRow++;
          return row;
        });

        rows.push(...systemRows);
      }

      return rows;
    },
    []
  );

  if (subCateoryLookup.size) {
    let rowNum = 1;
    const tvArray = [];
    subCateoryLookup.forEach((value) => {
      tvArray.push(
        ...value.map((ep) => {
          ep["Title Length Check"] = titleCheckString(rowNum++);
          return ep;
        })
      );
    });

    return {
      csvItemCount: tvArray.length,
      csvOutput: tvArray,
      headers: [...blueboxMetadataHeaders],
      listToUpdate: [],
    };
  }

  return {
    csvItemCount: csvOutput.length,
    csvOutput,
    headers: [...blueboxMetadataHeaders],
    listToUpdate: [],
  };
};

export default createBlueboxMetadataGrid;
