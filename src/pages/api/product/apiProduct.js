

import axios from "axios";
import mongoose from "mongoose";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import SoftoneProduct from "../../../../server/models/newProductModel"
import { MtrCategory } from "../../../../server/models/categoriesModel";
import { Product } from "../../../../server/models/newProductModel";
import { ObjectId } from "mongodb";


export const config = {
    api: {
      responseLimit: false,
    },
  }

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
        
        const {rows, lastMTRLId,  firstMTRLId, sign, limit, skip} = req.body;
      
        
        await connectMongo();
        let count = await Product.countDocuments()


      
        let pipeline = [
            {
                $lookup: {
                    from: "softoneproducts",
                    localField: "softoneProduct",
                    foreignField: "_id",
                    as: "softoneProduct"
                },
              
            },
            // {
            //     $unwind: {
            //         path: "$softoneProduct",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
            {
                $lookup: {
                    from: 'mtrcategories',
                    localField: 'softoneProduct.MTRCATEGORY',
                    foreignField: 'softOne.MTRCATEGORY',
                    as: 'mtrcategory'
                }
            },
            // {
            //     $unwind: {
            //         path: "$mtrcategory",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
            {
                $lookup: {
                    from: "mtrgroups",
                    localField: "softoneProduct.MTRGROUP",
                    foreignField: "softOne.MTRGROUP",
                    as: "mtrgroups"
                }
            },
            // {
            //     $unwind: {
            //         path: "$mtrgroups",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
        
            {
                $lookup: {
                    from: "markes",
                    localField: "softoneProduct.MTRMARK",
                    foreignField: "softOne.MTRMARK",
                    as: "mrtmark"
                }
            },
            // {
            //     $unwind: {
            //         path: "$mrtmark",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
            {
                $lookup: {
                    from: "submtrgroups",
                    localField: "softoneProduct.CCCSUBGOUP2",
                    foreignField: "softOne.cccSubgroup2",
                    as: "mtrsubgroup"
                }
            },
            
            // {
            //     $unwind: {
            //         path: "$mtrsubgroup",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
            {
                $project: {
                    _id: 0,
                    MTRL: '$softoneProduct.MTRL',
                    CODE: '$softoneProduct.CODE',
                    CODE1: '$softoneProduct.CODE1',
                    mrtmark: '$mrtmark.name',
                    ISACTIVE: 1,
                    name: 1,
                    categoryName: '$mtrcategory.categoryName',
                    mtrgroups: "$mtrgroups.groupName",
                    mtrsubgroup: "$mtrsubgroup.subGroupName",
                }
            }
            ,
            // { $sort: { MTRL: 1 } },  // Sort by MTRL
            // {$skip: skip},
            // { $limit: limit }  // Limit the results
        ]

  


        let fetchProducts = await Product.aggregate(pipeline)
        console.log(fetchProducts)
        return res.status(200).json({ success: true, result : fetchProducts, count:count});

    }


    if (action === 'search') {
      

        let query = req.body.query;
        await connectMongo();
        // Construct a case-insensitive regex pattern for the search query

        const regexPattern = new RegExp(query, 'i');
        let search = await SoftoneProduct.find({ NAME: regexPattern })
        console.log(search)
        return res.status(200).json({ success: true, result: search});
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

