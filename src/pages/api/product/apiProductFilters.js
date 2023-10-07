

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



    if(action === 'filterCategories') {
        await connectMongo();

        let {groupID,categoryID, subgroupID, searchTerm, skip, limit, softoneStatusFilter } = req.body;
        

        let totalRecords;
        let softonefind;
        if(!categoryID && !groupID && !subgroupID && searchTerm == '') {
            totalRecords =  await SoftoneProduct.countDocuments();
            softonefind = await SoftoneProduct.find({}).skip(skip).limit(limit).populate('descriptions');
          
        }

        if(categoryID ) {
            totalRecords =  await SoftoneProduct.countDocuments({
                MTRCATEGORY: categoryID
            });
            softonefind = await SoftoneProduct.find({
                MTRCATEGORY: categoryID
            }).skip(skip).limit(limit).populate('descriptions');
        }

        if(categoryID && groupID) {
            totalRecords =  await SoftoneProduct.countDocuments({
                MTRCATEGORY: categoryID,
                MTRGROUP: groupID
            });
            softonefind = await SoftoneProduct.find({
                MTRCATEGORY: categoryID,
                MTRGROUP: groupID
            }).skip(skip).limit(limit).populate('descriptions');
        }

        if(categoryID && groupID && subgroupID) {
            totalRecords =  await SoftoneProduct.countDocuments({
                MTRCATEGORY: categoryID,
                MTRGROUP: groupID,
                CCCSUBGOUP2: subgroupID
            });
            softonefind = await SoftoneProduct.find({
                MTRCATEGORY: categoryID,
                MTRGROUP: groupID,
                CCCSUBGOUP2: subgroupID
            }).skip(skip).limit(limit).populate('descriptions');
        }



        //FILTER BASED ON SOFTONE STATUS:
        if(softoneStatusFilter === true || softoneStatusFilter === false) {
            totalRecords =  await SoftoneProduct.countDocuments({
                SOFTONESTATUS: softoneStatusFilter
            });
            softonefind = await SoftoneProduct.find({
                SOFTONESTATUS: softoneStatusFilter
            }).skip(skip).limit(limit).populate('descriptions');
        } 
      

        let regexSearchTerm = new RegExp("^" + searchTerm, 'i');

        if(searchTerm !== '') {
            totalRecords =  await SoftoneProduct.countDocuments({ NAME: regexSearchTerm});
            softonefind = await SoftoneProduct.find({ NAME: regexSearchTerm}).skip(skip).limit(limit).populate('descriptions');
        }


        // console.log(softonefind)
        return res.status(200).json({ success: true, totalRecords: totalRecords, result: softonefind });
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
        console.log('categoryID')
        console.log(categoryID)
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
        console.log('id')
        console.log(groupID)
        let response = await SubMtrGroup.find({'softOne.MTRGROUP' : groupID}, {softOne: 1, subGroupName: 1, _id: 0})
        console.log('response')
        console.log(response)
        try {
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
   
   

}



