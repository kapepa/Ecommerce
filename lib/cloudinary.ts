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
    const publicId = have ? url : extractPublicId(url);

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
}

const cloudinaryManyDelete = async (images: Image[])  => {
  try {
    const extractUrl = images.map((img) => extractPublicId(img.url));
    const results = await cloudinary.api.delete_resources(extractUrl);
    
    return results;
  } catch (error) {
    throw error;
  }
}

const cloudinaryDeleteManyByUrl = async (images: string[])  => {
  try {
    const extractUrl = images.map((img) => extractPublicId(img));
    const results = await cloudinary.api.delete_resources(extractUrl);
    
    return results;
  } catch (error) {
    throw error;
  }
}

const cloudinaryfetchAllImages = async () => {
  try {
    const result = await cloudinary.api.resources({ type: 'upload', max_results: 10000 });
    const imageUrls: string[] = result.resources.map((resource: any) => resource.url);

    return imageUrls;
  } catch (error) {
    throw error;
  }
}

export { cloudinaryDelete, cloudinaryManyDelete, cloudinaryManyDeleteByUrl, cloudinaryDeleteManyByUrl, cloudinaryfetchAllImages }