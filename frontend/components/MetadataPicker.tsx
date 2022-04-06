import React, { FC } from "react";
import { Box, Select } from "@airtable/blocks/ui";
import { Record } from "@airtable/blocks/models";

import { MetadataType } from "../types";
import { metadataPicks } from "../constants/metadata";
import { labConfigMap } from "../services/configs";
interface IProps {
  airline?: Record;
  value: MetadataType | "";
  totalFilenames: number;
  onChange: (newValue: MetadataType) => void;
}

const MetadataPicker: FC<IProps> = ({
  value,
  onChange,
  airline,
  totalFilenames,
}) => {
  const iata = airline?.getCellValueAsString("IATA Code") ?? null;

  const options = metadataPicks.filter(
    ({ value, configMap, isFilenameRequired }) => {
      if (value === "") return true;
      if (!iata) return false;
      const hasFilenames = totalFilenames > 0;

      if (value === MetadataType.Lab) {
        return labConfigMap[iata];
      } else if (hasFilenames && isFilenameRequired) {
        return configMap[iata];
      }
    }
  );

  return (
    <Box marginBottom={2}>
      <label>
        Select Grid Type
        <Select options={options} value={value} onChange={onChange} />
      </label>
    </Box>
  );
};

export default MetadataPicker;
