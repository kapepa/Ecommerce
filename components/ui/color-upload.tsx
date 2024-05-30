"use client"

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { FC, useLayoutEffect, useMemo, useTransition } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import axios from "axios";
import { BoardColor } from "./board-color";

interface ColorUploadProps {
  value: string,
  disabled: boolean,
  onChange: (url: string) => void;
  isNotUseImage: boolean;
}

const ColorUpload: FC<ColorUploadProps> = (props) => {
  const { value, disabled, onChange, isNotUseImage } = props;
  const [isPending, startTransition] = useTransition();

  useLayoutEffect(() => {
    return () => {
      if (isNotUseImage && !!value) requestDelete(value)
    }
  }, [isNotUseImage, value])

  const requestDelete = async (url: string) => {
    const extractID = url.startsWith("http") ? url.split("/").pop()?.split(".").shift() : url;
    await axios.delete(`/api/image/${extractID}`);

    return extractID;
  }

  const onDelete = (url: string) => {
    startTransition(() => {
      requestDelete(url)
      .then(() => onChange(""))
      .catch(err => console.error(err));
    })
  }

  const setResource = async (info: string | CloudinaryUploadWidgetInfo | undefined) => {
    if (!!value) await requestDelete(value);
    if (info === undefined) return null;
    if (typeof info === 'string') return onChange(info);
    return onChange((info as CloudinaryUploadWidgetInfo).secure_url);
  }

  const viewImage = useMemo(() => {
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
          onClick={onDelete.bind(null, value)}
          disabled={disabled || isPending}
          className="h-10 w-10"
        >
          <Trash/>
        </Button>
      </div>
    )
  }, [value, disabled, isPending])

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
          startTransition(() => {
            setResource(result?.info); // { public_id, secure_url, etc }
            widget.close();
          })
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            startTransition(() => {
              setResource(undefined);
              open();
            })
          }
          return (
          <Button 
            type="button"
            variant="secondary"
            disabled={disabled || isPending}
            onClick={handleOnClick}
          >
            <ImagePlus
              className="h-4 w-4 mr-2"
            />
            Upload an image color 
          </Button>
          );
        }}
      </CldUploadWidget>
      <div className="mb-4 flex items-center gap-4">
        {viewImage}
      </div>
    </div>
  )
}

export { ColorUpload }