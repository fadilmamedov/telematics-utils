import { useSetRecoilState } from "recoil";
import { Position, Toaster } from "@blueprintjs/core";
import { vehicleStatsState } from "recoil/vehicleStats";
import { uploadFile } from "utils/uploadFile";
import { Location } from "types/Location";
import { EngineState } from "types/EngineState";
import { VehicleStats } from "types/VehicleStats";

interface VehicleEngineStatsJSON {
  type: "engine";
  value: EngineState;
  date: string;
  location: Location;
}

interface VehicleGpsStatsJSON {
  type: "gps";
  date: string;
  location: Location;
  formattedLocation: string;
}

type VehicleStatsJSON = VehicleEngineStatsJSON | VehicleGpsStatsJSON;

const ErrorToaster = Toaster.create({
  position: Position.TOP,
});

export const useImportData = () => {
  const setVehicleStats = useSetRecoilState(vehicleStatsState);

  const importJSON = async () => {
    try {
      const content = await uploadFile(".json");
      const data = JSON.parse(content) as VehicleStatsJSON[];

      const vehicleStats: VehicleStats[] = data.map((vehicleStats) => {
        if (vehicleStats.type === "engine") {
          return {
            type: "engine",
            value: vehicleStats.value,
            date: new Date(vehicleStats.date),
            location: vehicleStats.location,
          };
        }

        return {
          type: "gps",
          date: new Date(vehicleStats.date),
          location: vehicleStats.location,
          formattedLocation: vehicleStats.formattedLocation,
        };
      });

      setVehicleStats(vehicleStats);
    } catch {
      ErrorToaster.show({
        message: "Failed to import vehicle stats from JSON",
        intent: "danger",
        icon: "error",
      });
    }
  };

  return { importJSON };
};
