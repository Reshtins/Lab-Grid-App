import { LabGridFilenameArgs, LabGridRow } from "../../../types";

const createLabTvRow = (args: LabGridFilenameArgs): LabGridRow => {
  const { columns, rowNum, contentLanguages } = args;

  const row: LabGridRow = {
    ...columns,
    No: `${rowNum}`,
    Delivery: "Smartjog",
  };

  contentLanguages.audio.forEach((audio, key) => {
    if (audio) {
      const rowKey = `Language ${key}`;
      row[rowKey] = audio.name;
    }
  });

  contentLanguages.subs.forEach((audio, key) => {
    if (audio) {
      const rowKey = `Subtitle ${key}`;
      row[rowKey] = audio.name;
    }
  });

  return row;
};

export default createLabTvRow;
