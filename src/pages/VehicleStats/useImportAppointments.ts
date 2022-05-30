import yaml from "js-yaml";
import { Position, Toaster } from "@blueprintjs/core";
import { uploadFile } from "utils/uploadFile";
import { Location } from "types/Location";
import { appointmentsState } from "recoil/appointments";
import { useSetRecoilState } from "recoil";
import { Appointment } from "types/Appointment";

interface AppointmentsYaml {
  appointments: { [appointmentName: string]: Location };
}

const ErrorToaster = Toaster.create({
  position: Position.TOP,
});

export const useImportAppointments = () => {
  const setAppointments = useSetRecoilState(appointmentsState);

  const importAppointments = async () => {
    try {
      const content = await uploadFile(".yaml");
      const data = yaml.load(content) as AppointmentsYaml;

      const appointments: Appointment[] = Object.entries(data.appointments).map(
        ([name, location]) => ({ name, location })
      );
      setAppointments(appointments);
    } catch {
      ErrorToaster.show({
        message: "Failed to import appointments",
        intent: "danger",
        icon: "error",
      });
    }
  };

  return { importAppointments };
};
