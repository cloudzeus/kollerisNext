import formidable from 'formidable';
import fs from 'fs';
import https from 'https';



const REGION = '';
const BASE_HOSTNAME = 'storage.bunnycdn.com';
const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
const STORAGE_ZONE_NAME = 'kolleris';
const ACCESS_KEY = 'd4374cd3-86c0-4943-903e419f73de-008e-4a66';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadFileToBunnyCDN = async (file) => {
  const filename = 'uploadedFile.txt'; // Modify this to your desired filename on BunnyCDN

  const options = {
    method: 'PUT',
    host: HOSTNAME,
    path: `/${STORAGE_ZONE_NAME}/${filename}`,
    headers: {
      AccessKey: ACCESS_KEY,
      'Content-Type': 'application/octet-stream',
    },
  };

  const req = https.request(options, (res) => {
    res.on('data', (chunk) => {
      console.log(chunk.toString('utf8'));
    });
  });

  const readStream = fs.createReadStream(file.path);
  readStream.pipe(req);
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      res.status(400).end();
      return;
    }

    const file = files.file;
    uploadFileToBunnyCDN(file);
    res.status(201).end();
  });
}