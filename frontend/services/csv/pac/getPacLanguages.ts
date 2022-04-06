import { Record } from "@airtable/blocks/models";
import { PacMmaRow, PacSystemConfig } from "../../../types";
import { PAC_MAX_SOUNDTRACKS, PAC_MAX_SUBTITLES } from "../../configs/pac/headers";

export const getPacAudio = (props: {
  record: Record;
  config: PacSystemConfig;
}) => {
  const { record, config } = props;
  const { filenameConfig, maxSoundtracks = PAC_MAX_SOUNDTRACKS } = config;
  const isADSystem = filenameConfig.configName.includes("PAC AD");
  const pidNo = 48;

  const audioCells: PacMmaRow["Soundtracks"] = {};

  for (let a = 1; a <= PAC_MAX_SOUNDTRACKS; a++) {
    const audio = record.getCellValueAsString("Audio " + a);
    const key = `Soundtrack ${a}`;
    audioCells[key] = {
      PID: "",
      Language: "",
      "Encoding Type": "",
      Encoding: "",
      Encrypted: "",
      Sequence: "",
      Type: "",
    };

    if (audio || a <= maxSoundtracks) {
      let audioType = "";

      if (a === 1) {
        audioType = "Dialog";
      } else {
        switch (record.getCellValueAsString(`Audio ${a} Type`)) {
          case "Spoken":
            audioType = "Dialog";
            break;
          case "Descriptive Audio":
            if (!isADSystem) audioType = "Description";
            break;
          case "Commentary":
            audioType = "Commentary";
            break;
        }
      }

      if (audioType && a < 10) {
        audioCells[key] = {
          PID: `${pidNo + a}`,
          Language: audio,
          "Encoding Type": "MP3",
          Encoding: "Stereo",
          Encrypted: "No",
          Sequence: `${a}`,
          Type: audioType,
        };
      }
    }
  }

  return audioCells;
};

export const getPacSubtitles = (props: {
  record: Record;
  config?: PacSystemConfig;
  pidNo?: number;
}) => {
  const { record, pidNo = 59, config } = props;
  const subtitleCells: PacMmaRow["Subtitles"] = {};

  // const maxLanguages = PAC_MAX_SUBTITLES;

  for (let s = 1; s <= PAC_MAX_SUBTITLES; s++) {
    const key = `Subtitle ${s}`;
    let subtitleType = "";
    const subtitle = record.getCellValueAsString(`Sub/CC ${s}`);

    subtitleCells[key] = {
      Language: "",
      PID: "",
      Sequence: "",
      Type: "",
    };
    if (config.noSubtitles) {
      continue;
    }

    switch (record.getCellValueAsString(`Subtitle ${s} Type`)) {
      case "Embedded":
        subtitleType = "embedded";
        break;
      case "Dynamic Sub":
        subtitleType = "subtitle";
        break;
      case "ClosedCaption":
        subtitleType = "closedCaption";
        break;
    }
    subtitleCells[key] = {
      Language: subtitle,
      PID: `${pidNo + s}`,
      Sequence: `${s}`,
      Type: subtitleType,
    };
  }

  return subtitleCells;
};
