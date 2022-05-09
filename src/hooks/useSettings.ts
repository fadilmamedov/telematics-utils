import { useLocalStorage } from "./useLocalStorage";

export const useSettings = () => {
  const [mapboxToken, setMapboxToken] = useLocalStorage("mapbox_access_token");
  const [samsaraToken, setSamsaraToken] = useLocalStorage("samsara_api_token");
  const [timezone, setTimezone] = useLocalStorage("timezone");

  return {
    mapboxToken,
    samsaraToken,
    setMapboxToken,
    setSamsaraToken,
    timezone: timezone || "UTC",
    setTimezone,
  };
};
