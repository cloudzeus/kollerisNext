import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set up the multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const filePath = path.join('public/uploads/', file.originalname);
    if (fs.existsSync(filePath)) {
      return cb(new Error('File already exists'));
    }
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser since multer will handle the request
  },
};

export default async function handler(req, res) {
  return new Promise((resolve, reject) => {
    upload.single('file')(req, res, function (err) {
      if (err) {
        console.error(err);
        return reject({ statusCode: 500, message: 'Error uploading file' });
      }

      const { file } = req;
      if (!file) {
        return reject({ statusCode: 500, message: 'Error uploading file' });
      }

      const publicURL = file.originalname;
      return resolve({ statusCode: 200, body: { success: true, url: publicURL } });
    });
  })
    .then(({ statusCode, body }) => {
      res.status(statusCode).json(body);
    })
    .catch(({ statusCode, message }) => {
      res.status(statusCode).json({ error: message });
    });
}