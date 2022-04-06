import React from "react";
import { Box, Switch, Text, Tooltip } from "@airtable/blocks/ui";

interface Props {
  onOverwriteChange: (v: boolean) => void;
  overwrite: boolean;

  onCsvOnlyChange: (v: boolean) => void;
  isCsvOnly: boolean;
}

const LabGridOption = ({
  onOverwriteChange,
  overwrite,
  onCsvOnlyChange,
  isCsvOnly,
}: Props) => (
  <Box marginBottom={2}>
    <Text>Lab grid options</Text>
    <Box display="flex">
      <Box flex={1} paddingRight={2}>
        <Tooltip
          content="Overwrites all filenames for the cycle (ACTION NOT REVERSIBLE)"
          placementX={Tooltip.placements.CENTER}
          placementY={Tooltip.placements.BOTTOM}
          shouldHideTooltipOnClick={true}
        >
          <Switch
            value={overwrite}
            onChange={(v) => onOverwriteChange(v)}
            label="Overwrite filenames?"
          />
        </Tooltip>
      </Box>
      <Box flex={1}>
        <Tooltip
          content="Genereate CSV only, do not insert filenames into the programnming table"
          placementX={Tooltip.placements.CENTER}
          placementY={Tooltip.placements.BOTTOM}
          shouldHideTooltipOnClick={true}
        >
          <Switch
            value={isCsvOnly}
            onChange={(v) => onCsvOnlyChange(v)}
            label="CSV only?"
          />
        </Tooltip>
      </Box>
    </Box>
  </Box>
);

export default LabGridOption;
