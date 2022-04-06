import { Record } from "@airtable/blocks/models";
import {
  ContentLanguageMaps,
  LabGridRow,
  SystemConfig,
  WestLabGridColumns,
} from "../../../types";
import { defaultWestRow, westColumnMap } from "../../configs/labgrid/west";
import { gridMapper } from "../../util";

interface LabGridFilenameProps {
  rowNum: number;
  labRow: LabGridRow;
  record: Record;
  config: SystemConfig;
  contentLanguages: ContentLanguageMaps;
}

const createWestLabGridRow = (props: LabGridFilenameProps) => {
  const { config, record, labRow } = props;
  // westLabGridColumns;

  const westRow = gridMapper<WestLabGridColumns>(
    record,
    westColumnMap,
    defaultWestRow
  );

  westRow["Aspect Ratio"] = labRow["Aspect Ratio"];
  westRow["Filename"] = labRow["Movie Filename"];
  westRow["Hardware Vendor"] = config.vendorLongName ?? config.vendor;

  config.filenameConfig.fileFormat;
};

export default createWestLabGridRow;
