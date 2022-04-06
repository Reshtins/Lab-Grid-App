import React, { FC } from "react";
import { Box, Select } from "@airtable/blocks/ui";
import { ProgrammingType } from "../types";

const reportTypePicks: { label: string; value: ProgrammingType | "" }[] = [
  { label: "No media type selected", value: "" },
  { label: "Films", value: "Film" },
  { label: "TV", value: "TV" },
];

interface IProps {
  value: string;
  onChange: (newValue: string) => void;
}

const ReportTypePicker: FC<IProps> = ({ value: value, onChange }) => {
  return (
    <Box marginBottom={2}>
      <label>
        Programming Type
        <Select options={reportTypePicks} value={value} onChange={onChange} />
      </label>
    </Box>
  );
};

export default ReportTypePicker;
