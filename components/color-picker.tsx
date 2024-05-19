import { FC, useState } from "react";
import { ChromePicker } from 'react-color';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface ColorPickerProps {
  value?: string
  onChange: (color: string) => void
}

const ColorPicker: FC<ColorPickerProps> = (props) => {
  const { value, onChange } = props;
  const [color, setColor] = useState(value);

  const handleChange = (newColor: any) => {
    setColor(newColor.hex);
    onChange(newColor.hex)
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className="border p-4 rounded-full cursor-pointer"
          style={{ backgroundColor: color }}
        />
      </HoverCardTrigger>
      <HoverCardContent>
        <ChromePicker color={color} onChange={handleChange} />
      </HoverCardContent>
    </HoverCard>

  );
}

export { ColorPicker };