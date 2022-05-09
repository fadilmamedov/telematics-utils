import { atom } from "recoil";

export const dateFormatState = atom({
  key: "navigationLogDateFormatState",
  default: "YYYY-MM-DD HH:mm:ss",
});
