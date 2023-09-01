

import axios from "axios";
import mongoose from "mongoose";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import SoftoneProduct from "../../../../server/models/newProductModel"
import { MtrCategory, MtrGroup, SubMtrGroup } from "../../../../server/models/categoriesModel";

import { Product } from "../../../../server/models/newProductModel";
import { ObjectId } from "mongodb";
import { original } from "@reduxjs/toolkit";


export const config = {
    api: {
      responseLimit: false,
    },
  }

export default async function handler(req, res) {
    const action = req.body.action;
 

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
                    _id: 1,
                    MTRL: '$softoneProduct.MTRL',
                    MTRGROUP: '$softoneProduct.MTRGROUP',
                    MTRCATEGORY: '$softoneProduct.MTRCATEGORY',
                    CCCSUBGOUP2: '$softoneProduct.CCCSUBGOUP2',
                    CODE: '$softoneProduct.CODE',
                    CODE1: '$softoneProduct.CODE1',
                    CODE2: '$softoneProduct.CODE2',
                    UPDDATE: '$softoneProduct.UPDDATE',
                    INTRASTAT: '$softoneProduct.INTRASTAT',  
                    VAT: '$softoneProduct.VAT',
                    PRICER: '$softoneProduct.PRICER',
                    PRICEW: '$softoneProduct.PRICEW',
                    PRICER01: '$softoneProduct.PRICER01',
                    PRICER02: '$softoneProduct.PRICER02',
                    PRICER03: '$softoneProduct.PRICER03',
                    PRICER04: '$softoneProduct.PRICER04',
                    PRICER05: '$softoneProduct.PRICER05',
                    PRICEW01: '$softoneProduct.PRICEW01',
                    PRICEW02: '$softoneProduct.PRICEW02',
                    PRICEW03: '$softoneProduct.PRICEW03',
                    PRICEW04: '$softoneProduct.PRICEW04',
                    PRICEW05: '$softoneProduct.PRICEW05',
                    ISACTIVE: '$softoneProduct.ISACTIVE',
                    
                    UPDDATE: '$softoneProduct.UPDDATE',
                    mrtmark: '$mrtmark.name',
                    mrtmanufact: '$manufacturers.softOne.NAME',
                    MTRMANFCTR: '$manufacturers.softOne.MTRMANFCTR',
                    name: 1,
                    description: 1,
                    localized: 1,
                    updatedFrom: 1,
                    updatedAt: 1,
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
    
    if(action === 'update') {
        let {data} = req.body;
        console.log(data.updatedFrom)
        let obj = {
           
            MTRL: data.MTRL[0],
            ISACTIVE: data.ISACTIVE[0],
            NAME: data.name,
            CODE: data.CODE[0],
            CODE1: data.CODE1[0],
            CODE2: data.CODE2[0],
            MTRMANFCTR: data.MTRMANFCTR[0],
            VAT: data.VAT[0],
            PRICER: data.PRICER[0],
            PRICEW: data.PRICEW[0],
            PRICER01: data.PRICER01,
            PRICER02: data.PRICER02,
            PRICER03: data.PRICER03,
            PRICER04: data.PRICER04,
            PRICER05: data.PRICER05,
            PRICEW01: data.PRICEW01,
            PRICEW02: data.PRICEW02,
            PRICEW03: data.PRICEW03,
            PRICEW04: data.PRICEW04,
            PRICEW05: data.PRICEW05,
        }
        console.log(obj)

        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrl`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                ...obj
            })
        });
        let responseJSON = await response.json();
        // if(responseJSON.error) return res.status(400).json({ success: false, result: null });

        try {
            await connectMongo();

          

            let result = await Product.updateOne({
                description: data.description,
                updatedFrom: data.updatedFrom
            })


            let result2 = await SoftoneProduct.updateOne({
                ...obj
            })

            console.log('result')
            console.log(result)
            return res.status(200).json({ success: true, result: result, result2: result2 });


        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
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
        let {data, gridData} = req.body;

        //All products that will change classes
        //Από εργαλεία χειρός θα ανήκει σε Ηλεκτρικά εργαλεία πχ
     

        console.log(data)

        // async function updateSoftone(item) {
        //     console.log(item.MTRL)
        //     console.log(item.name)
        //     let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrlCat`;
        //     const response = await fetch(URL, {
        //               method: 'POST',
        //               body: JSON.stringify({
        //                   username: "Service",
        //                   password: "Service",
        //                   MTRGROUP: item.MTRGROUP,
        //                   MTRCATEGORY: item.MTRCATEGORY,
        //                   CCCSUBGOUP2: item.CCCSUBGOUP2,
        //                   CCCSUBGROUP3: ""
        //               })
        //           });
        //   let responseJSON = await response.json();
        //   console.log(responseJSON)
        //   if(responseJSON.success == 'false') return res.status(400).json({ success: false, result: null, error: 'Softone Update Error' });
        // }


        // gridData && gridData.map((item) => {
        //     updateSoftone(item);
        // })
       
        
      
        // try {
         
        //     await connectMongo();
        //     let result = await SoftoneProduct.updateOne({
        //         ...data
        //     })
        //     console.log(result)
          
          
        // } catch (e) {
        //     console.log(e)
        // }
    }   
}

