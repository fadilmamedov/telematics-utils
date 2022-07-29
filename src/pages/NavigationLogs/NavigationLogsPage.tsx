import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, ButtonGroup, Checkbox } from "@blueprintjs/core";
import { navigationLogsState } from "recoil/navigationLogs";
import { DateFormatSelector } from "./DateFormatSelector";
import { NavigationLogsTable } from "./NavigationLogsTable";
import { useExportData } from "./useExportData";
import { useImportData } from "./useImportData";
import { roundCoordinatesState } from "./roundCoordinatesState";
// import { FetchNavigationLogsDialog } from "components/navigationLogs/FetchNavigationLogsDialog";

export const NavigationLogsPage = () => {
  const navigationLogs = useRecoilValue(navigationLogsState);
  const [shouldRoundCoordinates, setShouldRoundCoordinates] = useRecoilState(roundCoordinatesState);

  const { importCSV, importJSON } = useImportData();
  const { exportCSV, exportJSON } = useExportData();

  // const [isFetchFromSamsaraDialogVisible, setFetchFromSamsaraDialogVisible] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-3 items-center">
        <ButtonGroup>
          <Button outlined intent="primary" onClick={importCSV}>
            Import CSV
          </Button>
          <Button outlined intent="primary" onClick={importJSON}>
            Import JSON
          </Button>
          {/* <Button outlined intent="primary" onClick={() => setFetchFromSamsaraDialogVisible(true)}>
            Fetch from Samsara
          </Button> */}
        </ButtonGroup>

        <ButtonGroup>
          <Button
            outlined
            intent="primary"
            disabled={navigationLogs.length === 0}
            onClick={exportCSV}
          >
            Export CSV
          </Button>
          <Button
            outlined
            intent="primary"
            disabled={navigationLogs.length === 0}
            onClick={exportJSON}
          >
            Export JSON
          </Button>
        </ButtonGroup>

        <div className="flex items-center ml-auto">
          <Checkbox
            label="Round coordinates"
            checked={shouldRoundCoordinates}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setShouldRoundCoordinates(e.target.checked);
            }}
            className="m-0 mr-3"
          />
          <DateFormatSelector />
        </div>
      </div>

      <NavigationLogsTable className="h-full mt-3" />

      {/* <FetchNavigationLogsDialog
        visibile={isFetchFromSamsaraDialogVisible}
        onClose={() => setFetchFromSamsaraDialogVisible(false)}
      /> */}
    </div>
  );
};
