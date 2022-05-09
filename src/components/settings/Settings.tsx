import { FormGroup, HTMLSelect, InputGroup } from "@blueprintjs/core";
import { useSettings } from "hooks/useSettings";
import { useTimezones } from "hooks/useTimezones";

export const Settings = () => {
  const timezones = useTimezones();

  const { mapboxToken, setMapboxToken, samsaraToken, setSamsaraToken, timezone, setTimezone } =
    useSettings();

  return (
    <div className="p-4 w-96">
      <FormGroup label="Mapbox access token" helperText="Needed to make map working">
        <InputGroup value={mapboxToken} onChange={(e) => setMapboxToken(e.target.value)} />
      </FormGroup>

      <FormGroup label="Samsara API token" helperText="Needed to fetch data from Samsara">
        <InputGroup value={samsaraToken} onChange={(e) => setSamsaraToken(e.target.value)} />
      </FormGroup>

      <FormGroup label="Timezone">
        <HTMLSelect
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          iconProps={{ icon: "chevron-down" }}
          className="w-full"
        >
          {timezones.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </HTMLSelect>
      </FormGroup>
    </div>
  );
};
