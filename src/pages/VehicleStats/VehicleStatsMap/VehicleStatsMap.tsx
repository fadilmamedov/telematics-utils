import cls from "classnames";
import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import { useSettings } from "hooks/useSettings";

import "mapbox-gl/dist/mapbox-gl.css";
import { VehicleGpsStats } from "./VehicleGpsStats";
import { useRecoilValue } from "recoil";
import { findLocationModeEnabledState } from "../state";
import { FindLocation } from "./FindLocation";

import { FindLocationCoordinates } from "./FindLocationCoordinates";

export const VehicleStatsMap = () => {
  const { mapboxToken } = useSettings();
  const findLocationModeEnabled = useRecoilValue(findLocationModeEnabledState);

  const [map, setMap] = useState<Map | null>(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapboxToken) return;
    if (!mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    const mapInstance = new Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-79.394823, 43.67553],
      zoom: 11,
    });

    mapInstance.once("load", () => setMap(mapInstance));
  }, [mapboxToken]);

  return (
    <div
      className={cls("h-full relative shadow-md rounded-md border-white border-2", {
        "!border-blue-500": findLocationModeEnabled,
      })}
    >
      {findLocationModeEnabled && <FindLocationCoordinates />}

      <div ref={mapContainer} className="h-full rounded-md">
        {map && (
          <>
            <VehicleGpsStats map={map} />
            {findLocationModeEnabled && <FindLocation map={map} />}
          </>
        )}
      </div>
    </div>
  );
};
