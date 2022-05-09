import React from "react";
import { Tag } from "@blueprintjs/core";
import { EngineState } from "types/EngineState";

interface EngineStateTagProps {
  engineState: EngineState;
}

export const EngineStateTag: React.FC<EngineStateTagProps> = ({ engineState }) => {
  const getIntent = () => {
    if (engineState === "off") return "none";
    if (engineState === "on") return "success";
    return "primary";
  };

  return (
    <Tag intent={getIntent()} className="w-11 text-center">
      {engineState.toUpperCase()}
    </Tag>
  );
};
