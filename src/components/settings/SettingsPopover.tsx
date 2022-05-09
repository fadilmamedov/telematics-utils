import React from "react";
import { Popover2 } from "@blueprintjs/popover2";
import { Settings } from "./Settings";

interface SettingsPopoverProps {
  children: React.ReactElement;
}

export const SettingsPopover: React.FC<SettingsPopoverProps> = ({ children }) => (
  <Popover2 content={<Settings />} placement="bottom-start">
    {children}
  </Popover2>
);
