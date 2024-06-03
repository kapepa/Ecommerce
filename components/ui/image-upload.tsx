"use client"

import { FC, useLayoutEffect, useState, useTransition } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[],
  disabled: boolean,
  onChange: (val: string | undefined) => void,
  onDeleteImage: (url: string) => void,
}

const ImageUpload: FC<ImageUploadProps> = (prosp) => {
  const { value, disabled, onChange, onDeleteImage} = prosp;
  const [isMounted, setMounted] = useState<boolean>(false);

  useLayoutEffect(() => {
    setMounted(true);
  },[setMounted])

  if(!isMounted) return null;

  const setResource = (info: string | CloudinaryUploadWidgetInfo | undefined) => {
    if (!info) return null;
    if (typeof info === 'string') return onChange(info);

    const extractUrl = (info as CloudinaryUploadWidgetInfo).secure_url;
    return onChange(extractUrl);
  }

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
            onClick={() => onDeleteImage(url)}
            disabled={disabled}
          >
            <Trash/>
          </Button>
        </div>
        <Image
          fill
          className="object-cover"
          alt="Image"
          src={url}
          sizes="(max-width: 768px) 50vh, (max-width: 1200px) 50vw"
          priority
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
        options={{
          maxFiles: 1,
        }}
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
              Загрузить изображение
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  )
}

export { ImageUpload };