import { GridProps, RaveCtrRow } from "../../../types";

const createRaveGuiRow = (args: GridProps) => {
  const { contentRecords } = args;

  return contentRecords.reduce((csvRow: RaveCtrRow[], record) => {
    return csvRow;
  }, []);
};
export default createRaveGuiRow;
