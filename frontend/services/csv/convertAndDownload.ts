import { parseAsync } from "json2csv";

interface csvProps {
  csvData: any[];
  reportName: string;
  headers?: string[];
}

const convertToCsv = ({ csvData, reportName, headers }: csvProps) =>
  new Promise<{ csvFilename: string; csv: string }>((resolve, reject) => {
    const opts = { fields: headers ?? [], includeEmptyRows: true };

    parseAsync(csvData, opts).then((csv = "") => {
      const csvFilename = `${reportName}.csv`;

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", csvFilename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      resolve({ csvFilename, csv });
    });
  });

export default convertToCsv;
