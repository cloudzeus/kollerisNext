export default function handler(req, res) {
    const {fileName} = req.body;
    try {
      // Assuming the files are named sequentially and stored in the "public" folder
      const currentFileIndex = parseInt(req.query.index || '0');
      const nextFileIndex = currentFileIndex + 1;
      const nextFileName = `file${nextFileIndex}.xlsx`;
      const nextFileUrl = `/file/${nextFileName}`; // Adjust this according to your file storage path
      res.status(200).json({ url: nextFileUrl });
    } catch (error) {
      console.error('Error fetching next file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }