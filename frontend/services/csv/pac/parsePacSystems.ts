import { Record } from "@airtable/blocks/models";

import {
  getFilenameFromField,
  getOemEndDate,
  execFieldSearchList,
  getOemSystems,
  appendOtherRows,
} from "../../util";
import { getPacAudio, getPacSubtitles } from "./getPacLanguages";
import { FieldSearch, PacMmaRow, PacSystemConfig } from "../../../types";

/**
 * @interface PacSystemParserProps
 * @record the current record in the programming table
 * @rowConfig  SystemConfig
 * @oemSystems All oem systems in the programming record
 * @programmingType TV or Film
 * @row  PacMmaColumns;
 */
interface PacSystemParserProps {
  record: Record;
  rowConfig: PacSystemConfig;
  oemSystems: ReturnType<typeof getOemSystems>;
  programmingType: string;
  row: PacMmaRow;
}

const createPacSystemRow = (props: PacSystemParserProps) => {
  const { record, rowConfig, oemSystems, programmingType, row } = props;

  const { filenameConfig, getAllSystems, otherFields, trailerFilename } =
    rowConfig;
  const { oemSearch, fieldname, encoding, bitrate } = filenameConfig;
  const { recordOems } = oemSystems;

  if (oemSearch) {
    const searchList: FieldSearch[] = Array.isArray(oemSearch)
      ? oemSearch
      : oemSearch[programmingType];

    const oemData = execFieldSearchList(
      record,
      searchList,
      recordOems,
      getAllSystems
    );

    if (oemData && oemData.length) {
      row["System"] = oemData;
      row["Filename"] = getFilenameFromField({ record, fieldname });

      if ("fieldname" in trailerFilename) {
        row["Trailer Filename"] = getFilenameFromField({
          record,
          fieldname: trailerFilename.fieldname,
        });
      }

      row["Encoding"] = encoding;
      row.Bitrate = bitrate;

      row["End Date"] = getOemEndDate({
        record,
        systemConfig: rowConfig,
        fieldname: [
          "OEM System 1",
          "OEM System 2",
          "OEM System 3",
          "OEM System 4",
        ],
      });

      row.Soundtracks = getPacAudio({ record, config: rowConfig });
      row.Subtitles = getPacSubtitles({ record, config: rowConfig });

      if (otherFields) {
        const otherFieldSearch = Array.isArray(otherFields)
          ? otherFields
          : otherFields[programmingType];
        return {
          ...appendOtherRows<PacMmaRow>(record, otherFieldSearch, row),
        };
      }

      return { ...row };
    }
  }

  return null;
};

export default createPacSystemRow;
