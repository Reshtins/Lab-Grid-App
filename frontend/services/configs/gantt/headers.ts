const commonHeaders = [
  "Asset",
  "Title",
  "Ep Title",
  "Season",
  "Ep#",
  "Prod Code",
  "Credit Start",
  "Actual Runtime",
  "Aspect",
  "Master Status",
  "Version",
  "Distributor",
  "Lab",
  "L1",
  "L2",
  "L3",
  "L4",
  "L5",
  "L6",
];

export const ganttHeaders = {
  QF: [
    ...commonHeaders,
    "Sub1",
    "Sub2",
    "Sub3",
    "PAC Filename eFX/eX1/eX2",
    "",
    "PAC Filename AD",
    "",
    "PAC Filename FHD",
    "",
    "PAC Filename HD",
    "",
    "PAC Filename eXW",
    "",
    "PAC Trailer Filename",
    "",
    "Viasat Filename",
    "",
    "Bluebox Filename",
  ],
  CI: [
    ...commonHeaders,
    "Sub1",
    "Sub2",
    "Sub3",
    "Sub4",
    "Sub5",
    "PAC Filename eX2",
    "",
    "PAC Filename eX3",
    "",
    "PAC Filename eXK",
    "",
    "PAC Filename S3K",
    "",
    "PAC Filename DMPES",
    "",
    "PAC Trailer Filename",
    "",
    "Immfly Filename",
    "",
    "Immfly Trailer Filename",
    "",
    "RAVE Filename",
    "",
    "RAVE Trailer Filename",
    "",
  ],
  GMF: [...commonHeaders, "Sub1", "Sub2", "Sub3", "Bluebox Wow Filename"],
  VA: [
    ...commonHeaders,
    "Sub1",
    "Sub2",
    "Sub3",
    "Pac Filename EXW",
    "",
    "",
    "LSY Boardconnect Filename",
    "",
    "",
    "LSY Boardconnect Trailer Filename",
  ],
  TG: [
    ...commonHeaders,
    "Sub1",
    "Sub2",
    "PAC Filename eX2",
    "",
    "PAC Filename S3K",
    "",
    "PAC Trailer Filename",
  ],
  ZL: [...commonHeaders],
};

export default ganttHeaders;