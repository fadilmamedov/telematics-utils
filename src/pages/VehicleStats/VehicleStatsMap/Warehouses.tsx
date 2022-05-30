import React, { useEffect } from "react";
import { Map } from "mapbox-gl";

interface WarehousesProps {
  map: Map;
}
export const Warehouses: React.FC<WarehousesProps> = ({ map }) => {
  useEffect(() => {
    map.addSource("warehousesAreaSource", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-79.46695058399138, 43.70031809848689],
                  [-79.46565479564278, 43.70015580048826],
                  [-79.4640805264652, 43.70024619436427],
                  [-79.46383205973403, 43.699348216254464],
                  [-79.46539128269475, 43.69907418352088],
                  [-79.46665578994164, 43.698907150235925],
                  [-79.46711559921167, 43.7003563468582],
                ],
              ],
            },
            properties: {
              name: "YYZ Warehouse",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-79.79874869807554, 43.59171972012453],
                  [-79.79365372301496, 43.59631958848371],
                  [-79.79292960840863, 43.59579517070023],
                  [-79.79235380643253, 43.59226312948064],
                  [-79.79488384541798, 43.59012737608205],
                  [-79.79710853487106, 43.59116366826177],
                  [-79.79779775238768, 43.59092987219469],
                  [-79.79876614661994, 43.59168812640581],
                ],
              ],
            },
            properties: {
              name: "IKEA Warehouse",
            },
          },
        ],
      },
    });

    map.addLayer({
      id: "warehousesAreaLayer",
      type: "fill",
      source: "warehousesAreaSource",
      paint: {
        "fill-color": "red",
        "fill-opacity": 0.4,
      },
    });

    map.addSource("warehousesPointSource", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-79.4652028679061, 43.69968406524154],
            },
            properties: {
              name: "YYZ Warehouse",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-79.79566568766302, 43.59199285579595],
            },
            properties: {
              name: "IKEA Warehouse",
            },
          },
        ],
      },
    });

    map.addLayer({
      id: "warehousesName",
      type: "symbol",
      source: "warehousesPointSource",
      paint: {
        "text-color": "black",
        "text-halo-color": "white",
        "text-halo-width": 1,
      },
      layout: {
        "text-field": "{name}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 16,
      },
    });

    return () => {
      map.removeLayer("warehousesName");
      map.removeSource("warehousesPointSource");

      map.removeLayer("warehousesAreaLayer");
      map.removeSource("warehousesAreaSource");
    };
  }, [map]);
  return null;
};
