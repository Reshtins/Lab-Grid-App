import { CsvFieldMap, FilenamePreset, LabGridRow } from "../../../types";
import createWowFilename from "../../filenames/bluebox";
import immFilename from "../../filenames/immifly";
import intelsatFilename from "../../filenames/intelsat";
import lufthansaFilename, {
  lufthansaMezzanineFilename,
} from "../../filenames/lufthansa";
import createPacFilename from "../../filenames/pac";
import thalesFilename from "../../filenames/thales";
import { createViasatFilename } from "../../filenames/viasat";
import { classicFileFormat } from "../../formatters/fileFormat";
import { getRowNumber } from "../../util";

export const defaultSystemMap: CsvFieldMap<LabGridRow>[] = [
  {
    csvColumnName: "No",
    formatFunction: getRowNumber,
    pixlFieldName: "Sequence",
  },
  {
    csvColumnName: "Vendor",
    systemValue: "vendor",
  },
  {
    csvColumnName: "System",
    systemValue: "oemSystems",
  },
  {
    csvColumnName: "File Format",
    systemValue: "filenameConfig",
    filenameKey: "fileFormat",
  },
  {
    csvColumnName: "Delivery",
    systemValue: "filenameConfig",
    filenameKey: "delivery",
  },
  {
    csvColumnName: "Shipping To",
    systemValue: "filenameConfig",
    filenameKey: "shipping",
  },
  {
    csvColumnName: "Movie Filename",
    filename: true,
  },
  {
    csvColumnName: "Trailer Filename",
    trailerFilename: true,
  },
];

export const pacPresets: FilenamePreset = {
  sd: {
    fieldname: "",
    configName: "PAC SD1",
    fileFormat: "SD, MPEG4, 1.5Mbps",
    encoding: "MPEG4",
    bitrate: "1.5Mbps",
    quality: "SD",
    extension: "m4.mpg",
    delivery: "Smartjog",
    shipping: "Panasonic Avionics Corporation (CLoud)",
    filenameFunction: createPacFilename,
  },
  fhd: {
    fieldname: "",
    configName: "PAC FHD",
    extension: "h8.mpg",
    fileFormat: "FHD, MPEG4, 6.0Mbps",
    encoding: "MPEG4",
    bitrate: "6.0Mbps",
    quality: "FHD",
    delivery: "Smartjog",
    shipping: "Panasonic Avionics Corporation (CLoud)",
    filenameFunction: createPacFilename,
  },
  hd: {
    fieldname: "",
    configName: "PAC 7HD",
    extension: "h7.mpg",
    delivery: "Smartjog",
    encoding: "MPEG4",
    quality: "HD",
    bitrate: "4.0Mbps",
    shipping: "Panasonic Avionics Corporation (CLoud)",
    fileFormat: "HD, MPEG4, 4.0Mbps",
    filenameFunction: createPacFilename,
  },
  exw: {
    fieldname: "",
    configName: "PAC EXW",
    encoding: "eXW",
    bitrate: "2.2Mbps",
    quality: "",
    extension: "z4.mpg",
    fileFormat: "eXW, Variable Bitrate",
    delivery: "Smartjog",
    shipping: "Panasonic Avionics Corporation (CLoud)",
    filenameFunction: createPacFilename,
  },
  tr: {
    fieldname: "",
    configName: "PAC Tr1",
    extension: "m4.mpg",
    encoding: "MPEG4",
    bitrate: "1.5Mbps",
    quality: "SD",
    isTrailer: true,
    filenameFunction: createPacFilename,
  },
};

export const thalesPresets: FilenamePreset = {
  sd: {
    fieldname: "",
    configName: "",
    extension: "m4.mpg",

    fileFormat: "SD, MPEG4, 1.5Mbps",
    delivery: "Smartjog",
    shipping: "ThalesAvionics Airline Content (Irvine)",
    filenameFunction: thalesFilename,
  },
};

export const lufthansaPreset: FilenamePreset = {
  bcn: {
    fieldname: "",
    configName: "LSY BCN",
    extension: ".mp4",
    fileFormat: "MPEG-DASH",
    delivery: "Smartjog",
    shipping: "CastLabs",
    filenameFunction: lufthansaFilename,
  },
  mez: {
    fieldname: "",
    configName: "LSY BCN",
    extension: ".mp4",
    fileFormat: "BoardConnect Mezzanine",
    delivery: "Expedat",
    shipping: "CastLabs",
    filenameFunction: lufthansaMezzanineFilename,
  },
};

export const blueboxPresets: FilenamePreset = {
  sd: {
    fieldname: "",
    configName: "Blu Wow",

    fileFormat: "MP4",
    extension: ".mp4",
    isDub: false,
    filetype: "lab",
    delivery: "Smartjog",
    shipping: "Bluebox Aviation Systems Ltd. (Dunfermline)",
    additionalFilenames: true,
    filenameFunction: createWowFilename,
  },
};

export const viasatPreset: FilenamePreset = {
  sd: {
    fieldname: "",
    configName: "Via WIF",
    fileFormat: "MP4, VBR 900kb/s",
    extension: ".mp4",
    delivery: "Aspera",
    shipping: "VIASAT",
    filenameFunction: createViasatFilename,
  },
};

export const immflyPresets: FilenamePreset = {
  sd: {
    fieldname: "",
    configName: "Imm MP4",
    extension: ".mp4",
    fileFormat: classicFileFormat,
    delivery: "Smartjog",
    shipping: "QuiverTree Media (Andorra)",
    filenameFunction: immFilename,
  },
};

export const intelsatPreset: FilenamePreset = {
  sd: {
    configName: "Int Gog",
    extension: ".mp4",
    fieldname: "",
    aspect: "16x9",
    fileFormat: "SD, MPEG4, 1.5Mbps",
    oemSearch: [{ queries: [{ find: "Intelsat Gogo" }] }],
    delivery: "IBM Aspera",
    shipping: "Intelsat Gogo",
    filenameFunction: intelsatFilename,
  },
};
