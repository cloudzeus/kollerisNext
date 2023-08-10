

import axios from "axios";
import mongoose from "mongoose";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import SoftoneProduct from "../../../../server/models/newProductModel"
import { MtrCategory } from "../../../../server/models/categoriesModel";
import { Product } from "../../../../server/models/newProductModel";
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
     
        const page = req.body.page || 1;
        const limit = req.body.limit || 20;
        let skip = (page - 1) * limit
        console.log(page, limit)



        await connectMongo();

        let count = await Product.countDocuments()
        console.log(count)
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
            { $unwind: "$mtrcategory" }, 
            {
                $lookup: {
                    from: "mtrgroups",
                    localField: "softoneProduct.MTRGROUP",
                    foreignField: "softOne.MTRGROUP",
                    as: "mtrgroups"
                }
            },
            { $unwind: "$mtrgroups" }, // Convert mtrgroups from array to object
        
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
                    MTRL: 1,
                    ISACTIVE: 1,
                    name: 1,
                    categoryName: '$mtrcategory.categoryName',
                    mtrgroups: "$mtrgroups.groupName",
                    mtrsubgroup: "$mtrsubgroup.subGroupName",
                }
            }
            ,
            // { $skip: 30000  },
            { $limit: 5000},
         
        ])
        console.log(fetchProducts)
        return res.status(200).json({ success: true, result : fetchProducts, count: count });

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
        return res.status(200).json({ success: true, result: search, count: softoneCount });
    }

    if(action === 'insert') {
        await connectMongo();
        let softone = await SoftoneProduct.find({}, { MTRL: 1, NAME: 1, _id: 1 })
 
        let productsInsert = softone.map((item) => ({
            softoneProduct: item._id,
            name: item.NAME,
        }))
        let insert = await Product.insertMany(productsInsert)
        console.log(insert)
        return res.status(200).json({ success: true, result: insert});
      
    }
}

