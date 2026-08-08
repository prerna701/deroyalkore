import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { ApiError } from '../utils/ApiError';

export const galleryUploadDir = path.join(process.cwd(), 'uploads', 'gallery');

fs.mkdirSync(galleryUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, galleryUploadDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    callback(null, safeName);
  },
});

export const galleryUpload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB per image
    files: 20,                  // max 20 images at once
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(ApiError.badRequest('Only image uploads are allowed'));
      return;
    }
    callback(null, true);
  },
});
