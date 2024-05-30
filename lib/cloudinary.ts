import { v2 as cloudinary } from "cloudinary";
import { getImageId } from "./utils";
import { Image } from "@prisma/client";
 
export default cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractPublicId(url: string) {
  const startIndex = url.lastIndexOf("/") + 1;
  const endIndex = url.lastIndexOf(".");
  return url.substring(startIndex, endIndex);
}

const cloudinaryManyDeleteByUrl = async (urls: string[]) => {
  try {
    for (const url of urls) {
      const publicId = extractPublicId(url);
      await cloudinary.uploader.destroy(publicId);
    }

    return "Images deleted successfully"
  } catch (error) {
    return "Error deleting images"
  }
}

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

export { cloudinaryDelete, cloudinaryManyDelete, cloudinaryManyDeleteByUrl }