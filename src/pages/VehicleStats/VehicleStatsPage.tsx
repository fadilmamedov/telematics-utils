import { Button } from "@blueprintjs/core";
import { useRecoilState } from "recoil";
import { findLocationModeEnabledState } from "./state";
import { useImportData } from "./useImportData";
import { VehicleStatsMap } from "./VehicleStatsMap";

export const VehicleStatsPage = () => {
  const { importJSON } = useImportData();

  const [findLocationModeEnabled, setFindLocationModeEnabled] = useRecoilState(
    findLocationModeEnabledState
  );

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex gap-3 items-center">
        <Button outlined intent="primary" onClick={importJSON}>
          Import JSON
        </Button>

        <Button
          outlined
          icon="locate"
          intent="primary"
          active={findLocationModeEnabled}
          onClick={() => setFindLocationModeEnabled(!findLocationModeEnabled)}
        >
          Find location
        </Button>
      </div>

      <VehicleStatsMap />
    </div>
  );
};
