import axios from "axios";
let AccessKey = process.env.NEXT_PUBLIC_BUNNY_KEY;

const storageZoneName = 'kolleris'
const region = 'storage'
const path = 'images'
const headers = {
  AccessKey: AccessKey,
  'Content-Type': 'application/octet-stream',
}

export  async function uploadBunny(data) {
    const fileName = 'test08.jpg'
    let result = await axios.put(`https://${region}.bunnycdn.com/${storageZoneName}/${fileName}`, data , { headers: headers })
    console.log(result.data)
    return result.data
}