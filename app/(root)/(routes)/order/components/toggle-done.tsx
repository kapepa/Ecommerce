"use client"

import { Switch } from "@/components/ui/switch";
import { FC, useState } from "react";

interface ToggleDoneProps {
  value: boolean,
  disabled: boolean,
  onChangeIsDone: (val: boolean) => void,
}

const ToggleDone: FC<ToggleDoneProps> = (props) => {
  const { value, disabled, onChangeIsDone } = props;

  return (
    <Switch
      checked={value}
      disabled={disabled}
      onCheckedChange={onChangeIsDone}
    />
  )
}

export { ToggleDone }