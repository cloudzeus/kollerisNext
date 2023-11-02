import https from 'https';
import fs from 'fs';
import axios from 'axios';

export default async function handler(req, res) {
const body = req.body;
const REGION = 'storage'; // If German region, set this to an empty string: ''
const BASE_HOSTNAME = 'storage.bunnycdn.com';
const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
const STORAGE_ZONE_NAME = 'kolleris';
const FILENAME_TO_UPLOAD = 'filenameyouwishtouse.img';
const FILE_PATH = '/images';
const ACCESS_KEY = 'd4374cd3-86c0-4943-903e419f73de-008e-4a66';


const fileName = 'test.jpg'
const storageZoneName = 'kolleris'
const region = 'storage'
const path = 'images'

const headers = {
  AccessKey: ACCESS_KEY,
  'Content-Type': 'application/octet-stream',
}
  
 let result = await axios.put(`https://${region}.bunnycdn.com/${storageZoneName}/${path}/${fileName}`, body , { headers: headers })
 console.log('result222')
 console.log(result.data)
 return res.status(200).json({ result: result.data })

// const uploadFile = async () => {
//   const readStream = fs.createReadStream(FILE_PATH);

//   const options = {
//     method: 'PUT',
//     host: HOSTNAME,
//     path: `/${STORAGE_ZONE_NAME}/${FILENAME_TO_UPLOAD}`,
//     headers: {
//       AccessKey: ACCESS_KEY,
//       'Content-Type': 'application/octet-stream',
//     },
//   };

//   const req = https.request(options, (res) => {
//     res.on('data', (chunk) => {
//       console.log(chunk.toString('utf8'));
//     });
//   });

//   req.on('error', (error) => {
//     console.error(error);
//   });

//   readStream.pipe(req);
// };

// const main = async () => {
//   await uploadFile();
// };

// main();
// }

}