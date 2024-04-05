"use client"

import { FC, useLayoutEffect, useState } from "react";
import { CldImage, CldUploadWidget, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  disabled: boolean,
  onChange: (val: string | undefined) => void,
  onRemove: (val: string) => void,
  value: string[],
}

const ImageUpload: FC<ImageUploadProps> = (prosp) => {
  const { disabled, onChange, onRemove, value } = prosp;
  const [isMounted, setMounted] =  useState<boolean>(false);

  useLayoutEffect(() => {
    setMounted(true);
  })

  const setResource = (info: string | CloudinaryUploadWidgetInfo | undefined) => {
    if (info === undefined || typeof info === 'string') return onChange(info);
    return onChange((info as CloudinaryUploadWidgetInfo).secure_url);
  }

  if(!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url: string, index: number) => (
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
                onClick={() => onRemove(url)}
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
        ))}
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
              disabled={disabled}
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