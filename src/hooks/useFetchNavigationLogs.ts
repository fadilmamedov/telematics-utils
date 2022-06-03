import { sortBy, throttle } from "lodash";
import moment from "moment-timezone";
import { useMemo, useRef, useState } from "react";
import { EngineState } from "types/EngineState";
import { NavigationLog } from "types/NavigationLog";
import { useSettings } from "./useSettings";
import { fetchVehiclesStats } from "api/fetchVehicleStats";

interface FetchDataOptions {
  startDate: Date;
  endDate: Date;
  deviceID: string;
  fetchInterval: number;
}

export const useFetchNavigationLogs = () => {
  const { samsaraToken } = useSettings();

  const intervalIDRef = useRef(0);

  const [isFetching, setIsFetching] = useState(false);
  const [fetchingProgress, setFetchingProgress] = useState(0);

  const setFetchingProgressThrottle = useMemo(() => throttle(setFetchingProgress, 1000), []);

  const fetchData = (options: FetchDataOptions) => {
    const { startDate, endDate, deviceID, fetchInterval } = options;

    return new Promise<NavigationLog[]>((resolve, reject) => {
      const navigationLogs: NavigationLog[] = [];

      setIsFetching(true);
      setFetchingProgress(0);

      let currentDate = moment(startDate);

      let requestIndex = 0;
      const requestsCount =
        moment.duration(moment(endDate).diff(startDate)).asSeconds() / fetchInterval;
      const totalNavigationLogsCount = requestsCount;

      intervalIDRef.current = window.setInterval(() => {
        if (requestIndex >= requestsCount) {
          clearInterval(intervalIDRef.current);
          return;
        }

        const localCurrentDate = moment(currentDate);

        // fetchVehiclesStats(samsaraToken, currentDate.utc().format(), deviceID)
        //   .then((data) => {
        //     navigationLogs.push({
        //       id: navigationLogs.length,
        //       requestDate: localCurrentDate.toDate(),
        //       deviceID: data.id,
        //       engineState: data.engineState.value.toLowerCase() as EngineState,
        //       engineStateDate: new Date(data.engineState.time),
        //       gpsDate: new Date(data.gps.time),
        //       gpsLng: data.gps.longitude,
        //       gpsLat: data.gps.latitude,
        //       gpsFormattedLocation: data.gps.reverseGeo.formattedLocation,
        //     });

        //     const fetchingProgress = navigationLogs.length / totalNavigationLogsCount;
        //     setFetchingProgressThrottle(fetchingProgress);

        //     const isFetchingCompleted = navigationLogs.length === totalNavigationLogsCount;
        //     if (isFetchingCompleted) {
        //       resolve(sortBy(navigationLogs, ({ requestDate }) => requestDate));
        //       setIsFetching(false);
        //       setFetchingProgress(1);
        //     }
        //   })
        //   .catch((e: Error) => {
        //     console.error(e);
        //   });

        requestIndex += 1;
        currentDate.add(fetchInterval, "second");
        // TODO: Set to 50 (or dynamic)
      }, 200);
    });
  };

  const stopFetchingData = () => {
    clearInterval(intervalIDRef.current);
    setIsFetching(false);
    setFetchingProgress(0);
  };

  return { fetchData, stopFetchingData, fetchingProgress, isFetching, setFetchingProgress };
};
