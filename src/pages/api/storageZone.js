
import axios from 'axios';

const REGION = 'storage'; // If German region, set this to an empty string: ''
const BASE_HOSTNAME = 'storage.bunnycdn.com';
const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
const STORAGE_ZONE_NAME = 'kolleris';
const FILENAME_TO_UPLOAD = 'filenameyouwishtouse.img';
const FILE_PATH = '/images';
const ACCESS_KEY = 'd4374cd3-86c0-4943-903e419f73de-008e-4a66';


const fileName = 'test02.jpg'
const storageZoneName = 'kolleris'
const region = 'storage'
const path = 'images'


export default async function handler(req, res) {
const data = req.body;
console.log('file')
console.log(data)


// const headers = {
//   AccessKey: ACCESS_KEY,
//   'Content-Type': 'application/octet-stream',
// }
  
//  let result = await axios.put(`https://${region}.bunnycdn.com/${storageZoneName}/${fileName}`, data , { headers: headers })
//  console.log('result bunny cdn')
//  console.log(result.data)
//  return res.status(200).json({ result: result.data })



}