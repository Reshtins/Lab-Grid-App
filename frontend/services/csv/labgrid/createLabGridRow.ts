import {
  AdditionalFilenameProps,
  LabGridFilenameArgs,
  LabGridRow,
} from "../../../types";

import { getAdditionalBlueboxFilenames } from "../../filenames/bluebox";
import { lufthanasaAdditionalFilenames } from "../../filenames/lufthansa";

import {
  getFilenameFromField,
  mapOtherFields,
  getSystemId,
  oemFieldSearch,
  getOemSystems,
} from "../../util";

const createLabGridRow = (props: LabGridFilenameArgs) => {
  const {
    rowNum,
    pacFilePrefix,
    pacSerialNumber,
    record,
    config,
    columns,
    contentLanguages,
    overwrite,
  } = props;

  const row: LabGridRow = {
    ...columns,
    No: `${rowNum}`,
  };
  const { recordOems, recordSystemMap } = getOemSystems(record);
  const programmingType = record.getCellValueAsString("Programming");
  let isValid = recordSystemMap.size > 0;
  const { filenameConfig, otherFields } = config;
  const { configName, fieldname, oemSearch, aspect, id } = filenameConfig;
  const addedHeaders: string[] = [];
  const fieldsToUpdate: { [field: string]: any } = {};

  const recordId = { ...id };

  if (oemSearch) {
    const { found } = oemFieldSearch(
      recordOems,
      oemSearch,
      programmingType,
      record
    );
    isValid = found;
  }

  let filename = "";
  let trailerFilename = "";

  if (isValid) {
    if (recordId && recordId.fieldname && !recordId.value) {
      recordId.value = getSystemId(
        record,
        filenameConfig,
        config.vendor,
        recordId.fieldname
      );

      if (recordId.value && !record.getCellValueAsString(recordId.fieldname)) {
        fieldsToUpdate[recordId.fieldname] = recordId.value;
      }
    }

    const filenameProps: AdditionalFilenameProps = {
      contentLanguages,
      pacSerialNumber,
      systems: config.oemSystems,
      config: { ...filenameConfig, id: recordId },
      pacFilePrefix,
    };

    const currentFilename = getFilenameFromField({ record, fieldname });
    if (currentFilename && !overwrite) {
      filename = currentFilename;
    } else {
      filename = filenameConfig.filenameFunction(record, filenameProps);
    }

    if (!currentFilename || overwrite) {
      fieldsToUpdate[fieldname] = `${configName} : ${filename}`;
    }

    row.Vendor = config.vendor;
    row.System = config.oemSystems
      .reduce((acc: string[], cur) => {
        if (typeof cur === "string") {
          acc.push(cur);
        } else {
          if (cur.checkOem && recordOems.includes(cur.name)) {
            acc.push(cur.name);
          }
        }

        return acc;
      }, [])
      .join(",");

    if (programmingType === "TV") {
      row["File Format"] = "TV Master";
    } else if (typeof filenameConfig.fileFormat === "string") {
      row["File Format"] = filenameConfig.fileFormat;
    } else if (typeof filenameConfig.fileFormat === "function") {
      row["File Format"] = filenameConfig.fileFormat(record);
    }

    row.Delivery = filenameConfig.delivery;

    if (typeof filenameConfig.shipping === "string") {
      row["Shipping To"] = filenameConfig.shipping;
    } else if (
      filenameConfig.shipping &&
      programmingType in filenameConfig.shipping
    ) {
      row["Shipping To"] = filenameConfig.shipping[programmingType];
    }

    row["Movie Filename"] = filename;

    if (aspect) {
      row["Aspect Ratio"] = aspect;
    }

    if (config.trailerFilename && programmingType === "Film") {
      // Create Trailer filename
      const {
        configName: trailerConfigName,
        fieldname: trailerFieldname,
        id: configTrailerId,
      } = config.trailerFilename;

      const trailerId = { ...configTrailerId };

      const currentTrailerFilename = getFilenameFromField({
        record,
        fieldname: trailerFieldname,
      });

      if (currentTrailerFilename && !overwrite) {
        trailerFilename = currentTrailerFilename;
      }

      if (!trailerFilename || overwrite) {
        if (trailerId && trailerId.fieldname && !trailerId.value) {
          trailerId.value = getSystemId(
            record,
            config.trailerFilename,
            config.vendor
          );

          if (!record.getCellValueAsString(trailerId.fieldname)) {
            fieldsToUpdate[trailerId.fieldname] = trailerId.value;
          }
        }

        trailerFilename = config.trailerFilename.filenameFunction(record, {
          ...filenameProps,
          config: { ...config.trailerFilename, isTrailer: true, id: trailerId },
        });

        fieldsToUpdate[
          trailerFieldname
        ] = `${trailerConfigName} : ${trailerFilename}`;
      }

      row["Trailer Filename"] = trailerFilename;
    }

    if (filenameConfig.additionalFilenames) {
      switch (config.vendor) {
        case "Bluebox": {
          const additionalFilenames = getAdditionalBlueboxFilenames(record, {
            contentLanguages,
          });

          Object.assign(row, additionalFilenames);
          break;
        }
        case "Lufthansa Systems": {
          const additionalFilenames = lufthanasaAdditionalFilenames(
            record,
            contentLanguages,
            filenameConfig.additionalFilenames
          );

          Object.assign(row, additionalFilenames);
          break;
        }
      }
    }

    if (otherFields) {
      const otherColumns = mapOtherFields<LabGridRow>(record, otherFields, row);
      Object.assign(row, otherColumns);
    }
  }

  return {
    row,
    isValid,
    fieldsToUpdate,
    addedHeaders: addedHeaders,
  };
};

export default createLabGridRow;
