import { Record, Table } from "@airtable/blocks/models";
import {
  AirlineCsvMap,
  CsvBuilder,
  CsvFunctionOutput,
  GridProps,
  MetadataType,
  UserSettings,
} from "../../types";
import { removeFromDropbox, uploadDropboxFile } from "../dropbox";
import createGanttChart from "./gantt";
import blueboxProgramming from "./bluebox/blueboxProgramming";
import convertToCsv from "./convertAndDownload";
import createPacMmaGrid from "./pac";
import createBlueboxMetadataGrid from "./bluebox/blueboxMetadata";
import createViasatChart from "./viasat";
import createImmflyGrid from "./immify";
import { DropboxResponse, files } from "dropbox";
import createRaveGrid from "./rave";

import csvWithMapper from "./csvWithMapper";
import { ganttConfigMap, labConfigMap, pacConfigMap } from "../configs";

interface CreateCsvProps {
  logOnly: boolean;
  filmProgrammingTable: Table;
  tvProgrammingTable: Table;
  csvFileTable: Table;
  programmingRecords: Record[];
  airlineRecord: Record;
  languageRecords: Record[];
  pacDistributorRecords: Record[];
  cycleRecord: Record;
  settings: UserSettings;
  handleAppendMessage: (msg: string) => any;
  settingsCallback: (newSettings: Partial<UserSettings>) => any;
}

const updateRecords = (table: Table, records: any[]) => {
  const list = [...records];

  while (list.length > 0) {
    table.updateRecordsAsync(list.splice(0, 50));
  }
};

const insertCsvTable = async (
  csvFileTable: Table,
  obj: any,
  dropboxData: DropboxResponse<files.FileMetadata>
) => {
  await csvFileTable.createRecordAsync(obj);
  return removeFromDropbox(dropboxData.result.path_display);
};

const getConfigMap = (metadataType: MetadataType | ""): AirlineCsvMap<any> => {
  switch (metadataType) {
    case MetadataType.Pac:
      return pacConfigMap;
    case MetadataType.Gantt:
      return ganttConfigMap;
    case MetadataType.Lab:
      return labConfigMap;
    case MetadataType.BlueboxGrid:
      break;
    case MetadataType.BlueboxMeta:
      break;
    case MetadataType.Viasat:
      break;
    case MetadataType.Immfly:
      break;
    case MetadataType.RaveCtr:
    case MetadataType.RaveGui:
    case MetadataType.RaveMedia:
    default:
      return null;
  }
};

const createCsv = async (args: CreateCsvProps) => {
  const {
    filmProgrammingTable,
    tvProgrammingTable,
    csvFileTable,
    logOnly,
    programmingRecords,
    airlineRecord,
    languageRecords,
    cycleRecord,
    settings,
    settingsCallback,
    pacDistributorRecords,
    handleAppendMessage,
  } = args;
  const setToIdle = () => settingsCallback({ status: "idle" });
  if (programmingRecords && settings.programmingType) {
    settingsCallback({ status: "loading" });

    const iata = airlineRecord.getCellValueAsString("IATA Code");
    const cycleName = cycleRecord.getCellValueAsString("Pretty Cycle Name");
    const pacFilePrefix = airlineRecord.getCellValueAsString(
      "PAC Filename Prefix"
    );
    const { metadataType, programmingType, csvOnly, overwrite } = settings;
    handleAppendMessage(`Creating ${settings.metadataType} for ${cycleName}`);

    const onComplete = (grid: CsvFunctionOutput) => {
      console.log(grid);
      if (!grid) {
        return setToIdle();
      }

      if (logOnly) {
        console.log("Log only");

        const { csvOutput, headers } = grid;
        const reportName = "test";
        if (grid.csvItemCount > 0)
          convertToCsv({ csvData: csvOutput, reportName, headers }).then(
            (v) => {
              console.log(v);
            }
          );

        return setToIdle();
      }

      if (grid.csvItemCount > 0) {
        const { csvOutput, headers, listToUpdate } = grid;

        if (listToUpdate && metadataType === "Lab Grid" && !csvOnly) {
          handleAppendMessage(
            `Inserting filenames to ${settings.programmingType} programming table`
          );
          switch (settings.programmingType) {
            case "Film":
              updateRecords(filmProgrammingTable, listToUpdate);
              break;
            case "TV":
              updateRecords(tvProgrammingTable, listToUpdate);
              break;
            default:
              break;
          }
        }

        const csvReportName = programmingType === "Film" ? "Movie" : "TV";
        const reportName = `${cycleRecord.name} - ${metadataType} - ${csvReportName}`;

        convertToCsv({
          csvData: csvOutput,
          reportName,
          headers,
        })
          .then(({ csvFilename, csv }) => {
            handleAppendMessage("Uploading to dropbox...");
            return uploadDropboxFile(iata, csvFilename, csv);
          })
          .then(({ csvUrl, csvFilename, dropboxData }) => {
            handleAppendMessage("Creating new CSV File record");

            setToIdle();

            const obj = {
              Name: reportName,
              "Grid Type": `${metadataType}, ${programmingType}`,
              Rows: grid.csvItemCount,
              "CSV File": [
                {
                  filename: csvFilename,
                  url: csvUrl,
                },
              ],
            };

            return insertCsvTable(csvFileTable, obj, dropboxData);
          })
          .then((data) => console.log(data))
          .catch((err) => {
            console.log(err);
            setToIdle();
          });
      } else {
        setToIdle();
      }
    };

    const gridProps: GridProps = {
      airline: airlineRecord.name,
      iata,
      pacFilePrefix: pacFilePrefix || iata.toLowerCase(),
      contentRecords: programmingRecords,
      languageRecords,
      cycleName,
      overwrite,
      pacDistributorRecords,
      programmingType: settings.programmingType,
      metadataType,
    };

    const configMap = getConfigMap(metadataType);

    if (configMap) {
      const res = csvWithMapper(gridProps, handleAppendMessage, configMap);
      return onComplete(res);
    }

    let csvFunction: CsvBuilder = null;

    switch (metadataType) {
      case MetadataType.Pac:
        csvFunction = createPacMmaGrid;
        break;
      case MetadataType.Gantt:
        csvFunction = createGanttChart;
        break;
      case MetadataType.BlueboxGrid:
        csvFunction = blueboxProgramming;
        break;
      case MetadataType.BlueboxMeta:
        csvFunction = createBlueboxMetadataGrid;
        break;
      case MetadataType.Viasat:
        csvFunction = createViasatChart;
        break;
      case MetadataType.Immfly:
        csvFunction = createImmflyGrid;
        break;
      case MetadataType.RaveCtr:
      case MetadataType.RaveGui:
      case MetadataType.RaveMedia:
        csvFunction = createRaveGrid;
      default:
        break;
    }

    if (csvFunction) {
      onComplete(csvFunction(gridProps, handleAppendMessage));
    }
  }
};

export default createCsv;
