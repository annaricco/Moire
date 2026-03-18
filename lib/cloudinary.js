import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file) {
  const result = await cloudinary.uploader.upload(file, {
    folder: 'moire',
    transformation: [
      { width: 800, height: 1000, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
  return result.secure_url;
}

export default cloudinary;
