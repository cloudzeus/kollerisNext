

import axios from "axios";
import format from "date-fns/format";
import mongoose, { mongo } from "mongoose";
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
                    availability: 1,
                    localized: 1,
                    updatedFrom: 1,
                    updatedAt: 1,
                    categoryName: '$mtrcategory.categoryName',
                    mtrgroups: "$mtrgroups.groupName",
                    mtrsubgroup: "$mtrsubgroup.subGroupName",
                }
            }
            ,
            
           
        ]
  


        let fetchProducts = await Product.aggregate(pipeline)
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAvailability`;
         const response = await fetch(URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                    })
                });

        const responseJSON = await response.json();
        // // console.log(responseJSON)

        // setInterval(availabilityInterval, 1500);

        return res.status(200).json({ success: true, result : fetchProducts, count:count});

    }
    
 


    if(action === 'filterCategories') {
        Product.createIndexes();
        let categoryID = req.body.categoryID;
        let groupID = req.body.groupID;
        let searchTerm = req.body.searchTerm;
        let trimmedSearchTerm = searchTerm && searchTerm.trim();

        let {skip, limit} = req.body;
        console.log(categoryID, groupID, searchTerm)
        console.log('skip' + skip)
        console.log('limit' + limit)
        

        await connectMongo();
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
                    from: 'mtrgroups',
                    localField: 'softoneProduct.MTRGROUP',
                    foreignField: 'softOne.MTRGROUP',
                    as: 'mtrgroup'
                }
            },
            // {
            //     $unwind: "$softoneProduct",
            // },
           
            // {
            //     $unwind: "$mtrcategory",
            // },
            // {
            //     $unwind: "$mtrgroup",
            // },
            
            {
                $project: {
                    "name": 1,
                    "description": 1,
                    "availability": 1,
                    "localized": 1,
                    "softoneProduct": 1,
                    "mtrcategory.categoryName": 1,
                    "mtrgroup.groupName": 1,
                }
            },
            // { $skip: skip },
            // { $limit: limit }
        ]

        
        //FILTER WITH MTRCATEGORY
        if(categoryID !== null) {
            pipeline.push({
                $match: {
                    "softoneProduct.MTRCATEGORY": categoryID
                }
            })
        } 
      
        if(groupID !== null ) {
            pipeline.push({
                $match: {
                    "softoneProduct.MTRGROUP": groupID
                }
            })
        } 

        // if(searchTerm !== null) {
        //     pipeline.unshift( {
        //         $match: {
        //             "softoneProduct.name": {  // Assuming the name field inside the softoneProduct is what you want to search
        //                 $regex: searchTerm,
        //                 $options: 'i'  // Case-insensitive match
        //             }
        //         }
        //     })
        // }

        let count = ""
        if(searchTerm === null || searchTerm === '') {
            count = await Product.countDocuments();
            pipeline.shift({
                $match: {
                    "name": {  // Assuming the name field inside the softoneProduct is what you want to search
                        $regex: trimmedSearchTerm ,
                        $options: 'i'  // Case-insensitive match
                    }
                }
        })
        } else {
            pipeline.unshift({
                    $match: {
                        "name": {  // Assuming the name field inside the softoneProduct is what you want to search
                            $regex:  trimmedSearchTerm ,
                            $options: 'i'  // Case-insensitive match
                        }
                    }
            })
         
        }
      
        let result = await Product.aggregate(pipeline)
        if(searchTerm !== null || searchTerm !== '') {
            count = result.length;
        }
        console.log(JSON.stringify(pipeline))
       
    
        // console.log('count')
        // console.log(count)
        // console.log('result')
     
        return res.status(200).json({ success: true, totalRecords: count, result: result  });
    }
}



