"use client"

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { FC, useEffect, useLayoutEffect, useMemo, useState, useTransition } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import axios from "axios";
import { BoardColor } from "./board-color";

interface ColorUploadProps {
  value: string,
  disabled: boolean,
  onChange: (url: string) => void,
  loadingImage: string | undefined,
}

const ColorUpload: FC<ColorUploadProps> = (props) => {
  const { value, disabled, onChange, loadingImage } = props;
  const [isPending, startTransition] = useTransition();
  const [claerUrlImage, setClearUrlImage] = useState<string[]>( !!loadingImage ? [loadingImage] : [] );

  useLayoutEffect(() => {
    return () => {
      if (!!claerUrlImage.length) {
        const delImgList = claerUrlImage.filter(url => url !== loadingImage);
        if (!!delImgList.length) axios({
          method: "post",
          url: "/api/image/delete",
          data: delImgList
        })
      }
    }
  }, [claerUrlImage, loadingImage, setClearUrlImage])

  const requestDelete = async (url: string) => {
    const extractID = url.startsWith("http") ? url.split("/").pop()?.split(".").shift() : url;
    await axios.delete(`/api/image/delete/${extractID}`);

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
    if (info === undefined) return null;
    if (typeof info === 'string'){
      setClearUrlImage((prev => prev.concat([info])));
      return onChange(info);
    }
    
    const extractUrl = (info as CloudinaryUploadWidgetInfo).secure_url;
    setClearUrlImage((prev => prev.concat([extractUrl])));

    return onChange(extractUrl);
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