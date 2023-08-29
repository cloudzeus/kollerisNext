

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
            {
                $lookup: {
                    from: 'manufacturers',
                    localField: 'softoneProduct.MTRMANFCTR',
                    foreignField: 'softOne.MTRMANFCTR',
                    as: 'manufacturers'
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
                    _id: 1,
                    MTRL: '$softoneProduct.MTRL',
                    CODE: '$softoneProduct.CODE',
                    CODE1: '$softoneProduct.CODE1',
                    CODE2: '$softoneProduct.CODE2',
                    VAT: '$softoneProduct.VAT',
                    PRICER: '$softoneProduct.PRICER',
                    UPDDATE: '$softoneProduct.UPDDATE',
                    mrtmark: '$mrtmark.name',
                    mrtmanufact: '$manufacturers.softOne.NAME',
                    ISACTIVE: 1,
                    name: 1,
                    localized: 1,
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
        
        return res.status(200).json({ success: true, result : fetchProducts, count:count});

    }

    if(action === "translate") {
		let data = req.body.data;
		let {id, fieldName, index} = req.body
		
		try {
			await connectMongo();
			const updated = await Product.updateOne(
				{_id: id},
                {$set: {localized: {
                    fieldName: fieldName,
                    translations: data
                }}}
			  	);
			return res.status(200).json({ success: true, result: updated  });
		} catch(e) {
			return res.status(400).json({ success: false, result: null });
		}
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
    //     await connectMongo();
    //      let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/getMtrl`;
    // const response = await fetch(URL, {
    //                 method: 'POST',
    //                 body: JSON.stringify({
    //                     username: "Service",
    //                     password: "Service",
    //                 })
    //             });
    // let buffer = await translateData(response)
    await connectMongo();
    // let insert1 = await SoftoneProduct.insertMany(buffer.result)

        
        let softone = await SoftoneProduct.find({}, { MTRL: 1, NAME: 1, _id: 1 })
 
        let productsInsert = softone.map((item) => ({
            softoneProduct: item._id,
            name: item.NAME,
        }))
        let insert = await Product.insertMany(productsInsert)
        console.log(insert)
        return res.status(200).json({ success: true, result: insert});
      
    }

    if(action === 'updateClass') {
     
    let {category, group, subgroup, } = req.body.object
       let softoneMTRCATEGORY = req.body.object.categoryId;
       let softoneMTRGROUP = req.body.object.groupId;
       let softoneMTRSUBGROUP = req.body.object.subgroupId;

       console.log(softoneMTRCATEGORY)
        console.log(softoneMTRGROUP)
        console.log(softoneMTRSUBGROUP)
        console.log(category)
        console.log(group)
        console.log(subgroup)
    
    }   
}

