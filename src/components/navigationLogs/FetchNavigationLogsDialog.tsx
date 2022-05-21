import cls from "classnames";
import moment from "moment-timezone";
import { useState } from "react";
import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  HTMLSelect,
  InputGroup,
  ProgressBar,
} from "@blueprintjs/core";
import { DateInput } from "@blueprintjs/datetime";
import { useSettings } from "hooks/useSettings";
import { useFetchNavigationLogs } from "hooks/useFetchNavigationLogs";
import { useSetRecoilState } from "recoil";
import { navigationLogsState } from "recoil/navigationLogs";

interface FetchNavigationLogsDialogProps {
  visibile: boolean;
  onClose: () => void;
}

export const FetchNavigationLogsDialog: React.FC<FetchNavigationLogsDialogProps> = ({
  visibile,
  onClose,
}) => {
  const { timezone } = useSettings();

  const setNavigationLogs = useSetRecoilState(navigationLogsState);

  const [date, setDate] = useState(() => moment.tz(timezone).startOf("day").toDate());
  const [deviceID, setDeviceID] = useState("281474980592958");
  const [fetchInterval, setFetchInterval] = useState(60);

  const {
    fetchData: fetchNavigationLogs,
    stopFetchingData: stopFetchingNavigationLogs,
    isFetching,
    fetchingProgress,
    setFetchingProgress,
  } = useFetchNavigationLogs();

  const handleClose = () => {
    if (isFetching) stopFetchingNavigationLogs();
    onClose();
  };

  const handleFetchButtonClick = async () => {
    try {
      const navigationLogs = await fetchNavigationLogs({
        startDate: moment("2022-04-20T10:45:00Z").toDate(),
        // TODO: Set end of day
        endDate: moment("2022-04-20T10:50:00Z").toDate(),
        deviceID: "281474980592958",
        fetchInterval: 10,
      });
      setNavigationLogs(navigationLogs);
    } catch {}
  };

  const handleCancelButtonClick = () => {
    if (isFetching) stopFetchingNavigationLogs();
  };

  return (
    <Dialog
      isOpen={visibile}
      title="Fetch navigation logs from Samsara"
      className="w-[600px]"
      onClose={handleClose}
    >
      <div className={Classes.DIALOG_BODY}>
        <div className="flex gap-6">
          <FormGroup label="Date" className="flex-1">
            <DateInput
              fill
              value={date}
              onChange={(date) => setDate(date)}
              parseDate={(dateString) => moment.tz(dateString, timezone).toDate()}
              formatDate={(date) => moment.tz(date, timezone).format("YYYY-MM-DD")}
            />
          </FormGroup>

          <FormGroup label="Fetch internval" className="flex-1">
            <HTMLSelect
              fill
              value={fetchInterval}
              iconProps={{ icon: "chevron-down" }}
              onChange={(e) => setFetchInterval(parseInt(e.target.value))}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
            </HTMLSelect>
          </FormGroup>

          <FormGroup label="Device ID">
            <InputGroup value={deviceID} onChange={(e) => setDeviceID(e.target.value)} />
          </FormGroup>
        </div>

        <ProgressBar
          stripes={isFetching}
          intent={fetchingProgress === 1 ? "success" : "primary"}
          value={fetchingProgress}
          className="my-3"
        />
      </div>

      <div className={cls(Classes.DIALOG_FOOTER, "flex gap-2 justify-end")}>
        <Button className="w-[100px]" onClick={handleCancelButtonClick}>
          Cancel
        </Button>

        {fetchingProgress === 1 ? (
          <Button intent="success" className="w-[100px]" onClick={handleClose}>
            Done
          </Button>
        ) : (
          <Button
            intent="primary"
            loading={isFetching}
            className="w-[100px]"
            onClick={handleFetchButtonClick}
          >
            Fetch
          </Button>
        )}
      </div>
    </Dialog>
  );
};
