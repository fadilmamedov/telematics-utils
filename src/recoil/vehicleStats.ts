import { atom } from "recoil";
import { VehicleStats } from "types/VehicleStats";

export const vehicleStatsState = atom<VehicleStats[]>({
  key: "vehicleStatsState",
  default: [],
});
