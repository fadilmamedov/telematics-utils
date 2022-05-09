import moment, { MomentZone } from "moment-timezone";

export const useTimezones = () => {
  const timezones = ["UTC", "America/Toronto"];
  return timezones.map((timezone) => moment.tz.zone(timezone) as MomentZone);
};
