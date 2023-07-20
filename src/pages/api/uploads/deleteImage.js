
import multer from 'multer';
import path from 'path';
import fs from 'fs';


export default async function handler(req, res) {
    const { filename } = req.body;
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Invalid filename provided' });
    }
  
    const folderPath = path.join('public/uploads/');
    const fullPath = path.join(folderPath, filename);

    fs.unlink(fullPath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting the image' });
      }
      return res.json({ success: true, message: 'Image deleted successfully' });
    });

}