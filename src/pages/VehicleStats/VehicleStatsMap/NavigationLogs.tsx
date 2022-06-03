import { Map } from "mapbox-gl";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { navigationLogsState } from "recoil/navigationLogs";
interface NavigationLogsProps {
  map: Map;
}

export const NavigationLogs: React.FC<NavigationLogsProps> = ({ map }) => {
  const navigationLogs = useRecoilValue(navigationLogsState);

  useEffect(() => {
    map.addSource("navigationLogsPathSource", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: navigationLogs.map(({ gpsLng, gpsLat }) => [gpsLng, gpsLat]),
        },
        properties: {},
      },
    });

    map.addLayer({
      id: "navigationLogsLine",
      type: "line",
      source: "navigationLogsPathSource",
      paint: {
        "line-color": "#384df6",
        "line-width": 3,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
    });

    return () => {
      map.removeLayer("navigationLogsLine");
      map.removeSource("navigationLogsPathSource");
    };
  }, [map, navigationLogs]);

  return null;
};
