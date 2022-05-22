import { Location } from "./Location";
import { EngineState } from "./EngineState";

export interface VehicleEngineStateStats {
  type: "engine";
  value: EngineState;
  date: Date;
  location: Location;
}

export interface VehicleGpsStats {
  type: "gps";
  date: Date;
  location: Location;
  formattedLocation: string;
}

export type VehicleStats = VehicleEngineStateStats | VehicleGpsStats;
