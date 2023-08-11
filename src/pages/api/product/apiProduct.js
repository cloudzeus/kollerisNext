

import axios from "axios";
import mongoose from "mongoose";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import SoftoneProduct from "../../../../server/models/newProductModel"
import { MtrCategory } from "../../../../server/models/categoriesModel";
import { Product } from "../../../../server/models/newProductModel";
import { ObjectId } from "mongodb";


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

    if (action === 'findSoftoneProducts') {
        
        const {offset, limit} = req.body;
        
        

        
        await connectMongo();
        let count = await Product.countDocuments()
        let fetchProducts = await Product.aggregate([
            {
                $lookup: {
                    from: "softoneproducts",
                    localField: "softoneProduct",
                    foreignField: "_id",
                    as: "softoneProduct"
                }
            },
            { $unwind: "$softoneProduct" }, 
            {
                $lookup: {
                    from: 'mtrcategories',
                    localField: 'softoneProduct.MTRCATEGORY',
                    foreignField: 'softOne.MTRCATEGORY',
                    as: 'mtrcategory'
                }
            },
            {
                $lookup: {
                    from: "mtrgroups",
                    localField: "softoneProduct.MTRGROUP",
                    foreignField: "softOne.MTRGROUP",
                    as: "mtrgroups"
                }
            },
            // { $unwind: "$mtrgroups" }, // Convert mtrgroups from array to object
        
            {
                $lookup: {
                    from: "markes",
                    localField: "softoneProduct.MTRMARK",
                    foreignField: "softOne.MTRMARK",
                    as: "mrtmark"
                }
            },
            {
                $lookup: {
                    from: "submtrgroups",
                    localField: "softoneProduct.CCCSUBGOUP2",
                    foreignField: "softOne.cccSubgroup2",
                    as: "mtrsubgroup"
                }
            },
        
            {
                $project: {
                    MTRL: '$softoneproducts.MTRL',
                    ISACTIVE: 1,
                    name: 1,
                    categoryName: '$mtrcategory.categoryName',
                    mtrgroups: "$mtrgroups.groupName",
                    mtrsubgroup: "$mtrsubgroup.subGroupName",
                    
                }
            }
            ,
            { $skip: offset },  // Skip the documents
            { $limit: limit },  // Limit the results
        ])
        console.log(fetchProducts.length)
        console.log(fetchProducts[fetchProducts.length - 1])
        return res.status(200).json({ success: true, result : fetchProducts, count: count});

    }


    if (action === 'search') {
        const page = req.body.page || 1;
        const limit = req.body.limit || 20;

        let query = req.body.query;
        console.log(query)
        await connectMongo();
        // Construct a case-insensitive regex pattern for the search query

        const regexPattern = new RegExp(query, 'i');
        let search = await SoftoneProduct.find({ NAME: regexPattern })
            .skip(limit * (page - 1))
            .limit(limit);
        let softoneCount = await SoftoneProduct.countDocuments({ NAME: regexPattern })
        return res.status(200).json({ success: true, result: search, count: Math.floor(softoneCount / limit) });
    }

    if(action === 'insert') {
        await connectMongo();
        let softone = await SoftoneProduct.find({}, { MTRL: 1, NAME: 1, _id: 1 })
 
        let productsInsert = softone.map((item) => ({
            softoneProduct: item._id,
            name: item.NAME,
        }))
        let insert = await Product.insertMany(productsInsert)
        return res.status(200).json({ success: true, result: insert});
      
    }
}

