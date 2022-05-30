import moment from "moment";
import React, { useEffect } from "react";
import { Map } from "mapbox-gl";
import { useRecoilValue } from "recoil";
import { vehicleStatsState } from "recoil/vehicleStats";
import { useSettings } from "hooks/useSettings";
import { VehicleGpsStats as VehicleGpsStatsType } from "types/VehicleStats";

interface VehicleGpsStatsProps {
  map: Map;
}

export const VehicleGpsStats: React.FC<VehicleGpsStatsProps> = ({ map }) => {
  const { timezone } = useSettings();

  const vehicleStats = useRecoilValue(vehicleStatsState);

  useEffect(() => {
    const vehicleGpsStats = vehicleStats.filter(
      ({ type }) => type === "gps"
    ) as VehicleGpsStatsType[];

    map.addSource("vehicleGpsStatsPointsSource", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: vehicleGpsStats.map(({ location, date }) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: location,
          },
          properties: {
            time: moment(date).tz(timezone).format("hh:mm:ss"),
          },
        })),
      },
    });

    map.addSource("vehicleGpsStatsPathSource", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: vehicleGpsStats.map((s) => s.location),
        },
        properties: {},
      },
    });

    map.addLayer({
      id: "vehicleGpsStatsOutline",
      type: "line",
      source: "vehicleGpsStatsPathSource",
      paint: {
        "line-color": "#ffffff",
        "line-width": 5,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
    });

    map.addLayer({
      id: "vehicleGpsStatsLine",
      type: "line",
      source: "vehicleGpsStatsPathSource",
      paint: {
        "line-color": "#384df6",
        "line-width": 3,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
    });

    map.addLayer({
      id: "vehicleGpsStatsPoints",
      type: "circle",
      source: "vehicleGpsStatsPointsSource",
      paint: {
        "circle-radius": 3,
        "circle-color": "#ffffff",
        "circle-stroke-color": "black",
        "circle-stroke-width": 1,
      },
    });

    map.addLayer({
      id: "vehicleGpsStatsPointsTime",
      type: "symbol",
      source: "vehicleGpsStatsPointsSource",
      paint: {
        "text-color": "black",
        "text-halo-color": "white",
        "text-halo-width": 1,
      },
      layout: {
        "text-field": "{time}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
        "text-offset": [0, -1],
      },
    });

    return () => {
      map.removeLayer("vehicleGpsStatsLine");
      map.removeLayer("vehicleGpsStatsOutline");
      map.removeSource("vehicleGpsStatsPathSource");

      map.removeLayer("vehicleGpsStatsPoints");
      map.removeLayer("vehicleGpsStatsPointsTime");
      map.removeSource("vehicleGpsStatsPointsSource");
    };
  }, [map, vehicleStats, timezone]);

  return null;
};
