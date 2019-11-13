const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  use_filename: true,
  folder: '/', // Cloudinary folder name
  allowedFormats: ['jpg', 'png'],
  filename(req, file, cb) {
    cb(null, req.body.id);
  },
});

const upload = multer({ storage });

module.exports = upload;
