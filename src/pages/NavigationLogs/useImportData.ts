import { parse } from "papaparse";
import { useSetRecoilState } from "recoil";
import { Position, Toaster } from "@blueprintjs/core";
import { navigationLogsState } from "recoil/navigationLogs";
import { EngineState } from "types/EngineState";
import { NavigationLog } from "types/NavigationLog";
import { uploadFile } from "utils/uploadFile";

interface NavigationLogJSON {
  id: number;
  deviceID: string;
  requestDate: string;
  gpsDate: string;
  gpsLng: number;
  gpsLat: number;
  gpsFormattedLocation: string;
  speed: number;
  engineState: EngineState;
  engineStateDate: string;
}

const ErrorToaster = Toaster.create({
  position: Position.TOP,
});

export const useImportData = () => {
  const setNavigationLogs = useSetRecoilState(navigationLogsState);

  const importCSV = async () => {
    try {
      const content = await uploadFile(".csv");
      const { data: navigationLogs } = parse<NavigationLog>(content, {
        header: true,
        dynamicTyping: true,
      });
      setNavigationLogs(navigationLogs);
    } catch {
      ErrorToaster.show({
        message: "Failed to import navigation logs from CSV",
        intent: "danger",
        icon: "error",
      });
    }
  };

  const importJSON = async () => {
    try {
      const content = await uploadFile(".json");
      const data = JSON.parse(content) as NavigationLogJSON[];

      const navigationLogs: NavigationLog[] = data.map(
        ({
          id,
          deviceID,
          requestDate,
          gpsDate,
          gpsLng,
          gpsLat,
          gpsFormattedLocation,
          speed,
          engineState,
          engineStateDate,
        }) => ({
          id,
          deviceID,
          requestDate: new Date(requestDate),
          gpsDate: new Date(gpsDate),
          gpsLng: gpsLng,
          gpsLat: gpsLat,
          gpsFormattedLocation: gpsFormattedLocation,
          speed,
          engineState,
          engineStateDate: new Date(engineStateDate),
        })
      );
      setNavigationLogs(navigationLogs);
    } catch {
      ErrorToaster.show({
        message: "Failed to import navigation logs from JSON",
        intent: "danger",
        icon: "error",
      });
    }
  };

  return { importCSV, importJSON };
};
