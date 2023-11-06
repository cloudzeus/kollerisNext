import axios from "axios";
let AccessKey = process.env.NEXT_PUBLIC_BUNNY_KEY;

const storageZoneName = 'kolleris'
const region = 'storage'
const path = 'images'



export default async function handler(req, res) {
    const {fileName}= req.body
    let result = await axios.get(`https://${region}.bunnycdn.com/${storageZoneName}/${fileName}`, { headers:{
        AccessKey: AccessKey,
    } })
    console.log(result.data)
   return res.status(200).json({result: result.data})
}