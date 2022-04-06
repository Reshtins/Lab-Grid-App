import { Record } from "@airtable/blocks/models";
import {
  ContentLanguageMaps,
  CsvColumnMap,
  CsvFieldMap,
  FieldSearch,
  MapFieldToCsv,
  RecordUpdateObject,
  SystemConfig,
  SystemFilenameConfig,
  SystemGridMapperArgs,
} from "../../types";
import { getAdditionalBlueboxFilenames } from "../filenames/bluebox";
import { lufthanasaAdditionalFilenames } from "../filenames/lufthansa";
import {
  getSystemId,
  insertNestedProp,
  execFieldSearchList,
  fieldSearchWithValue,
  getOemSystems,
  getFilenameFromField,
} from "./";
import { oemFieldSearch } from "./search";

export const gridMapper = <GridType>(
  record: Record,
  columnMap: CsvColumnMap<GridType>,
  defaultRow: GridType,
  rowNum?: number
) => {
  const programmingType = record.getCellValueAsString("Programming");

  const callback = (initRow: GridType, columnInfo: CsvFieldMap<GridType>) => {
    const {
      asCellValue,
      csvColumnName,
      pixlFieldName,
      value: defaultValue,
      subKey,
    } = columnInfo;

    let value = defaultValue;

    if (pixlFieldName) {
      if (!defaultValue) {
        value = asCellValue
          ? (record.getCellValue(pixlFieldName) as string)
          : record.getCellValueAsString(pixlFieldName);
      }

      if (columnInfo.formatFunction) {
        value = columnInfo.formatFunction({
          record,
          fieldname: pixlFieldName,
          row: rowNum,
          props: columnInfo.formatProps ?? [],
        });
      }

      if (columnInfo.fieldsearch) {
        const searchString = pixlFieldName
          ? record.getCellValueAsString(pixlFieldName)
          : "";
        const searchResult = execFieldSearchList(
          record,
          columnInfo.fieldsearch,
          searchString
        );

        if (searchResult) {
          value = searchResult;
        }
      }
    }
    const columns = Array.isArray(csvColumnName)
      ? csvColumnName
      : [csvColumnName];

    columns.map((colname) => {
      if (colname in initRow) {
        if (typeof initRow[colname] === "string") {
          initRow = {
            ...initRow,
            [colname]: value,
          };
        } else if (typeof initRow[colname] === "object") {
          const valueKey = typeof subKey === "string" ? subKey : "value";

          initRow = {
            ...initRow,
            [colname]: {
              ...initRow[colname],
              [valueKey]: value,
            },
          };
        }
      }
    });

    return initRow;
  };

  const newRow = columnMap.shared.reduce(callback, { ...defaultRow });

  if (programmingType === "Film") {
    return columnMap.film.reduce(callback, { ...newRow });
  } else if (programmingType === "TV") {
    return columnMap.tv.reduce(callback, { ...newRow });
  }

  return newRow;
};

const getAdditionalFilenames = <CsvRow>(
  record: Record,
  config: SystemConfig<CsvRow>,
  contentLanguages: ContentLanguageMaps
) => {
  switch (config.vendor) {
    case "Bluebox":
      return getAdditionalBlueboxFilenames(record, {
        contentLanguages,
      });

    case "Lufthansa Systems":
      return lufthanasaAdditionalFilenames(
        record,
        contentLanguages,
        config.filenameConfig.additionalFilenames
      );
  }
};

export const mapOtherFields = <CsvRow>(
  record: Record,
  otherFields: SystemConfig<CsvRow>["otherFields"],
  csvRow: CsvRow
) => {
  const newColumns = { ...csvRow };
  const programmingType = record.getCellValueAsString("Programming");

  const addToColumn = (columnName: string | string[], value: string) => {
    if (typeof columnName === "string") {
      newColumns[columnName] = value;
    } else {
      columnName.map((c: string) => {
        newColumns[c] = value;
      });
    }
  };

  const searchCallback = (search: FieldSearch) => {
    if (search.csvColumn && !search.queries) {
      addToColumn(search.csvColumn, search.value);
    } else if (search.queries) {
      const result = fieldSearchWithValue(record, [search]);
      result.map(({ csvColumn, value }) => {
        addToColumn(csvColumn, value);
      });
    }
  };

  const list = Array.isArray(otherFields)
    ? otherFields
    : otherFields[programmingType];

  list.map(searchCallback);

  return newColumns;
};

const getLinkedField = (record: Record, fieldname?: string) => {
  if (fieldname) {
    return record.getCellValueAsString(fieldname);
  }

  return record.name;
};

const getRecordFromMap = (
  recordMap: Map<string, Record>,
  key: string,
  fieldname?: string
) => {
  const record = recordMap.get(key);

  if (record) {
    return getLinkedField(recordMap.get(key), fieldname);
  }

  return "";
};

/**
 *
 * @param args
 * @returns
 */
const mapPixlToCsv = <CsvRow>({
  record: contentRecord,
  fieldMap = [],
  initRow,
  rowNum,
  linkedValues,
  systemConfig,
  filename,
  trailerFilename,
}: MapFieldToCsv<CsvRow>) =>
  fieldMap.reduce(
    (prev, columnInfo) => {
      const {
        pixlFieldName,
        formatFunction,
        value: defaultValue,
        getAllFieldValues,
      } = columnInfo;

      let value = defaultValue;
      let fieldname = pixlFieldName;
      let record = contentRecord;

      if (columnInfo.fieldsearch) {
        const { fieldsearch } = columnInfo;

        const searchString = fieldname
          ? contentRecord.getCellValueAsString(fieldname)
          : "";

        const searchResult = execFieldSearchList(
          contentRecord,
          fieldsearch,
          searchString,
          getAllFieldValues
        );

        if (searchResult) {
          value = searchResult;
        }
      }

      if (linkedValues) {
        const { pixlAudioName, pixlSubName, oemValues } = columnInfo;
        if (oemValues) {
          value = linkedValues.oem;
        } else if (pixlAudioName) {
          value = getRecordFromMap(
            linkedValues.audio,
            pixlAudioName.key,
            pixlAudioName.fieldname
          );
        } else if (pixlSubName) {
          value = getRecordFromMap(
            linkedValues.audio,
            pixlSubName.key,
            pixlSubName.fieldname
          );
        }
      }

      if (columnInfo.filename) {
        value = filename;
      }

      if (columnInfo.trailerFilename) {
        value = trailerFilename;
      }

      if (systemConfig && (columnInfo.systemValue || columnInfo.filenameKey)) {
        const { systemValue, filenameKey } = columnInfo;
        value = getSystemValue({
          systemConfig,
          key: systemValue,
          filenameKey,
        });
      }

      if (formatFunction) {
        const { formatProps = {} } = columnInfo;
        value = formatFunction({
          record,
          fieldname,
          row: rowNum,
          props: formatProps,
          systemConfig,
        });
      } else if (record && fieldname && !value) {
        value = record.getCellValueAsString(fieldname);
      }

      if (value === undefined) {
        return prev;
      }

      return insertToColumn(prev, value, columnInfo);
    },
    { ...initRow }
  );

const insertToColumn = <CsvRow>(
  prev: CsvRow,
  value: string | object,
  columnInfo: CsvFieldMap<CsvRow>
): CsvRow => {
  const { csvColumnName } = columnInfo;

  const columns = Array.isArray(csvColumnName)
    ? csvColumnName
    : [csvColumnName];

  return columns.reduce(
    (a, colname) => {
      if (colname in a) {
        const { subKey } = columnInfo;
        if (typeof a[colname] === "string") {
          return { ...a, [colname]: value };
        } else if (typeof a[colname] === "object") {
          const valueKey = subKey ?? "value";
          const path = [colname as string];

          if (typeof valueKey === "string") {
            path.push(valueKey);
          } else {
            path.push(...valueKey);
          }
          return { ...a, ...insertNestedProp(a, value, path) };
        }
      } else {
        return { ...a, [colname]: value };
      }

      return a;
    },
    { ...prev }
  );
};
/**
 *
 * @param args
 * @returns
 */
export const systemGridMapper = <CsvRow>(
  args: SystemGridMapperArgs<CsvRow>
) => {
  const { record, rowNum } = args;
  const { recordOems } = getOemSystems(record);
  let hasFieldsToUpdate = false;
  const programmingType = record.getCellValueAsString("Programming");
  const recordToUpdate: RecordUpdateObject = {
    id: record.id,
    fields: {},
  };

  const { columnMap, pacSerialNumber, defaultRow, contentLanguages, meta } =
    args;

  const mappedRow = mapPixlToCsv({
    record,
    fieldMap: columnMap.shared,
    initRow: defaultRow,
    linkedValues: { ...contentLanguages, oem: "" },
  });

  const programmingMap =
    programmingType === "Film" ? columnMap.film : columnMap.tv;

  const programmingRow = mapPixlToCsv({
    record,
    fieldMap: programmingMap,
    initRow: mappedRow,
    pacSerialNumber,
  });

  const { systemConfigs } = args;

  let index = rowNum;

  if (systemConfigs.length === 0) {
    return { systemRows: [programmingRow] };
  }

  const systemRows = systemConfigs.reduce((rows: CsvRow[], systemConfig) => {
    const { filenameConfig, trailerFilename, oemSystems, vendor } =
      systemConfig;

    const { oemSearch } = filenameConfig;
    const { found, value: oemResult } = oemFieldSearch(
      recordOems,
      oemSearch,
      programmingType,
      record
    );

    if (found) {
      const initRow = { ...programmingRow };
      const systemFilename = getSystemFilename(
        args,
        filenameConfig,
        oemSystems
      );
      const trailer = trailerFilename
        ? getSystemFilename(args, trailerFilename, oemSystems)
        : null;

      const recordId = { ...filenameConfig.id };

      if (recordId && recordId.fieldname && !recordId.value) {
        recordId.value = getSystemId(
          record,
          filenameConfig,
          vendor,
          recordId.fieldname
        );

        if (
          recordId.value &&
          !record.getCellValueAsString(recordId.fieldname)
        ) {
          recordToUpdate.fields[recordId.fieldname] = recordId.value;
        }
      }

      if (args.isLab) {
        const { overwrite = false } = args;

        if (
          systemFilename.filename &&
          (!systemFilename.hasFilename || overwrite)
        ) {
          recordToUpdate.fields = {
            ...appendFilenameForRecord({
              record: recordToUpdate,
              filenameConfig,
              filename: systemFilename.filename,
            }),
          };
          hasFieldsToUpdate = true;
        }

        if (trailer && (!trailer.hasFilename || overwrite)) {
          recordToUpdate.fields = {
            ...appendFilenameForRecord({
              record: recordToUpdate,
              filenameConfig: trailerFilename,
              filename: trailer.filename,
            }),
          };
          hasFieldsToUpdate = true;
        }
      }

      const { systemMap } = systemConfig;

      const mapperObject: MapFieldToCsv<CsvRow> = {
        record,
        fieldMap: systemMap,
        initRow: { ...initRow },
        rowNum: index,
        systemConfig: { ...systemConfig },
        linkedValues: { oem: oemResult, ...contentLanguages },
        filename: systemFilename?.filename,
        trailerFilename: trailer?.filename,
      };

      const systemRow = mapPixlToCsv({ ...mapperObject });

      if (systemConfig.filenameConfig.additionalFilenames) {
        const additionalFilenames = getAdditionalFilenames(
          record,
          systemConfig,
          contentLanguages
        );

        Object.assign(systemRow, additionalFilenames);
      }

      if (meta) {
        const metaRows = meta.map(({ shared, film, tv }) => {
          const metaRow = mapPixlToCsv({
            ...mapperObject,
            fieldMap: shared,
            initRow: { ...systemRow },
            rowNum: index,
          });
          const fieldMap = programmingType === "Film" ? film : tv;

          if (!fieldMap) {
            index++;
            return metaRow;
          }

          return mapPixlToCsv({
            ...mapperObject,
            fieldMap,
            initRow: { ...metaRow },
            rowNum: index++,
          });
        });

        rows.push(...metaRows);
      } else {
        rows.push(systemRow);
        index++;
      }
    }
    return rows;
  }, []);

  return { systemRows, recordToUpdate, hasFieldsToUpdate };
};

const appendFilenameForRecord = (args: {
  filenameConfig: SystemFilenameConfig;
  record: RecordUpdateObject;
  filename: string;
}) => {
  const { filename, record, filenameConfig } = args;

  record.fields = {
    ...record.fields,
    [filenameConfig.fieldname]: `${filenameConfig.configName} : ${filename}`,
  };

  return record.fields;
};

const getSystemFilename = <CsvRow>(
  args: SystemGridMapperArgs<CsvRow>,
  filenameConfig: SystemFilenameConfig,
  systems: SystemConfig<CsvRow>["oemSystems"],
  recordId?: {
    fieldname?: string;
    value?: string;
  }
) => {
  const { record, pacSerialNumber, pacFilePrefix, contentLanguages } = args;

  const filenameField = filenameConfig.fieldname;
  const existingFilename = getFilenameFromField({
    record,
    fieldname: filenameField,
  });

  const output = {
    hasFilename: !!existingFilename,
    filename: existingFilename,
  };

  if (!existingFilename) {
    output.filename = filenameConfig.filenameFunction(record, {
      config: { ...filenameConfig, id: recordId },
      systems: systems,
      pacSerialNumber,
      pacFilePrefix,
      contentLanguages,
    });
  }

  return output;
};

export const getSystemValue = <CsvRow>(args: {
  systemConfig: SystemConfig<CsvRow>;
  key: keyof SystemConfig<CsvRow>;
  filenameKey?: keyof SystemFilenameConfig;
}) => {
  const { systemConfig, key, filenameKey } = args;
  const value = systemConfig[key];

  if (typeof value === "string") {
    return value;
  }

  switch (key) {
    case "oemSystems":
      return systemConfig["oemSystems"]
        .map((sys) => {
          if (typeof sys === "string") {
            return sys;
          } else {
            sys.name;
          }
          return "";
        })
        .join(",");
    case "filenameConfig":
      return getFilenameConfigValue({
        filenameConfig: systemConfig.filenameConfig,
        key: filenameKey,
      });
    case "trailerFilename":
      return getFilenameConfigValue({
        filenameConfig: systemConfig.trailerFilename,
        key: filenameKey,
      });
  }

  if (typeof value === "object") {
    return "";
  }

  return "";
};

const getFilenameConfigValue = (args: {
  filenameConfig: SystemFilenameConfig;
  key: keyof SystemFilenameConfig;
}) => {
  const { filenameConfig, key } = args;
  const value = filenameConfig[key];

  if (typeof value === "string") return value;

  return "";
};
