import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads an image buffer to Cloudinary and returns the secure URL.
 * @param fileBuffer The buffer containing the image file data.
 * @param folder The destination folder in Cloudinary (defaults to 'products').
 * @returns A promise that resolves to the secure URL of the uploaded image.
 */
export async function uploadImage(fileBuffer: Buffer, folder: string = 'products'): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary upload completed with no result.'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export default cloudinary;
