// This is an example of how to read a JSON Web Token from an API route
import axios from 'axios';

const CLIENT_ID = process.env.CLIENT_ID;
const URL = process.env.URL;
const USERNAME=process.env.USERNAME
const PASSWORD=process.env.PASSWORD
const APP_ID = process.env.APP_ID
const COMPANY=process.env.COMPANY
const BRANCH=process.env.BRANCH
const MODULE= process.env.MODULE
const REFID= process.env.REFID
const VERSION=1


let body ={
    service: "login",
    username: process.env.USER_NAME,
    password: PASSWORD,
    appId: APP_ID,
    COMPANY: COMPANY,
    BRANCH: BRANCH,
    MODULE: MODULE,
    REFID: REFID,
    VERSION: VERSION,
}

console.log('body', body)



export default async (req, res) => {
    let table = req.body.table;
    let fields = req.body.fields;
    
    const loginApi = await axios.post(URL, body)
    let clientId = loginApi.data.clientID
    //return if failed to fetch clientID
    if(!clientId) return res.status(401).json({message: "Identification failed"})
    const client = axios.create({
        baseURL: URL
      });
      
    client.defaults.headers['Content-Type'] = 'application/json';

    const response = await client.post(URL, {
        clientId: clientId,
        appId: APP_ID,
        version: VERSION,
        service: "GetTable",
        TABLE: table,
        FIELDS: fields,
    })
    console.log('res', JSON.stringify(response .data))
    if(!response ) return res.status(401).json({message: "No data found"})
    return res.status(200).json(response .data)
}