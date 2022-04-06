import { CsvBuilder } from "../../../types";

const createAvantGrid: CsvBuilder = (gridProps) => {
  const {} = gridProps;

  return {
    csvItemCount: 0,
    csvOutput: [],
    headers: [],
    listToUpdate: [],
  };
};

export default createAvantGrid;
