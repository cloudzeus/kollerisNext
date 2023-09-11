

import axios from "axios";
import format from "date-fns/format";
import mongoose, { connect, mongo } from "mongoose";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import { MtrCategory, MtrGroup, SubMtrGroup } from "../../../../server/models/categoriesModel";

import { Product } from "../../../../server/models/newProductModel";


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
                $match: {
                    "softoneProduct.MTRCATEGORY": 10
                },
            },
            {
                $lookup: {
                    from: 'mtrgroups',
                    localField: 'softoneProduct.MTRGROUP',
                    foreignField: 'softOne.MTRGROUP',
                    as: 'mtrgroup'
                }
            },
           
            
          
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
            {$skip: skip},
            {$limit: limit}
        ]

        let count = ""
        //FILTER WITH MTRCATEGORY
        
        // if(categoryID !== null) {
        //     console.log('are we here')

        //     pipeline.splice(1, 0, {
        //         $match: {
        //             "softoneProduct.MTRCATEGORY": categoryID
        //         }
        //     })
        // } 
      
        if(groupID !== null ) {
            pipeline.shift({
                $match: {
                    "softoneProduct.MTRGROUP": groupID
                }
            })
        } 

      
      
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
        } 


        if(searchTerm !== null && searchTerm !== '') {
            let res = await Product.countDocuments({
                "name": {  // Assuming the name field inside the softoneProduct is what you want to search
                    $regex: trimmedSearchTerm ,
                    $options: 'i'  // Case-insensitive match
                }
            });
            

         
            count = res;
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
        console.log(pipeline)
        console.log(result)
        
       
    
    
        return res.status(200).json({ success: true, totalRecords: count, result: result  });
    }


    
    if(action === 'findCategories') {
        await connectMongo();
        let response = await MtrCategory.find({}, {categoryName: 1, "softOne.MTRCATEGORY": 1 , _id: 0});
        try {
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

 
}



