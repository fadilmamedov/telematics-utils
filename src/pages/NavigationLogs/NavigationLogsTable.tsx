import React from "react";
import cls from "classnames";
import { useRecoilValue } from "recoil";
import { FixedSizeList } from "react-window";
import { navigationLogsState } from "recoil/navigationLogs";
import { Height } from "components/common/Height";
import { NavigationLogRow } from "./NavigationLogRow";

interface NavigationLogsTableProps {
  className?: string;
}

export const NavigationLogsTable: React.FC<NavigationLogsTableProps> = ({ className }) => {
  const navigationLogs = useRecoilValue(navigationLogsState);

  return (
    <div
      className={cls(
        "flex flex-col bg-slate-50 rounded-sm shadow-sm border border-slate-200",
        className
      )}
    >
      <div className="flex justify-between py-3 font-medium border-b border-slate-200">
        <div className="w-[200px] px-2 shrink-0">Request Date</div>
        <div className="w-[200px] px-2 shrink-0">GPS Date</div>
        <div className="w-[200px] px-2 shrink-0">GPS Location</div>
        <div className="w-[300px] px-2 shrink-0">GPS Formatted Location</div>
        <div className="w-[100px] px-2 shrink-0">Speed</div>
        <div className="w-[100px] px-2 shrink-0">Engine State</div>
        <div className="w-[200px] px-2 shrink-0">Engine State Date</div>
      </div>

      <Height className="flex-1">
        {(height) => (
          <FixedSizeList
            width="100%"
            height={height}
            itemSize={50}
            itemCount={navigationLogs.length}
            itemKey={(index) => navigationLogs[index].id}
          >
            {({ index, style }) => {
              return (
                <NavigationLogRow
                  navigationLog={navigationLogs[index]}
                  style={style}
                  className={cls({
                    "bg-slate-100": index % 2 === 0,
                  })}
                />
              );
            }}
          </FixedSizeList>
        )}
      </Height>
    </div>
  );
};
