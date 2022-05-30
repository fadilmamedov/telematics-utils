import { atom } from "recoil";
import { Appointment } from "types/Appointment";

export const appointmentsState = atom<Appointment[]>({
  key: "appointmentsState",
  default: [],
});
