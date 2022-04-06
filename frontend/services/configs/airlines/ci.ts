import { LabGridRow, SystemConfig } from "../../../types";
import immFilename from "../../filenames/immifly";
import createPacFilename from "../../filenames/pac";
import ravFilename from "../../filenames/ravFilename";
import { classicFileFormat } from "../../formatters/fileFormat";
import { defaultSystemMap, immflyPresets, pacPresets } from "./filenamePresets";

export const ciSystems: SystemConfig<LabGridRow>[] = [
  {
    systemName: "PAC EX2",
    vendor: "Panasonic",
    oemSystems: ["eX2"],
    filenameConfig: {
      ...pacPresets.sd,
      fieldname: "Filename 1",
      configName: "PAC EX2",
      oemSearch: {
        Film: [
          { queries: [{ find: "eX2" }] },
          { fieldname: "Type", queries: [{ isNot: "Classic" }] },
        ],
        TV: [],
      },
      filenameFunction: createPacFilename,
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "PAC EX3",
    vendor: "Panasonic",
    oemSystems: ["eX3"],
    filenameConfig: {
      ...pacPresets.hd,
      fieldname: "Filename 2",
      configName: "PAC EX3",
      oemSearch: {
        Film: [
          { queries: [{ find: "eX3" }] },
          { fieldname: "Type", queries: [{ isNot: "Classic" }] },
        ],
        TV: [],
      },
    },
    systemMap: defaultSystemMap,
  },

  {
    systemName: "PAC EX2 TV",
    vendor: "Panasonic",
    oemSystems: ["eX2", "eX3", { name: "DMPES", checkOem: true }],
    filenameConfig: {
      ...pacPresets.hd,
      fieldname: "Filename 1",
      aspect: "16x9",
      configName: "PAC EX2",
      fileFormat: "SD, MPEG4, 1.5Mbps",
      oemSearch: {
        Film: [],
        TV: [{ queries: [{ find: /eX2|ex3/gi }] }],
      },
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "PAC EXK",
    vendor: "Panasonic",
    oemSystems: ["eXK"],
    filenameConfig: {
      ...pacPresets.sd,
      configName: "PAC eXK",
      id: { value: "1" },
      aspect: "4x3",
      fieldname: "Filename 3",
      oemSearch: {
        Film: [
          { queries: [{ find: "eXK" }] },
          { fieldname: "Type", queries: [{ find: "Classic" }] },
        ],
        TV: [],
      },
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "PAC S3K",
    vendor: "Panasonic",
    oemSystems: ["S3k"],
    filenameConfig: {
      ...pacPresets.sd,
      fieldname: "Filename 4",
      configName: "PAC S3K",
      aspect: "4x3",
      extension: "m1.mpg",
      oemSearch: {
        Film: [{ queries: [{ find: "S3000i" }] }],
        TV: [],
      },
    },
    trailerFilename: {
      ...pacPresets.tr,
      fieldname: "Filename 8",
      configName: "PAC TR1",
      extension: "m1.mpg",
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "PAC eXK TV",
    vendor: "Panasonic",
    oemSystems: ["eXK", "S3k"],
    filenameConfig: {
      ...pacPresets.sd,
      fieldname: "Filename 4",
      configName: "PAC S3K",
      aspect: "4x3",
      extension: "m1.mpg",
      oemSearch: {
        Film: [],
        TV: [{ queries: [{ find: /eXK|S3k/gi }] }],
      },
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "Imm MP4",
    vendor: "Immifly",
    oemSystems: ["Immfly"],
    filenameConfig: {
      ...immflyPresets.sd,
      fieldname: "Filename 5",
      configName: "Imm MP4",
    },
    trailerFilename: {
      configName: "Imm TR1",
      fieldname: "Filename 9",
      filenameFunction: immFilename,
      extension: "_TR.mp4",
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "Saf RAV",
    vendor: "Safran",
    oemSystems: ["RAVE"],
    filenameConfig: {
      configName: "Saf RAV",
      fieldname: "Filename 6",
      oemSearch: [{ queries: [{ find: "RAVE" }] }],
      extension: ".mp4",
      fileFormat: classicFileFormat,
      shipping: "Safran Passenger Innovations (Brea)",
      filenameFunction: ravFilename,
      delivery: "Smartjog",
    },
    trailerFilename: {
      configName: "Saf TR1",
      fieldname: "Filename 10",
      filenameFunction: ravFilename,
      extension: "_TR.mp4",
    },
    systemMap: defaultSystemMap,
  },
  {
    systemName: "PAC DMP",
    vendor: "Panasonic",
    oemSystems: ["DMPES"],
    filenameConfig: {
      ...pacPresets.sd,
      oemSearch: [{ queries: [{ find: "DMPES" }] }],
      id: { value: "2" },
      configName: "PAC DMP",
      fieldname: "Filename 7",
    },
    systemMap: [
      ...defaultSystemMap,
      {
        csvColumnName: "Language 3",
        value: "",
      },
      {
        csvColumnName: "Language 4",
        value: "",
      },
      {
        csvColumnName: "Language 5",
        value: "",
      },
      {
        csvColumnName: "Language 6",
        value: "",
      },
    ],
  },
];
