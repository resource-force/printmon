// HACK: Since CRA doesn't support importing TypeScript from other lerna
// packages, we just inline the types here from the server.
// Follow PR https://github.com/facebook/create-react-app/pull/6599.

export enum MeterTypes {
  TOTAL_UNITS_OUTPUT = "Impression.AllMeterTypes.AllFunctions.AllSides.AllPageSizes",
  TOTAL_MONO_UNITS_OUTPUT = "Impression.Mono.AllFunctions.AllSides.AllPageSizes",
  TOTAL_COLOR_UNITS_OUTPUT = "Impression.Color.AllFunctions.AllSides.AllPageSizes",
  TOTAL_SCAN_UNITS = "Impression.AllMeterTypes.Scan.AllSides.AllPageSizes",
  TOTAL_PRINT_UNITS = "Impression.AllMeterTypes.Print.AllSides.AllPAgeSizes",
  TOTAL_COPIER_UNITS = "Impression.AllMeterTypes.Copy.AllSides.AllPAgeSizes",
  DUPLEX = "Impression.AllMeterTypes.AllFunctions.Duplex.AllPageSizes"
}

export type HistoricalTotals = {
  [date: string]: {
    [MeterTypes.TOTAL_UNITS_OUTPUT]: number;
    [MeterTypes.DUPLEX]: number;
    [MeterTypes.TOTAL_COPIER_UNITS]: number;
    [MeterTypes.TOTAL_PRINT_UNITS]: number;
    [MeterTypes.TOTAL_SCAN_UNITS]: number;
    [index: string]: number;
  };
};
  