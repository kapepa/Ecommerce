"use client"

import { FC } from "react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";

interface BoardColorProps {
  url: string,
}

const BoardColor: FC<BoardColorProps> = (props) => {
  const { url } = props;

  if (!url) return null;

  return (
    <Popover>
    <PopoverTrigger asChild>
      <Button variant="link">
        <div
          className="p-4 relative h-10 w-10 cursor-pointer"
        >
          <Image
            fill
            src={url}
            alt="color"
            className="border object-cover rounded-full"
            sizes="h-10 w-10"
          />
        </div>
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-80 h-80">
        <div
          className="p-4 relative h-full"
        >
          <Image
            fill
            src={url}
            alt="color"
            className="border object-cover rounded-sm"
            sizes="h-10 w-10"
          />
        </div>

    </PopoverContent>
  </Popover>
  )
}

export { BoardColor }

