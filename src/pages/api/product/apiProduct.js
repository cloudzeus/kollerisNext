

import axios from "axios";
import mongoose from "mongoose";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import SoftoneProduct from "../../../../server/models/newProductModel"


export default async function handler(req, res) {
    const action = req.body.action;
    // let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/getMtrl`;
  
    // const response = await fetch(URL, {
    //                 method: 'POST',
    //                 body: JSON.stringify({
    //                     username: "Service",
    //                     password: "Service",
    //                 })
    //             });
    // let buffer = await translateData(response)
    // await connectMongo();
    // let insert = await SoftoneProduct.insertMany(buffer.result)
    
    // return res.status(200).json({ success: true, result :   buffer });

    if(action === 'findSoftoneProducts') {

//  let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/getMtrl`;
  
//     const response = await fetch(URL, {
//                     method: 'POST',
//                     body: JSON.stringify({
//                         username: "Service",
//                         password: "Service",
//                     })
//                 });
//     let buffer = await translateData(response)
//     await connectMongo();
//     let insert = await SoftoneProduct.insertMany(buffer.result)
    
//     return res.status(200).json({ success: true, result :   buffer });
        
        console.log('findSoftoneProducts')
        await connectMongo();
        let softoneresult = await SoftoneProduct.find({}).limit(10);
        console.log('-----------------')
        return res.status(200).json({ success: true, result : softoneresult  });
    }
}   
