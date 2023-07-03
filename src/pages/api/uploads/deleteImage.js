import fs from 'fs';

export default function handler(req, res) {
  const {name} =req.body
console.log(name)
  const filePath = `public/uploads/${filename}`;

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlinkSync(filePath);
    return res.json({ message: 'Image deleted successfully' });
  } else {
    return res.status(404).json({ error: 'Image not found' });
  }
}