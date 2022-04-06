import { PacMetadataFunction } from "../../../types";
import {
  flattenCellAsString,
  getFilenameFromField,
} from "../../util/fieldParsers";
import { execFieldSearchList } from "../../util/search";

const pacMetadata: PacMetadataFunction = ({
  record,
  rowConfig,
  rowNum,
  metadata,
  systemRow,
}) => {
  systemRow["Your Ref"] = `${rowNum}`;
  systemRow["Metadata Language"] = metadata.language;
  let title = "";
  if (typeof metadata.titleField === "string") {
    title = record.getCellValueAsString(metadata.titleField);
  } else {
    const { calculations } = metadata.titleField;
    const { search } = calculations;

    if (calculations.search) {
      title = execFieldSearchList(record, search);
    }

    if (!title) {
      title = flattenCellAsString({
        record,
        fieldname: calculations.pixlField,
      });
    }
  }

  systemRow["Title"] = title;
  systemRow["Release Title"] = title;
  systemRow["Short Title"] = title;

  if (rowConfig && rowConfig.trailerFilename) {
    const trailer = getFilenameFromField({
      record,
      fieldname: rowConfig.trailerFilename.fieldname,
    });
    systemRow["Trailer Filename"] = trailer;
  }

  return systemRow;
};

export default pacMetadata;
