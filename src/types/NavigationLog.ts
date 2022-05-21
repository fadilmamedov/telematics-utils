import { EngineState } from "./EngineState";

export interface NavigationLog {
  id: number;
  deviceID: string;
  requestDate: Date;
  gpsDate: Date;
  gpsLng: number;
  gpsLat: number;
  gpsFormattedLocation: string;
  speed: number;
  engineState: EngineState;
  engineStateDate: Date;
}
