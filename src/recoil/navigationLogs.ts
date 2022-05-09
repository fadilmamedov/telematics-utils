import { atom } from "recoil";
import { NavigationLog } from "types/NavigationLog";

export const navigationLogsState = atom<NavigationLog[]>({
  key: "navigationLogsState",
  default: [],
});
