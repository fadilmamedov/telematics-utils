import { atom } from "recoil";
import { Location } from "types/Location";

export const findLocationModeEnabledState = atom({
  key: "findLocationModeEnabledstate",
  default: false,
});

export const findLocationCoordinatesState = atom<Location>({
  key: "findLocationCoordinates",
  default: [0, 0],
});
