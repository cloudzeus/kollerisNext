


import connectMongo from "../../../../server/config";
import { MtrCategory, MtrGroup, SubMtrGroup } from "../../../../server/models/categoriesModel";
import SoftoneProduct from "../../../../server/models/newProductModel";
import Markes from "../../../../server/models/markesModel";
import Vat from "../../../../server/models/vatModel";
import greekUtils from 'greek-utils';
import { ImpaCodes } from "../../../../server/models/impaSchema";

export const config = {
    api: {
        responseLimit: false,
    },
}

export default async function handler(req, res) {
    const action = req.body.action;



    if (action === 'filterCategories') {
        await connectMongo();

        let { groupID, categoryID, subgroupID, searchTerm, skip, limit, softoneStatusFilter, mtrmark, } = req.body;
        let totalRecords;
        let softonefind;
        if (!categoryID && !groupID && !subgroupID && searchTerm == '') {
            totalRecords = await SoftoneProduct.countDocuments();
            softonefind = await SoftoneProduct.find({}).skip(skip).limit(limit).populate('descriptions');

        }

        if (categoryID) {
            totalRecords = await SoftoneProduct.countDocuments({
                MTRCATEGORY: categoryID
            });
            softonefind = await SoftoneProduct.find({
                MTRCATEGORY: categoryID
            }).skip(skip).limit(limit).populate('descriptions');
        }

        if (categoryID && groupID) {
            totalRecords = await SoftoneProduct.countDocuments({
                MTRCATEGORY: categoryID,
                MTRGROUP: groupID
            });
            softonefind = await SoftoneProduct.find({
                MTRCATEGORY: categoryID,
                MTRGROUP: groupID
            }).skip(skip).limit(limit).populate('descriptions');
        }

        if (categoryID && groupID && subgroupID) {
            totalRecords = await SoftoneProduct.countDocuments({
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
        if (softoneStatusFilter === true || softoneStatusFilter === false) {
            totalRecords = await SoftoneProduct.countDocuments({
                SOFTONESTATUS: softoneStatusFilter
            });
            softonefind = await SoftoneProduct.find({
                SOFTONESTATUS: softoneStatusFilter
            }).skip(skip).limit(limit).populate('descriptions');
        }


        let regexSearchTerm = new RegExp("^" + searchTerm, 'i');

        if (searchTerm !== '') {
            totalRecords = await SoftoneProduct.countDocuments({ NAME: regexSearchTerm });
            softonefind = await SoftoneProduct.find({ NAME: regexSearchTerm }).skip(skip).limit(limit).populate('descriptions');
        }


        return res.status(200).json({ success: true, totalRecords: totalRecords, result: softonefind });
    }
   

    if (action === 'findCategories') {
        
        try {
            await connectMongo();
            let response = await MtrCategory.find({}, { "softOne.MTRCATEGORY": 1, categoryName: 1, _id: 0 })
           
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
    if (action === 'findGroups') {
        let { categoryID } = req.body;
        if(!categoryID) return res.status(200).json({ success: false, result: null})
      
        await connectMongo();
        let response = await MtrGroup.find({ 'softOne.MTRCATEGORY': categoryID }, { "softOne.MTRGROUP": 1, groupName: 1, _id: 0 })

        try {
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
    if (action === 'findSubGroups') {
        let { groupID } = req.body;
        if(!groupID) return res.status(200).json({ success: false, result: null})
        try {
            await connectMongo();

            let response = await SubMtrGroup.find({ 'softOne.MTRGROUP': groupID }, { "softOne.cccSubgroup2": 1, subGroupName: 1, _id: 0 })
          
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if(action === 'findBrands') {
        try {
            await connectMongo();
            let response = await Markes.find({},  { "softOne.MTRMARK": 1, "softOne.NAME": 1, _id: 0 })
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if(action === 'findVats') {
        try {
            await connectMongo();
            let response = await Vat.find({ISACTIVE: "1"}, {VAT: 1, NAME: 1, _id: 0})
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }


    if (action === 'productSearchGrid') {
        const {
            groupID,
            categoryID,
            subgroupID,
            searchTerm,
            skip,
            limit,
            softoneFilter,
            sort,
            marka,
            sortPrice,
            sortImpa,
            stateFilters,
        } = req.body;

        try {
            await connectMongo();
            

            let totalRecords;
            let sortObject = {};
            let filterConditions = {};
            if(stateFilters.images) {
                filterConditions.images = { $exists: true, $ne: [] };

            }
            if(stateFilters.images === false) {
                filterConditions.hasImages === false;

            }
            if(sort !== 0) {
                sortObject = { NAME: sort }
            }


            //handle impa sort and search:
            if(sortImpa !== 0) {
                sortObject = { impas: sortImpa }
            }

           

            if(sortPrice !== 0) {
                sortObject = { PRICER: sortPrice }
            }
    
            if (categoryID) {
                filterConditions.MTRCATEGORY = categoryID;
            }
   
            if(stateFilters.skroutz !== null) {
                filterConditions.isSkroutz = stateFilters.skroutz;
            }
            if(stateFilters.active !== null) {
                filterConditions.ISACTIVE = stateFilters.active;
            }
            
            
    
            if (groupID) {
                filterConditions.MTRGROUP = groupID;
            }
    
            if (subgroupID) {
                filterConditions.CCCSUBGROUP2 = subgroupID;
            }
    
            if (softoneFilter === true || softoneFilter === false) {
                filterConditions.SOFTONESTATUS = softoneFilter;
            }
    
            if (stateFilters.codeSearch !== '') {
                let regexSearchTerm = new RegExp(stateFilters.codeSearch, 'i');
                filterConditions.CODE1 = regexSearchTerm;
            }
    
            if (marka) {
                filterConditions.MTRMARK = marka.softOne.MTRMARK;
            }
    
            if (searchTerm !== '') {
                const greek = greekUtils.toGreek(searchTerm);
                let regexSearchTerm = new RegExp( searchTerm, 'i');
                let regexSearchGreeLish = new RegExp( greek, 'i');
                filterConditions.NAME = {$in: [ regexSearchTerm, regexSearchGreeLish ]};
             
            }

         

            if (stateFilters.impaSearch !== '' && stateFilters.hasOwnProperty('impaSearch') ) {
                let regex = new RegExp(stateFilters.impaSearch, 'i');
                let productIds = await findImpaProducts(regex);
                let totalRecords  = await SoftoneProduct.countDocuments({ _id: { $in: productIds } })
              
                let products = await SoftoneProduct.find({ _id: { $in: productIds } })
                .populate('impas')
                .skip(skip)
                .limit(limit);
                return res.status(200).json({ success: true, totalRecords: totalRecords, result: products });
            }
    
            if (Object.keys(filterConditions).length === 0) {
                // No specific filters, fetch all products
                totalRecords = await SoftoneProduct.countDocuments();
            } else {
                totalRecords = await SoftoneProduct.countDocuments(filterConditions);
             
            }

              let softonefind = await SoftoneProduct.find(filterConditions)
                .populate('impas')
                .sort(sortObject)
                .skip(skip)
                .limit(limit)
          
          
            return res.status(200).json({ success: true, totalRecords: totalRecords, result: softonefind });
        } catch (e) {
            return res.status(400).json({ success: false, error: e.message });
        }
    }
   


}



async function findImpaProducts(impaRegex) {
    let impas = await ImpaCodes.find({ 
        code: impaRegex,
        products: { $exists: true, $not: { $size: 0 } }

    }).populate('products', '_id') 
   
     let ids = [];
     for(let impa of impas) {
         for(let product of impa.products) {
             ids.push(product._id)
         }
     }

    return ids;
}


