import { v2 as cloudinary } from "cloudinary";
import { getImageId } from "./utils";
import { Image } from "@prisma/client";
 
export default cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryDelete = async (url: string, have?: boolean) => {
  try {
    const publicId = have ? url : getImageId(url);

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
}

const cloudinaryManyDelete = async (images: Image[])  => {
  try {
    const extractUrl = images.map((img) => getImageId(img.url));
    const results = await cloudinary.api.delete_resources(extractUrl);
    
    return results;
  } catch (error) {
    throw error;
  }
}

export { cloudinaryDelete, cloudinaryManyDelete }