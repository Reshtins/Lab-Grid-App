import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  initializeBlock,
  Text,
  useBase,
  useCursor,
  useLoadable,
  useRecordById,
  useRecords,
} from "@airtable/blocks/ui";

import AirlinePicker from "./components/AirlinePicker";
import CyclePicker from "./components/CyclePicker";
import MetadataPicker from "./components/MetadataPicker";
import ReportTypePicker from "./components/ReportTypePicker";
import LabGridOption from "./components/LabGridOptions";

import {
  DEFAULT_SETTINGS,
  LANGUAGE_FIELDS,
  TABLE_NAMES,
} from "./constants/fields";

import createCsv from "./services/csv/createCsv";
import { getProgrammingFields } from "./services/util";

import { MetadataType, ProgrammingType, UserSettings } from "./types";

function Index() {
  // State
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [message, setMessage] = useState<string[]>([]);

  const isValid =
    settings.airlineId &&
    settings.cycle &&
    settings.programmingType &&
    settings.metadataType !== "" &&
    settings.status === "idle";

  const { linkedField, programmingFields } = getProgrammingFields(
    settings.programmingType
  );

  // Cursors & records
  const base = useBase();
  const cursor = useCursor();
  useLoadable(cursor);

  const cursorTableId = cursor.activeTableId;

  // Tables
  const airlineTable = base.getTableByName(TABLE_NAMES.airline);
  const cyclesTable = base.getTableByName(TABLE_NAMES.cycle);
  const languageTable = base.getTableByName(TABLE_NAMES.languages);
  const csvFileTable = base.getTableByName(TABLE_NAMES.csv);
  const distributorsTable = base.getTableByName(TABLE_NAMES.distributors);

  const filmProgrammingTable = base.getTableByName(
    TABLE_NAMES.filmsProgramming
  );
  const tvProgrammingTable = base.getTableByName(TABLE_NAMES.tvProgramming);

  // Views
  const languageView = languageTable.getView("ISO Only");
  const pacDistributorsView = distributorsTable.getViewByName("PAC MMA");

  // Records
  const selectedAirlineRecord = useRecordById(airlineTable, settings.airlineId);
  const selectedCycleRecord = useRecordById(cyclesTable, settings.cycle.id);
  const pacDistributorRecords = useRecords(pacDistributorsView);
  const languageRecords = useRecords(languageView, {
    fields: LANGUAGE_FIELDS,
  });

  const programmingRecordQuery =
    selectedCycleRecord && linkedField
      ? selectedCycleRecord.selectLinkedRecordsFromCell(linkedField, {
          fields: programmingFields,
          sorts: [
            {
              field: "Sequence",
              direction: "asc",
            },
          ],
        })
      : null;

  const programmingRecords = useRecords(programmingRecordQuery);

  const totalFilenames = programmingRecords?.reduce((total: number, rec) => {
    for (let index = 1; index <= 10; index++) {
      if (rec.getCellValueAsString(`Filename ${index}`)) {
        total++;
      }
    }
    return total;
  }, 0);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prevState) => ({ ...prevState, ...newSettings }));
  };

  // Handlers
  const handleAirlineChange = (value: string) => {
    updateSettings({
      airlineId: value,
      cycle: { id: "", name: "" },
      metadataType: "",
    });
  };

  const handleAppendMessage = (newLine: string) =>
    setMessage((prevMessage) => [...prevMessage, newLine]);

  const displayTotalFilenames = () => {
    if (settings.programmingType && settings.cycle.id) {
      setMessage([
        `Filenames found in ${settings.cycle.name} ${settings.programmingType} = ${totalFilenames}`,
      ]);
    } else {
      setMessage([]);
    }
  };

  const handleCycleChange = (id: string, name: string) =>
    updateSettings({ cycle: { id, name } });
  const handleGridChange = (value: MetadataType) =>
    updateSettings({ metadataType: value });
  const handleReportChange = (value: ProgrammingType) =>
    updateSettings({ programmingType: value });
  const setOverwriteMode = (value: boolean) =>
    updateSettings({ overwrite: value });
  const setCsvOnlyMode = (value: boolean) => updateSettings({ csvOnly: value });

  const onClickStart = async (logOnly = false) =>
    createCsv({
      filmProgrammingTable,
      tvProgrammingTable,
      csvFileTable,
      logOnly,
      programmingRecords,
      airlineRecord: selectedAirlineRecord,
      languageRecords,
      cycleRecord: selectedCycleRecord,
      settings,
      pacDistributorRecords,
      settingsCallback: updateSettings,
      handleAppendMessage,
    });

  // Effects
  useEffect(() => {
    const cursorRecordId = cursor.selectedRecordIds[0];

    if (cursorRecordId) {
      switch (cursorTableId) {
        case airlineTable.id: {
          updateSettings({
            airlineId: cursorRecordId,
            cycle: { id: "", name: "" },
          });

          break;
        }
        case cyclesTable.id: {
          const cyclesReq = cyclesTable.selectRecords();
          const rec = cyclesReq.getRecordById(cursorRecordId);
          const cursorAirline = rec.getCellValue("Airline")[0];

          updateSettings({
            cycle: {
              id: cursorAirline ? cursorRecordId : "",
              name: "",
            },
            airlineId: cursorAirline ? cursorAirline.id : "",
          });

          cyclesReq.unloadData();
          break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    displayTotalFilenames();
  }, [settings.cycle, settings.programmingType]);

  return (
    <Box padding={2}>
      <AirlinePicker
        value={settings.airlineId}
        table={airlineTable}
        onChange={handleAirlineChange}
      />
      <CyclePicker
        airline={settings.airlineId}
        cycleId={settings.cycle.id}
        onChange={handleCycleChange}
      />
      <ReportTypePicker
        value={settings.programmingType}
        onChange={handleReportChange}
      />
      <MetadataPicker
        value={settings.metadataType}
        onChange={handleGridChange}
        airline={selectedAirlineRecord}
        totalFilenames={totalFilenames}
      />
      {settings.metadataType === MetadataType.Lab && (
        <LabGridOption
          overwrite={settings.overwrite}
          isCsvOnly={settings.csvOnly}
          onCsvOnlyChange={setCsvOnlyMode}
          onOverwriteChange={setOverwriteMode}
        />
      )}
      <Box>
        <Button
          width="100%"
          onClick={() => onClickStart()}
          disabled={!isValid}
          variant="primary"
        >
          Start
        </Button>

        {process.env.NODE_ENV === "development" && (
          <Button
            width="100%"
            marginTop={2}
            onClick={() => onClickStart(true)}
            disabled={!isValid}
          >
            Log only
          </Button>
        )}
      </Box>
      <Box paddingY={2}>
        <ol>
          {message.map((line, index) => (
            <Text key={index} as="li">
              {line}
            </Text>
          ))}
        </ol>
      </Box>
    </Box>
  );
}

initializeBlock(() => <Index />);
