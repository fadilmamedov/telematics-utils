import React, { useEffect } from "react";
import { Map } from "mapbox-gl";
import * as turf from "@turf/turf";
import { useRecoilValue } from "recoil";
import { appointmentsState } from "recoil/appointments";

interface AppointmentProps {
  map: Map;
}

export const Appointments: React.FC<AppointmentProps> = ({ map }) => {
  const appointments = useRecoilValue(appointmentsState);

  useEffect(() => {
    map.addSource("appointmentPointsSource", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: appointments.map(({ name, location }) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: location,
          },
          properties: {
            name,
          },
        })),
      },
    });

    map.addSource("appointmentOnsiteAreaSource", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: appointments.map(({ location }) => {
          return turf.circle(location, 100, { steps: 100, units: "meters" });
        }),
      },
    });

    map.addLayer({
      id: "appointmentOnsiteAreaLayer",
      type: "fill",
      source: "appointmentOnsiteAreaSource",
      paint: {
        "fill-color": "#64748b",
        "fill-opacity": 0.4,
      },
    });

    map.addLayer({
      id: "appointmentPoints",
      type: "circle",
      source: "appointmentPointsSource",
      paint: {
        "circle-radius": 4,
        "circle-color": "orange",
        "circle-stroke-color": "black",
        "circle-stroke-width": 2,
      },
    });

    map.addLayer({
      id: "appointmentPointsName",
      type: "symbol",
      source: "appointmentPointsSource",
      paint: {
        "text-color": "black",
        "text-halo-color": "white",
        "text-halo-width": 3,
      },
      layout: {
        "text-field": "{name}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 14,
        "text-offset": [0, -1.2],
      },
    });

    return () => {
      map.removeLayer("appointmentPoints");
      map.removeLayer("appointmentPointsName");
      map.removeSource("appointmentPointsSource");

      map.removeLayer("appointmentOnsiteAreaLayer");
      map.removeSource("appointmentOnsiteAreaSource");
    };
  }, [map, appointments]);

  return null;
};
