"use client"

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { FC, useLayoutEffect, useMemo, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import { BoardColor } from "./board-color";

interface ColorUploadProps {
  value: string,
  disabled: boolean,
  onChange: (val: string | undefined) => void,
  onDeleteColor: (url: string) => void,
}

const ColorUpload: FC<ColorUploadProps> = (props) => {
  const { value, disabled, onChange, onDeleteColor } = props;
  const [ isMounted, setMounted ] = useState<boolean>(false);

  useLayoutEffect(() => {
    setMounted(true);
  },[setMounted])

  if(!isMounted) return null;

  const setResource = async (info: string | CloudinaryUploadWidgetInfo | undefined) => {
    if (info === undefined) return null;
    if (typeof info === 'string'){
      return onChange(info);
    }
    
    const extractUrl = (info as CloudinaryUploadWidgetInfo).secure_url;
    return onChange(extractUrl);
  }

  const viewImage = () => {
    if (!value) return null;

    return (
      <div
        className="flex gap-4"
      >
        <BoardColor
          url={value}
        />
        <Button
          size="icon"
          type="button"
          variant="destructive"
          onClick={onDeleteColor.bind(null, value)}
          disabled={disabled}
          className="h-10 w-10"
        >
          <Trash/>
        </Button>
      </div>
    )
  }

  return (
    <div
      className="flex gap-4"
    >
      <CldUploadWidget
        uploadPreset="tgtoxekb"
        options={{
          maxFiles: 1,
        }}
        onSuccess={(result, { widget }) => {
          setResource(result?.info); // { public_id, secure_url, etc }
          widget.close();
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            setResource(undefined);
            open();
          }
          return (
          <Button 
            type="button"
            variant="secondary"
            disabled={disabled}
            onClick={handleOnClick}
          >
            <ImagePlus
              className="h-4 w-4 mr-2"
            />
            Загрузите цвет изображения 
          </Button>
          );
        }}
      </CldUploadWidget>
      <div className="mb-4 flex items-center gap-4">
        {!!value && viewImage()}
      </div>
    </div>
  )
}

export { ColorUpload }