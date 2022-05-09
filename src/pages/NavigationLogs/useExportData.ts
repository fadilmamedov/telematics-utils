import moment from "moment";
import { unparse } from "papaparse";
import { useRecoilValue } from "recoil";
import { Position, Toaster } from "@blueprintjs/core";
import { navigationLogsState } from "recoil/navigationLogs";
import { useSettings } from "hooks/useSettings";

const saveFile = (name: string, content: string) => {
  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  a.download = name;
  a.click();
};

const ErrorToaster = Toaster.create({
  position: Position.TOP,
});

export const useExportData = () => {
  const { timezone } = useSettings();

  const navigationLogs = useRecoilValue(navigationLogsState);

  const getFileNameDates = () => {
    const startDate = navigationLogs[0].requestDate;
    const endDate = navigationLogs[navigationLogs.length - 1].requestDate;

    const startDateString = moment(startDate).tz(timezone).format("YYYY-MM-DD");
    const endDateString = moment(endDate).tz(timezone).format("YYYY-MM-DD");

    return startDateString === endDateString
      ? startDateString
      : `${startDateString}__${endDateString}`;
  };

  const exportCSV = () => {
    try {
      const fileName = `navigation-logs__${getFileNameDates()}.csv`;
      const content = unparse(navigationLogs);
      saveFile(fileName, content);
    } catch {
      ErrorToaster.show({
        message: "Failed to export navigation logs to CSV",
        intent: "danger",
        icon: "error",
      });
    }
  };

  const exportJSON = () => {
    try {
      const fileName = `navigation-logs__${getFileNameDates()}.json`;
      const content = JSON.stringify(navigationLogs, null, 2);
      saveFile(fileName, content);
    } catch {
      ErrorToaster.show({
        message: "Failed to export navigation logs to JSON",
        intent: "danger",
        icon: "error",
      });
    }
  };

  return { exportCSV, exportJSON };
};
