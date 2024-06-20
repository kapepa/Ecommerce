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
  const [isChecked, setChecked] = useState<boolean>(value);

  const onCheckedChange = (value: boolean) => {
    setChecked(value)
    onChangeIsDone(value)
  }

  return (
    <Switch
      checked={isChecked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
    />
  )
}

export { ToggleDone }