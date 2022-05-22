import { round } from "lodash";
import { useRecoilValue } from "recoil";
import { Divider } from "@blueprintjs/core";
import { findLocationCoordinatesState } from "../state";

export const FindLocationCoordinates = () => {
  const findLocationCoordinates = useRecoilValue(findLocationCoordinatesState);

  return (
    <div className="flex gap-2 absolute top-1 right-1 bg-white rounded-md text-sm font-medium py-1 px-2 z-10">
      <span>{round(findLocationCoordinates[0], 6)}</span>
      <Divider />
      <span>{round(findLocationCoordinates[1], 6)}</span>
    </div>
  );
};
