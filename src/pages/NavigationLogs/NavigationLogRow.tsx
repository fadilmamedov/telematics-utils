import React from "react";
import moment from "moment";
import classnames from "classnames";
import { useRecoilValue } from "recoil";
import { NavigationLog } from "types/NavigationLog";
import { useSettings } from "hooks/useSettings";
import { dateFormatState } from "./dateFormatState";
import { EngineStateTag } from "./EngineStateTag";
import { roundCoordinatesState } from "./roundCoordinatesState";
import { round } from "lodash";

interface NavigationLogRowProps {
  navigationLog: NavigationLog;
  style?: React.CSSProperties;
  className?: string;
}

export const NavigationLogRow: React.FC<NavigationLogRowProps> = ({
  navigationLog,
  style,
  className,
}) => {
  const { timezone } = useSettings();
  const dateFormat = useRecoilValue(dateFormatState);
  const shouldRoundCoordinates = useRecoilValue(roundCoordinatesState);

  const {
    requestDate,
    gpsDate,
    gpsLng,
    gpsLat,
    gpsFormattedLocation,
    speed,
    engineState,
    engineStateDate,
  } = navigationLog;

  return (
    <div className={classnames("flex items-center justify-between", className)} style={style}>
      <div className="w-[200px] px-2 shrink-0">
        {moment(requestDate).tz(timezone).format(dateFormat)}
      </div>
      <div className="w-[200px] px-2 shrink-0">
        {moment(gpsDate).tz(timezone).format(dateFormat)}
      </div>
      <div className="w-[200px] px-2 shrink-0">
        <code className="flex gap-3 text-xs font-medium">
          <div className="p-1 bg-slate-200 rounded-sm">
            {shouldRoundCoordinates ? round(gpsLng, 6) : gpsLng}
          </div>
          <div className="p-1 bg-slate-200 rounded-sm">
            {shouldRoundCoordinates ? round(gpsLat, 6) : gpsLat}
          </div>
        </code>
      </div>
      <div className="w-[300px] px-2 shrink-0">{gpsFormattedLocation}</div>
      <div className="w-[100px] px-2 shrink-0">{speed}</div>
      <div className="flex justify-center w-[100px] px-2 shrink-0">
        <EngineStateTag engineState={engineState} />
      </div>
      <div className="w-[200px] px-2 shrink-0">
        {moment(engineStateDate).tz(timezone).format(dateFormat)}
      </div>
    </div>
  );
};
