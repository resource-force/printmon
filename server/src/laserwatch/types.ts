// Types mostly taken from the LaserWatch (PrintFleet Enterprise) REST API -
// see https://laserwatch2.com/restapi/docs/.
export interface DeviceMeterSummary {
  deviceId: string;
  values: {
    deviceId: string;
    count: number;
    delta: number;
    firstReportedAt: string;
    lastReportedAt: string;
  }[];
}

export interface DeviceCore {
  groupId: string;
  lastReportedAt: string;
  firstReportedAt: string;
  status: "Stale" | "Ok" | "Warning";
  type: "Network";
  ipAddress: string;
  macAddress: string;
  managementStatus: "Managed";
  licenseStatus: string;
  location: string;
  assetNumber: string;
  serialNumber: string;
  modelMatch: {
    type: string;
    modifiedAt: string;
    model: {
      id: string;
      name: string;
      manufacturer: string;
      isColor: boolean;
      hasImage: boolean;
    };
    isAutoMatchEnabled: true;
  };
  legacyId: number;
  id: string;
  name: string;
}

export enum MeterTypes {
  TOTAL_UNITS_OUTPUT = "Impression.AllMeterTypes.AllFunctions.AllSides.AllPageSizes",
  TOTAL_MONO_UNITS_OUTPUT = "Impression.Mono.AllFunctions.AllSides.AllPageSizes",
  TOTAL_COLOR_UNITS_OUTPUT = "Impression.Color.AllFunctions.AllSides.AllPageSizes",
  TOTAL_SCAN_UNITS = "Impression.AllMeterTypes.Scan.AllSides.AllPageSizes",
  TOTAL_PRINT_UNITS = "Impression.AllMeterTypes.Print.AllSides.AllPAgeSizes",
  TOTAL_COPIER_UNITS = "Impression.AllMeterTypes.Copy.AllSides.AllPAgeSizes",
  DUPLEX = "Impression.AllMeterTypes.AllFunctions.Duplex.AllPageSizes"
}
