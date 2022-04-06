import { Record } from "@airtable/blocks/models";
import {
  FieldSearch,
  FieldSearchList,
  QueryObject,
  SearchResultObject,
  SystemConfig,
} from "../../types";
import {
  appendToCsvRow,
  flattenCellAsString,
  getOemSystems,
  updateObjProp,
} from "./";

const doFieldSearch = (
  searchString: string,
  query: string | RegExp,
  caseInsesitive = true
) => {
  if (typeof query === "string") {
    return caseInsesitive
      ? searchString.toLowerCase().includes(query.toLowerCase())
      : searchString.includes(query);
  } else {
    return query.test(searchString);
  }
};

/**
 * Get value from the search result, either
 *
 * @param search
 * @param record
 * @returns
 */
const getFieldSearchValue = (search: FieldSearch, record: Record) => {
  const { fieldname, formatterFunction, value, defaultValue = "" } = search;

  if (formatterFunction) {
    const { formatterProps, formatterFieldname } = search;
    return formatterFunction({
      record,
      fieldname: formatterFieldname ?? fieldname,
      value,
      props: formatterProps,
    });
  }

  if (value) {
    return value;
  }

  if (fieldname && !defaultValue) {
    return flattenCellAsString({ record, fieldname });
  }

  return defaultValue;
};

export const isOemMatch = (record: Record, systemConfig: SystemConfig<any>) => {
  const { recordOems } = getOemSystems(record);

  return systemConfig.oemSystems.some((system) => {
    if (typeof system === "string") {
      return recordOems.includes(system);
    }

    if (system.checkOem) {
      if (system.formatter) {
        return system.formatter({
          record,
          fieldname: [
            "OEM System 1",
            "OEM System 2",
            "OEM System 3",
            "OEM System 4",
          ],
          props: system.formatterProps,
        });
      }

      return recordOems.includes(system.name);
    }
    return false;
  });
};

export const getSearchValue = ({
  record,
  formatterFunction: value,
  fieldname,
  formatterFieldname,
  formatterProps,
}: FieldSearch & { record: Record }) => {
  if (typeof value === "string") {
    return value;
  } else if (typeof value === "function") {
    return value({
      record,
      fieldname: formatterFieldname ?? fieldname,
      props: formatterProps,
    });
  }
};

/**
 *
 * @param recordOem The OEM System the record is using
 * @param fieldSearchList List of OEM systems to check against
 * @returns
 */
export const oemFieldSearch = (
  recordOem: string,
  fieldSearchList: FieldSearchList,
  programmingType: string,
  record: Record
) => {
  if (!recordOem) {
    return { found: false, value: "" };
  }
  const values: string[] = [];
  const isArray = Array.isArray(fieldSearchList);

  if ((!isArray && !programmingType) || !fieldSearchList) {
    return { found: false, value: "" };
  }

  const searchArray: FieldSearch[] = getFieldSearchList(
    fieldSearchList,
    programmingType
  );

  if (!searchArray || searchArray.length === 0) {
    return { found: false, value: "" };
  }

  const isOemFound = searchArray.reduce((found, args) => {
    const {
      queries,
      fieldname,
      formatterFunction: searchValue,
      formatterFieldname,
      formatterProps,
    } = args;
    let searchString = fieldname
      ? flattenCellAsString({ record, fieldname })
      : "";
    if (searchValue) {
      getSearchValue({ ...formatterProps, record });
    }

    if (typeof searchValue === "string") {
      values.push(searchValue);
    } else if (typeof searchValue === "function") {
      const val = searchValue({
        record,
        fieldname: formatterFieldname ?? fieldname,
        props: formatterProps,
      });
      values.push(val);
    }

    const queryResult = checkQuery(record, queries, searchString, recordOem);

    if (queryResult) {
      found = true;
    }

    return found;
  }, false);

  return { found: isOemFound, value: values.join(", ") };
};

const checkQuery = (
  record: Record,
  queries: QueryObject[],
  searchString: string,
  value: string
) =>
  queries.every((query) => {
    if (query.hasValue !== undefined) {
      if (query.hasValue) return !!value;
      if (!query.hasValue) return !value;
    }

    searchString = searchString || value;

    if (query.fieldname) {
      searchString = flattenCellAsString({
        record,
        fieldname: query.fieldname,
      });
    }

    if (query.find) {
      return doFieldSearch(searchString, query.find);
    }

    if (query.isNot) {
      return !doFieldSearch(searchString, query.isNot);
    }

    return false;
  });

export const execFieldSearch = (
  record: Record,
  searchObject: FieldSearch,
  manualSearchString?: string
) => {
  const returnValue = getFieldSearchValue(searchObject, record);

  if (returnValue === "") {
    return "";
  }

  const { fieldname } = searchObject;

  // Top level fieldname for all queries
  let searchFieldValue = "";
  if (fieldname) {
    searchFieldValue = flattenCellAsString({
      record,
      fieldname,
    });
  }

  const isValid = searchObject.queries.every((query) => {
    let searchString = "";
    if (manualSearchString) {
      searchString = manualSearchString;
    }

    if (searchFieldValue) {
      searchString = searchFieldValue;
    }
    if (query.fieldname) {
      searchString = flattenCellAsString({
        record,
        fieldname: query.fieldname,
      });
    }

    if (query.find) {
      return doFieldSearch(searchString, query.find);
    }

    if (query.isNot) {
      return !doFieldSearch(searchString, query.isNot);
    }

    if (query.hasValue !== undefined && !!searchString) {
      return !!searchString;
    }

    return false;
  });

  if (isValid) {
    return returnValue;
  }
};

/**
 *
 * @param record
 * @param fieldSearchList
 * @param searchString Optional parameter to directly look for
 */
export const execFieldSearchList = (
  record: Record,
  fieldSearchList: FieldSearchList,
  searchString = "",
  getAllResults = false
) => {
  const programmingType = record.getCellValueAsString("Programming");

  const searchArray = getFieldSearchList(fieldSearchList, programmingType);

  let value: string[] = [];
  for (let i = 0; i < searchArray.length; i++) {
    const fieldSearch = searchArray[i];

    // Value to return
    const searchValue = execFieldSearch(record, fieldSearch, searchString);

    if (searchValue) {
      if (!getAllResults) {
        return searchValue;
      }

      value.push(searchValue);
    }
  }

  return value.join(", ");
};

/**
 *
 * @param record programming record object
 * @param fieldSearchList
 * @param delimmiter
 * @param valuesToFilter
 * @returns
 */
export const filterFieldSearch = (
  record: Record,
  fieldSearchList: FieldSearch[],
  delimmiter = ",",
  valuesToFilter?: string[]
) =>
  fieldSearchList.reduce((filtered: string[], s) => {
    const fieldValue =
      flattenCellAsString({
        record,
        fieldname: s.fieldname,
        props: { delimmiter },
      }) ?? getFieldSearchValue(s, record);

    const returnValue = valuesToFilter ?? fieldValue.split(delimmiter);

    filtered = s.queries.reduce((list, query) => {
      list = returnValue.filter((v) => {
        if (!v) return v;

        if (query.find) {
          return doFieldSearch(v, query.find);
        }
        if (query.isNot) {
          return !doFieldSearch(v, query.isNot);
        }

        return v;
      });

      return list;
    }, returnValue);

    return filtered;
  }, []);

export const findOemNumber = (
  oemMap: Map<string, string>,
  search: string | RegExp
) => {
  for (const [key, value] of oemMap) {
    if (doFieldSearch(value, search) && key) {
      return key.replace(/OEM System/i, "").trim();
    }
  }

  return null;
};

export const getFieldSearchList = (
  list: FieldSearchList,
  type: string
): FieldSearch[] => {
  if (Array.isArray(list)) {
    return list;
  }

  if (type in list) {
    return list[type];
  }

  return [];
};

/**
 * Finds the first true condition in the fieldSearch parameter and returns the value
 * stored in that object
 *
 * @param record
 * @param fieldSearchList
 * @param altSearch
 * @returns The search result
 */
export const fieldSearchWithValue = (
  record: Record,
  fieldSearchList: FieldSearch[],
  altSearch?: string
) =>
  fieldSearchList.reduce((searchResult: SearchResultObject[], fieldSearch) => {
    const {
      queries,
      fieldname,
      formatterFunction: searchValue,
      formatterFieldname,
      formatterProps,
      csvColumn,
    } = fieldSearch;

    // Value to return
    let value: string;

    if (typeof searchValue === "function") {
      value = searchValue({
        record,
        fieldname: formatterFieldname ?? fieldname,
        props: formatterProps,
      });
    } else if (!searchValue && fieldname) {
      value = flattenCellAsString({ record, fieldname });
    } else {
      value = searchValue;
    }

    // Use built in search string or overwrite
    let searchString = "";

    if (fieldname || !altSearch) {
      if (typeof fieldname === "string") {
        searchString = record
          .getCellValueAsString(fieldname)
          .toLocaleLowerCase();
      } else if (Array.isArray(fieldname)) {
        searchString = fieldname.reduce((str, fname) => {
          str += record.getCellValueAsString(fname).toLocaleLowerCase();
          return str;
        }, "");
      }
    } else if (altSearch) {
      searchString = altSearch;
    }
    searchString = searchString.toLocaleLowerCase();

    if (!searchString) {
      return searchResult;
    }

    const found = queries.every((query) => {
      if (query.hasValue !== undefined) {
        if (query.hasValue) {
          return !!searchString;
        }
        if (!query.hasValue) return !searchString;
      }

      if (query.find) {
        return !!doFieldSearch(searchString, query.find);
      }

      if (query.isNot) {
        return !doFieldSearch(searchString, query.isNot);
      }
    });

    if (found) {
      searchResult.push({
        csvColumn,
        fieldname,
        value,
      });
    }

    return searchResult;
  }, []);

/**
 *
 * @returns true if the string is found in the field
 */
export const findInField = (record: Record, fieldSearch: FieldSearch[]) => {
  try {
    return fieldSearch.every(({ queries, fieldname }) => {
      // const value = record.getCellValueAsString(fieldname).toLocaleLowerCase();
      let fieldValue = "";

      if (typeof fieldname === "string") {
        fieldValue = record.getCellValueAsString(fieldname).toLocaleLowerCase();
      } else if (Array.isArray(fieldname)) {
        fieldValue = fieldname
          .reduce((str, fname) => {
            str.push(record.getCellValueAsString(fname).toLocaleLowerCase());
            return str;
          }, [])
          .join("|");
      }

      for (let i = 0; queries.length; i++) {
        const query: QueryObject = queries[i];
        let queryFieldValue = fieldValue;

        if (query.fieldname) {
          queryFieldValue = flattenCellAsString({
            record,
            fieldname: query.fieldname,
            props: { delimmiter: "|" },
          }).toLocaleLowerCase();
        }

        if (query.hasValue !== undefined) {
          if (query.hasValue) return !!queryFieldValue;
          if (!query.hasValue) return !queryFieldValue;
        }

        if (!queryFieldValue) {
          return false;
        }

        if (query.find) {
          return doFieldSearch(queryFieldValue, query.find);
        }

        if (query.isNot) return !doFieldSearch(queryFieldValue, query.isNot);
      }

      return false;
    });
  } catch (error) {
    console.error(error);
  }

  return false;
};

export const appendOtherRows = <T>(
  record: Record,
  fields: FieldSearch[],
  row: T
) => {
  const newColumns = { ...row };

  return fields.reduce((newRow: T, fieldSearch) => {
    const value = execFieldSearch(record, fieldSearch);
    appendToCsvRow(fieldSearch.csvColumn, (csvColumn) => {
      const path = csvColumn.split(".");
      if (value && path.length > 1) {
        updateObjProp<T>(newRow, value, csvColumn);
      } else if (typeof newRow[csvColumn] === "string") {
        newRow[csvColumn] = value;
      } else if (typeof newRow[csvColumn] === "object") {
        newRow[csvColumn].value = value;
      }
    });

    return newRow;
  }, newColumns);
};
