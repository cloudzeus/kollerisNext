import https from 'https';
import fs from 'fs';


export default async function handler(req, res) {
const body = req.body;
console.log(body)


const REGION = ''; // If German region, set this to an empty string: ''
const BASE_HOSTNAME = 'storage.bunnycdn.com';
const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
const STORAGE_ZONE_NAME = 'kolleris';
const FILENAME_TO_UPLOAD = 'filenameyouwishtouse.img';
const FILE_PATH = '/images';
const ACCESS_KEY = 'd4374cd3-86c0-4943-903e419f73de-008e-4a66';

const uploadFile = async () => {
  const readStream = fs.createReadStream(FILE_PATH);

  const options = {
    method: 'PUT',
    host: HOSTNAME,
    path: `/${STORAGE_ZONE_NAME}/${FILENAME_TO_UPLOAD}`,
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

  req.on('error', (error) => {
    console.error(error);
  });

  readStream.pipe(req);
};

const main = async () => {
  await uploadFile();
};

main();
}