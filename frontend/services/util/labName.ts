import { FormatterFunction } from "../../types";

export const getTvLabName: FormatterFunction<null> = ({ record }) =>
  record.getCellValueAsString("Distributor") === "Warner Bros"
    ? "The Hub"
    : "Stellar";
