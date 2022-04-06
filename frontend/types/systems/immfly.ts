import { CsvFieldMap, SystemConfig } from "../configs";
import { CsvColumnMap, CsvHeader } from "../csv";

export interface ImmflyRow {
  "Languages/translations": string;
  title: string;
  episode_title: string;
  season_number: string;
  episode_number: string;
  genre: string;
  running_time: string;
  rating: string;
  age_restriction: string;
  filename: string;
  "new/holdover": string;
  start_date: string;
  end_date: string;
  country: string;
  director_name: string;
  cast: string;
  synopsis: string;
  title_year: string;
  languages: string;
  subtitles: string;
  embedded_subtitles: string;
  ID: string;
}

export interface ImmflySystemConfig extends SystemConfig<ImmflyRow> {
  languages: CsvColumnMap<ImmflyFieldMap>[];
}

export type ImmflyHeader = CsvHeader<ImmflyRow>[];

export type ImmflyFieldMap = CsvFieldMap<ImmflyRow>;

export interface ImmflyConfigMap {
  [iata: string]: {
    systems: ImmflySystemConfig[];
    columnMap: CsvColumnMap<ImmflyFieldMap>;
  };
}
