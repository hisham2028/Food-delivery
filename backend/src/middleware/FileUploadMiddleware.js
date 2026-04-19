import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'food-delivery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill' }]
  },
});

class FileUploadMiddleware {
  upload(fieldName = 'image') {
    return multer({ storage }).single(fieldName);
  }

  uploadWithPreset(preset, fieldName = 'file') {
    return multer({ storage }).single(fieldName);
  }
}

export default new FileUploadMiddleware();
export { cloudinary };