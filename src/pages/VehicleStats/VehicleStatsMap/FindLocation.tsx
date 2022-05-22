import React, { useEffect } from "react";
import { Position, Toaster } from "@blueprintjs/core";
import { Map, MapMouseEvent, EventData } from "mapbox-gl";
import { useSetRecoilState } from "recoil";
import { findLocationCoordinatesState } from "../state";

const MessageToaster = Toaster.create({
  position: Position.TOP,
});

interface FindLocationProps {
  map: Map;
}

export const FindLocation: React.FC<FindLocationProps> = ({ map }) => {
  const setFindLocationCoordinates = useSetRecoilState(findLocationCoordinatesState);

  useEffect(() => {
    map.getCanvas().style.cursor = "crosshair";

    const handleMouseMove = (e: MapMouseEvent & EventData) => {
      setFindLocationCoordinates([e.lngLat.lng, e.lngLat.lat]);
    };

    map.on("mousemove", handleMouseMove);

    return () => {
      map.getCanvas().style.cursor = "grab";

      map.off("mousemove", handleMouseMove);
    };
  }, [map, setFindLocationCoordinates]);

  useEffect(() => {
    const handleClick = async (e: MapMouseEvent & EventData) => {
      const [lng, lat] = e.lngLat.toArray();

      const addressResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=0`
      );
      const addressResponseData = await addressResponse.json();

      navigator.clipboard.writeText(
        `Location: ${e.lngLat.lng},${e.lngLat.lat}. Address: ${addressResponseData.display_name}`
      );

      MessageToaster.show({
        message: "Location coordinates and address are copied to clipboard",
        intent: "primary",
      });
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map]);

  return null;
};
