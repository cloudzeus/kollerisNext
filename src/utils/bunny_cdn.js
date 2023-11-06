import axios from "axios";
let AccessKey = process.env.NEXT_PUBLIC_BUNNY_KEY;

const storageZoneName = 'kolleris'
const region = 'storage'
const path = 'images'
const headers = {
  AccessKey: AccessKey,
  'Content-Type': 'application/octet-stream',
}

export async function uploadBunny(data) {
    const fileName = 'test09.jpg'
    let result = await axios.put(`https://${region}.bunnycdn.com/${storageZoneName}/${fileName}`, data , { headers: headers })
    return result.data
}


export async function getBunnyFile(fileName) {
    let result = await axios.get(`https://${region}.bunnycdn.com/${storageZoneName}/${fileName}`, { headers:{
        AccessKey: AccessKey,
    } })
    console.log(result.data)
    return result.data
}