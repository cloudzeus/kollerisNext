


import connectMongo from "../../../../server/config";
import { MtrCategory, MtrGroup, SubMtrGroup } from "../../../../server/models/categoriesModel";
import SoftoneProduct from "../../../../server/models/newProductModel";
import Markes from "../../../../server/models/markesModel";
import Vat from "../../../../server/models/vatModel";

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


        // console.log(softonefind)
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
        // console.log('response find groups')
        // console.log(response)
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
            // console.log('id')
            // console.log(groupID)
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
            console.log(response)
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if(action === 'findVats') {
        try {
            await connectMongo();
            let response = await Vat.find({}, {VAT: 1, NAME: 1, _id: 0})
            console.log(response)
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
            sortAvailability,
            marka,
            codeSearch
        } = req.body;
    
        try {
            await connectMongo();
    
            let totalRecords;
            let filterConditions = {};
    
            if (categoryID) {
                filterConditions.MTRCATEGORY = categoryID;
            }
    
            if (groupID) {
                filterConditions.MTRGROUP = groupID;
            }
    
            if (subgroupID) {
                filterConditions.CCCSUBGOUP2 = subgroupID;
            }
    
            if (softoneFilter === true || softoneFilter === false) {
                filterConditions.SOFTONESTATUS = softoneFilter;
            }
    
            if (codeSearch !== '') {
                let regexSearchTerm = new RegExp(codeSearch, 'i');
                filterConditions.CODE = regexSearchTerm;
            }
    
            if (marka) {
                filterConditions.MTRMARK = marka.softOne.MTRMARK;
            }
    
            if (searchTerm !== '') {
                let regexSearchTerm = new RegExp(searchTerm, 'i');
                filterConditions.NAME = regexSearchTerm;
            }
    
            if (Object.keys(filterConditions).length === 0) {
                // No specific filters, fetch all products
                totalRecords = await SoftoneProduct.countDocuments();
            } else {
                // Apply filters and get totalRecords
                totalRecords = await SoftoneProduct.countDocuments(filterConditions);
            }
    
            let softonefind;
    
            if (sort !== 0) {
                softonefind = await SoftoneProduct.find(filterConditions)
                    .sort({ NAME: sort })
                    .skip(skip)
                    .limit(limit);
            } else {
                softonefind = await SoftoneProduct.find(filterConditions)
                    .skip(skip)
                    .limit(limit);
            }
            console.log('filtered conditions')
            console.log(filterConditions)
            return res.status(200).json({ success: true, totalRecords: totalRecords, result: softonefind });
        } catch (e) {
            return res.status(400).json({ success: false, error: e.message });
        }
    }
    // if (action === 'productSearchGrid') {
       
    //     const{ groupID, categoryID, subgroupID, searchTerm, skip, limit, softoneFilter, sort, sortAvailability, marka, codeSearch} = req.body;
        
    //     console.log(categoryID)
    //     try {
    //         await connectMongo();
    //         //initiate the return values
    //         let totalRecords;
    //         let softonefind;
    //         //Fetch results when no filter is applied
    //         const noFilterCondition = !categoryID && !groupID && !subgroupID && searchTerm == '' && softoneFilter === null && marka === null && codeSearch === '';
    //         if (noFilterCondition) {
    //             totalRecords = await SoftoneProduct.countDocuments();
    //             if(sort !== 0 )   {
    //                 softonefind = await SoftoneProduct.find({}).sort({ NAME: sort }).skip(skip).limit(limit) // Sorting by "NAME" in descending order
    //             }
               
    //             if(sort === 0 ) {
    //                 softonefind = await SoftoneProduct.find({}).skip(skip).limit(limit) 
    //             }
    
    //         }
            

    //          //Fetch results WITH CATEGORY GROUP AND SUBGROUP FILTERS
    //         if (categoryID) {
    //             totalRecords = await SoftoneProduct.countDocuments({
    //                 MTRCATEGORY: categoryID
    //             });
    //             softonefind = await SoftoneProduct.find({
    //                 MTRCATEGORY: categoryID
    //             }).skip(skip).limit(limit);
    //         }
    
    //         if (categoryID && groupID) {
    //             totalRecords = await SoftoneProduct.countDocuments({
    //                 MTRCATEGORY: categoryID,
    //                 MTRGROUP: groupID
    //             });
    //             softonefind = await SoftoneProduct.find({
    //                 MTRCATEGORY: categoryID,
    //                 MTRGROUP: groupID
    //             }).skip(skip).limit(limit);
    //         }
    
    //         if (categoryID && groupID && subgroupID) {
    //             totalRecords = await SoftoneProduct.countDocuments({
    //                 MTRCATEGORY: categoryID,
    //                 MTRGROUP: groupID,
    //                 CCCSUBGOUP2: subgroupID
    //             });
    //             softonefind = await SoftoneProduct.find({
    //                 MTRCATEGORY: categoryID,
    //                 MTRGROUP: groupID,
    //                 CCCSUBGOUP2: subgroupID
    //             }).skip(skip).limit(limit);
    //         }
    
    
            
    //         //RETURN EITHER OR THE RESULTS OR DATA THAT EXIST IN SOFTONE OR PRODUCTS THAN DONT EXIST IN SOFTONE 
    //         if(softoneFilter === true || softoneFilter === false) {
    //             totalRecords = await SoftoneProduct.countDocuments({
    //                 SOFTONESTATUS: softoneFilter
    //             });
    //             softonefind = await SoftoneProduct.find({
    //                 SOFTONESTATUS: softoneFilter
    //             }).skip(skip).limit(limit);
    //         } 

    //         if(codeSearch !== '') {
    //             let regexSearchTerm = new RegExp(codeSearch , 'i');
    //             totalRecords = await SoftoneProduct.countDocuments({ CODE: regexSearchTerm });
    //             softonefind = await SoftoneProduct.find({ CODE: regexSearchTerm }).skip(skip).limit(limit);
    //             console.log(softonefind)
    //         }

    //         //FILTER BASE ON THE BRAND NAME
    //         if(marka) {
    //             totalRecords = await SoftoneProduct.countDocuments({ MTRMARK: marka?.softOne.MTRMARK});
    //             softonefind = await SoftoneProduct.find({ MTRMARK: marka?.softOne.MTRMARK }).skip(skip).limit(limit);
    //         }
           
            
    //         if (searchTerm !== '') {
    //             let regexSearchTerm = new RegExp(searchTerm, 'i');
    //             totalRecords = await SoftoneProduct.countDocuments({ NAME: regexSearchTerm });
    //             softonefind = await SoftoneProduct.find({ NAME: regexSearchTerm }).skip(skip).limit(limit);
    //         }
            
    
    //         return res.status(200).json({ success: true, totalRecords: totalRecords, result: softonefind });
    //     } catch (e) {
    //         return res.status(400).json({ success: false })
    //     }
    // }


}



