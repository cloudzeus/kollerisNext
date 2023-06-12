
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set up the multer middleware to handle file uploads
const upload = multer({ dest: 'public/uploads/' });

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser since multer will handle the request
  },
};

export default async function handler(req, res) {
  // Use the multer middleware to handle multiple file uploads
  upload.array('files')(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error uploading files' });
    }

    const { files } = req;

    const uploadedURLs = [];

    // Process each uploaded file
    for (const file of files) {
      const timestamp = Date.now();
      const newFileName = `${timestamp}-${file.originalname}`;

      try {
        fs.renameSync(file.path, path.join('public/uploads/', newFileName));

        const publicURL = `/uploads/${newFileName}`;
        uploadedURLs.push(publicURL);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Error saving files',urls: null });
      }
    }

    return res.status(200).json({success: true, urls: uploadedURLs });
  });
}