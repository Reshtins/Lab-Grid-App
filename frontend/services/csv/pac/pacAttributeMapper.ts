import { Record } from "@airtable/blocks/models";
import { PacAttributeColumn, PacAttributesMap, PacMmaRow } from "../../../types";
import { flattenCellAsString } from "../../util/fieldParsers";
import { execFieldSearchList } from "../../util/search";

interface PacAttributesMapperProps {
  record: Record;
  row: PacMmaRow;
  attributes: PacAttributesMap;
}
const pacAttributeMapper = (props: PacAttributesMapperProps) => {
  const { record, row, attributes } = props;
  const newColumns = { ...row };

  const programmingType = record.getCellValueAsString("Programming");

  const addColumns = (a: PacAttributeColumn[]) => {
    if (a) a.map(callback);
  };

  const callback = (v: PacAttributeColumn) => {
    const key = `Attribute ${v.number}`;

    newColumns.Attributes[key] = {
      Name: v.name,
      Value: v.value ?? "",
    };

    if (v.search) {
      const value = execFieldSearchList(record, v.search);

      if (value) {
        newColumns.Attributes[key].Value = value;
      }
    } else if (v.pixlFieldname) {
      newColumns.Attributes[key].Value = flattenCellAsString({
        record,
        fieldname: v.pixlFieldname,
      });
    }
  };

  addColumns(attributes.shared);

  switch (programmingType) {
    case "Film":
      addColumns(attributes.film);
      break;
    case "TV":
      addColumns(attributes.tv);
      break;
  }

  return newColumns;
};

export default pacAttributeMapper;
