import { EngineState } from "./EngineState";

export interface NavigationLog {
  id: number;
  deviceID: string;
  vin: string;
  requestDate: Date;
  gpsDate: Date;
  gpsLng: number;
  gpsLat: number;
  gpsFormattedLocation: string;
  engineState: EngineState;
  engineStateDate: Date;
}
