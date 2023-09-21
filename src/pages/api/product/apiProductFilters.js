

import axios from "axios";
import format from "date-fns/format";
import mongoose, { connect, mongo } from "mongoose";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import { MtrCategory, MtrGroup, SubMtrGroup } from "../../../../server/models/categoriesModel";
import SoftoneProduct, { Product } from "../../../../server/models/newProductModel";


export const config = {
    api: {
        responseLimit: false,
    },
}

export default async function handler(req, res) {
    const action = req.body.action;


   


    if (action === 'filterCategories') {
        Product.createIndexes();
        let {groupID,categoryID, subgroupID, searchTerm, skip, limit } = req.body;
        
        let trimmedSearchTerm = searchTerm && searchTerm.trim();


        
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
                $unwind: {
                    path: '$softoneProduct',
                    preserveNullAndEmptyArrays: true,

                }
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
                    from: "mtrgroups",
                    localField: "softoneProduct.MTRGROUP",
                    foreignField: "softOne.MTRGROUP",
                    as: "mtrgroups"
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
                $lookup: {
                    from: "markes",
                    localField: "softoneProduct.MTRMARK",
                    foreignField: "softOne.MTRMARK",
                    as: "mrtmark"
                }
            },
           
           
            {
                $project: {
                    name: 1,
                    localized: 1,
                    updatedAt: 1,
                    availability: 1,
                    description: 1,
                    updatedFrom: 1,
                    updatedAt: 1,
                    softoneStatus: 1,
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
                    categoryName: '$mtrcategory.categoryName',
                    mrtmark: '$mrtmark.name',
                    mrtmanufact: '$manufacturers.softOne.NAME',
                    MTRMANFCTR: '$manufacturers.softOne.MTRMANFCTR',
                    mtrgroups: "$mtrgroups.groupName",
                    mtrsubgroup: "$mtrsubgroup.subGroupName",
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]
        await connectMongo();
        let count = ""
        // FILTER WITH MTRCATEGORY
        if(categoryID && groupID && subgroupID) {
            let res = await SoftoneProduct.countDocuments({
               CCCSUBGOUP2: subgroupID
            });
            count = res;
            pipeline.splice(3, 0, {
                $match: {
                    "softoneProduct.CCCSUBGOUP2": subgroupID
                }
            })
        }

        if(categoryID && groupID && !subgroupID) {
            pipeline.splice(3, 0, {
                $match: {
                    "softoneProduct.MTRGROUP": groupID
                }
            })
            let res = await SoftoneProduct.countDocuments({
                MTRGROUP: groupID
            });
            count = res;
           
        }
        if(categoryID && !groupID && !subgroupID) {
            let res = await SoftoneProduct.countDocuments({
                MTRCATEGORY: categoryID
            });
            count = res;
            pipeline.splice(3, 0, {
                $match: {
                    "softoneProduct.MTRCATEGORY": categoryID
                }
            })
        }
      


       
        //FIRST TIME WE ENTER -> NO FITLERS -> FIND THE TOTAL NUMBER OF DOCUMENTS
        if ( !categoryID && !groupID && !subgroupID && searchTerm == '') {
            let res = await Product.countDocuments();
            count = res;
           
        }

        if ( searchTerm !== '' ) {
            let res = await Product.countDocuments({
                "name": {  
                    $regex: trimmedSearchTerm,
                    $options: 'i' 
                }
            });
            count = res;
            pipeline.unshift({
                $match: {
                    "name": {  
                        $regex: trimmedSearchTerm,
                        $options: 'i' 
                    }
                }
            })
        }

      
        let result = await Product.aggregate(pipeline)
        checkAvailability()
        return res.status(200).json({ success: true, totalRecords: count, result: result });
    }



    if (action === 'findCategories') {
        await connectMongo();
        let response = await MtrCategory.find({})
        try {
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
    if (action === 'findGroups') {
        let {categoryID} = req.body;
    

        await connectMongo();
        
        let response = await MtrGroup.find({'softOne.MTRCATEGORY' : categoryID}, {softOne: 1, groupName: 1, _id: 0})
       
        try {
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
    if (action === 'findSubGroups') {
        let {groupID} = req.body;
        await connectMongo();
        
        let response = await SubMtrGroup.find({'softOne.MTRGROUP' : groupID}, {softOne: 1, subGroupName: 1, _id: 0})
    
        try {
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
   
   

}



async function checkAvailability() {
    let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/mtrlInventory`;
    const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
            username: "Service",
            password: "Service",
        })
    });
    let buffer = await translateData(response)
    console.log(buffer)
    let products = await Product.find({}).select('MTRL')

    const now = new Date();
    const formattedDateTime = format(now, 'yyyy-MM-dd HH:mm:ss');
        for (let item of buffer.result) {
            let product = await Product.updateOne({
                MTRL: item.MTRL
            }, {
                $set: {
                    availability: {
                        DIATHESIMA: item.AVAILABLE,
                        SEPARAGELIA: item.ORDERED,
                        DESVMEVMENA: item.RESERVED,
                        date: formattedDateTime.toString()
                    }
                }

            })
           
        }
        
}