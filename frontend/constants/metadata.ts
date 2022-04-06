import {
  pacConfigMap,
  labConfigMap,
  ganttConfigMap,
  blueboxConfig,
  viasatConfig,
  immflyConfig,
  raveConfig,
} from "../services/configs";
import { MetadataPick, MetadataType } from "../types";

export const metadataPicks: MetadataPick[] = [
  { label: "No grid type selected", value: "" },
  { label: "Lab Grid", value: MetadataType.Lab, configMap: labConfigMap },
  {
    label: "PAC MMA",
    value: MetadataType.Pac,
    configMap: pacConfigMap,
    isFilenameRequired: true,
  },
  {
    label: "Gantt Chart",
    value: MetadataType.Gantt,
    configMap: ganttConfigMap,
    isFilenameRequired: true,
  },
  {
    label: "Viasat Metadata",
    value: MetadataType.Viasat,
    configMap: viasatConfig,
  },
  {
    label: "Bluebox Metadata",
    value: MetadataType.BlueboxMeta,
    configMap: viasatConfig,
    isFilenameRequired: true,
  },
  {
    label: "Bluebox Grid",
    value: MetadataType.BlueboxGrid,
    configMap: blueboxConfig,
    isFilenameRequired: true,
  },
  {
    label: "Immfly",
    value: MetadataType.Immfly,
    configMap: immflyConfig,
    isFilenameRequired: true,
  },
  {
    label: "Rave Media",
    value: MetadataType.RaveMedia,
    configMap: raveConfig,
    isFilenameRequired: true,
  },
  {
    label: "Rave CTR",
    value: MetadataType.RaveCtr,
    configMap: raveConfig,
    isFilenameRequired: true,
  },
  {
    label: "Rave MediaGuiLangAttr",
    value: MetadataType.RaveGui,
    configMap: raveConfig,
    isFilenameRequired: true,
  },
];
