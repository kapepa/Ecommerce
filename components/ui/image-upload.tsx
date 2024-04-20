"use client"

import { FC, useLayoutEffect, useState, useTransition } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { getImageId } from "@/lib/utils";

interface ImageUploadProps {
  disabled: boolean,
  onChange: (val: string | undefined) => void,
  onRemove: (val: string) => void,
  value: string[],
}

const ImageUpload: FC<ImageUploadProps> = (prosp) => {
  const { disabled, onChange, onRemove, value } = prosp;
  const [isMounted, setMounted] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  useLayoutEffect(() => {
    setMounted(true);
  },[setMounted])

  const setResource = (info: string | CloudinaryUploadWidgetInfo | undefined) => {
    if (info === undefined) return null;
    if (typeof info === 'string') return onChange(info);
    return onChange((info as CloudinaryUploadWidgetInfo).secure_url);
  }

  const onDelete = (url: string) => {
    const publicId = getImageId(url);

    startTransition(async () => {
      await axios.delete(`/api/image/${publicId}`);
      onRemove(url);
    })
  }

  if(!isMounted) return null;

  const showImages = (url: string, index: number) => {
    if(!url) return null;

    return (
      <div
      key={`${url}:${index}`}
      className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
    >
      <div
        className="z-10 absolute top-2 right-2"
      >
        <Button
          size="icon"
          type="button"
          variant="destructive"
          onClick={() => onDelete(url)}
          disabled={disabled || isPending}
        >
          <Trash/>
        </Button>
      </div>
      <Image
        fill
        className="object-cover"
        alt="Image"
        src={url}
      />
    </div>
    )
  }


  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {!!value.length && value.map(showImages)}
      </div>
      <CldUploadWidget 
        uploadPreset="tgtoxekb"
        onSuccess={(result, { widget }) => {
          setResource(result?.info);
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
              disabled={disabled || isPending}
              onClick={handleOnClick}
            >
              <ImagePlus
                className="h-4 w-4 mr-2"
              />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  )
}

export { ImageUpload };