import { useRecoilState } from "recoil";
import { HTMLSelect } from "@blueprintjs/core";
import { dateFormatState } from "./dateFormatState";

export const DateFormatSelector = () => {
  const [dateFormat, setDateFormat] = useRecoilState(dateFormatState);

  return (
    <HTMLSelect
      minimal
      value={dateFormat}
      onChange={(e) => setDateFormat(e.target.value)}
      iconProps={{ icon: "chevron-down" }}
    >
      <option value="YYYY-MM-DD HH:mm:ss">Show date and time</option>
      <option value="YYYY-MM-DD">Show only date</option>
      <option value="HH:mm:ss">Show only time</option>
    </HTMLSelect>
  );
};
