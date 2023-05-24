import bcrypt from 'bcrypt';
import User from '../../../../server/models/contactInfoModel';
import connectMongo from '../../../../server/config';
import axios from 'axios';
export default async function handler(req, res) {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json",  'text/html; charset=utf-8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    var raw = JSON.stringify({
      clientID: "9J8pHMvuKKLCQ2KsC5SbDKLHLLPVSLL5SdXJI2KtHNLrLt1CG4bcP5HKIML3G7KbDKGbDZ1KIq5aNoKrGqLL9JL4LK53ItPGHLTK9JL4LrP0MKKbDKKbDqP4OqrLJ5DIHK5LKYKrGa12LM54S45PQ79KJrXJG4reSKLCS45NSa10G5PGGq1MH50bDK9GIL5HGoKrGt509JOmQ4LQR6HIJbybDqDoIYKrGqnbL5zHHLPLLK949JOmT6D9IqXLLLL1LbHFPMDATcnpHtHvTbSbDKHPOa9eS590KqbbLbz1",
      appId: "1001",
      SqlName: "100",
      service: "SqlData"
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    try {
     
    let resJson = await axios.post('https://kolleris.oncloud.gr/s1services', raw);
    let response = resJson?.data?.rows
    console.log(resJson.data.rows)
    res.status(200).json({response});
    res.end();
    // let resJson = await  fetch("https://kolleris.oncloud.gr/s1services", requestOptions)
    // let response = await resJson.json();
    // // console.log(response)
    // res.status(200).json({response});
    // res.end();
    } catch(e) {
      return res.status(400).json({ success: false, error: 'failed to fetch users' });
    }


}



