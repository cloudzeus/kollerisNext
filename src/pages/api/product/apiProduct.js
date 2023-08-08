

import axios from "axios";
import mongoose from "mongoose";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import SoftoneProduct from "../../../../server/models/newProductModel"
import { MtrCategory } from "../../../../server/models/categoriesModel";

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
      
        const page = req.body.page || 1;
        const limit = req.body.limit || 20;
        console.log('findSoftoneProducts')
        await connectMongo();
        let softoneresult = await SoftoneProduct.find({}).lean()
        .skip(limit * (page - 1))
        .limit(limit);
        console.log(softoneresult)

        // let categories = await MtrCategory.find({'softOne.MTRCATEGORY': 11, },'categoryName').lean()
        // console.log('categories' + JSON.stringify(categories))
        
        let softoneCount= await SoftoneProduct.countDocuments({})
        console.log(softoneCount)
        console.log('-----------------')
        return res.status(200).json({ success: true, result : softoneresult, count: softoneCount });
    }


    if(action === 'search') {
        const page = req.body.page || 1;
        const limit = req.body.limit || 20;

        let query = req.body.query;
        console.log(query)
        await connectMongo();
        // Construct a case-insensitive regex pattern for the search query
        
        const regexPattern = new RegExp(query, 'i');
        console.log(regexPattern)
        let search = await SoftoneProduct.find({ NAME: regexPattern })
        .skip(limit * (page - 1))
        .limit(limit);
        console.log(search)
        let softoneCount= await SoftoneProduct.countDocuments({NAME: regexPattern})
        console.log(softoneCount)
        return res.status(200).json({ success: true, result : search, count: softoneCount});
    }
}   

