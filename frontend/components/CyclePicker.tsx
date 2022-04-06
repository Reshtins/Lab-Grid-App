import React from "react";
import { Box, Select, useBase, useRecords } from "@airtable/blocks/ui";
import { Record } from "@airtable/blocks/models";

interface IProps {
  airline: string;
  cycleId: string;
  onChange: (newId: string, newName: string) => void;
}

const initalOptions = [{ label: "No cycle selected", value: "" }];

const CyclePicker: React.FC<IProps> = ({ airline, cycleId, onChange }) => {
  const base = useBase();
  const cyclesTable = base.getTableByName("Programming Cycles");
  const view = cyclesTable.getViewByName("All Cycles");
  const records = useRecords(view, { fields: ["Airline"] });
  const recordMap = new Map<string, Record>();

  const cycleOptions = records
    ? records.reduce(
        (acc, cur) => {
          const currentAirline = cur.getCellValue("Airline");
          if (currentAirline && currentAirline[0].id === airline) {
            acc.push({ value: cur.id, label: cur.name });
            recordMap.set(cur.id, cur);
          }
          return acc;
        },
        [...initalOptions]
      )
    : [...initalOptions];
  const handleChange = (id: string) =>
    onChange(id, recordMap.has(id) ? recordMap.get(id).name : "");

  return (
    <Box marginBottom={2}>
      <label>
        Select Programming Cycle
        <Select
          options={
            !airline
              ? [{ label: "Please select airline first", value: "" }]
              : cycleOptions
          }
          value={cycleId}
          onChange={handleChange}
          disabled={!airline}
        />
      </label>
    </Box>
  );
};

export default CyclePicker;
