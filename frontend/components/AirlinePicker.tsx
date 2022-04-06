import React from "react";
import { Box, Select, useRecords } from "@airtable/blocks/ui";
import { Table } from "@airtable/blocks/models";
import { labGridAirlineList } from "../services/configs";

interface IProps {
  value: string;
  table: Table;
  onChange: (newValue: string) => void;
}

const initalOptions = { label: "No airline selected", value: "" };

const AirlinePicker: React.FC<IProps> = ({ onChange, value, table }) => {
  const view = table.getViewByName("IATA");
  const fields = table.getFieldByName("IATA Code");
  const queryResult = view.selectRecords({ fields: [fields] });
  const records = useRecords(queryResult);

  const options = [
    initalOptions,
    ...records.reduce((list, record) => {
      const iata = record.getCellValueAsString("IATA Code");

      if (labGridAirlineList.includes(iata)) {
        list.push({
          value: record.id,
          label: `${iata} - ${record.name}`,
        });
      }

      return list;
    }, []),
  ];

  const handleChange = (value: string) => onChange(value);

  return (
    <Box marginBottom={2}>
      <label>
        Select an airline
        <Select
          value={value}
          options={options}
          onChange={handleChange}
          marginTop={1}
        />
      </label>
    </Box>
  );
};

export default AirlinePicker;
