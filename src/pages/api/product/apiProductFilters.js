


import connectMongo from "../../../../server/config";
import { MtrCategory, MtrGroup, SubMtrGroup } from "../../../../server/models/categoriesModel";
import SoftoneProduct from "../../../../server/models/newProductModel";
import Markes from "../../../../server/models/markesModel";
import Vat from "../../../../server/models/vatModel";
import greekUtils from 'greek-utils';
import { ImpaCodes } from "../../../../server/models/impaSchema";
import Manufacturers from "../../../../server/models/manufacturersModel";
import translateData from "@/utils/translateDataIconv";


export default async function handler(req, res) {
    const action = req.body.action;
    await connectMongo();
  
    if (action === 'productSearchGrid') {
        let response = {
            success: false,
            result: [],
            error: "",
            message: "",
        }
        const {
            skip,
            limit,
            sortState,
            stateFilters,
        } = req.body;
       
        try {
            // await connectMongo();
            let filterConditions = {};
            //CATEGORIZATION:
            if(stateFilters?.MTRCATEGORY) {
                filterConditions.MTRCATEGORY =stateFilters?.MTRCATEGORY?.softOne?.MTRCATEGORY;
            }
            if(stateFilters?.MTRGROUP) {
                filterConditions.MTRGROUP = stateFilters?.MTRGROUP?.softOne?.MTRGROUP;
            }
            console.log({filterConditions})
            if(stateFilters?.CCCSUBGROUP2) {
                filterConditions.CCCSUBGROUP2 = stateFilters?.CCCSUBGROUP2?.softOne?.cccSubgroup2;
            }
            if(stateFilters?.MTRMARK) {
                filterConditions.MTRMARK = stateFilters?.MTRMARK?.softOne?.MTRMARK;
            }
            
            if(stateFilters.hasOwnProperty('MANUFACTURER') && stateFilters.MANUFACTURER ) {
                filterConditions.MMTRMANFCTR_NAME = stateFilters.MANUFACTURER.NAME;
            }
            //FILTER IMAGES:
            if(stateFilters.images) {
                filterConditions.images = { $exists: true, $ne: [] };
            }
            //NEW EAN SEARCH:
            if(stateFilters.eanSearch) {
                filterConditions.CODE1 = new RegExp(stateFilters.eanSearch, 'i');
                
            }
            //NAME SEARCH:
            if(stateFilters.nameSearch) {
                let n = stateFilters.nameSearch.trim();
                const greek = greekUtils.toGreek(n);
                let regexSearchTerm = new RegExp(n, 'i');
                let regexSearchGreeLish = new RegExp( greek, 'i');
                filterConditions.NAME = {$in: [ regexSearchTerm, regexSearchGreeLish ]};
               
            }
        
           
            if (stateFilters.hasOwnProperty('isSkroutz')) {
                filterConditions.isSkroutz = stateFilters.isSkroutz;
            }

            if (stateFilters.hasOwnProperty('SOFTONESTATUS')){
                filterConditions.MTRL = {$exists: stateFilters.SOFTONESTATUS} ;
            }
            if (stateFilters.hasOwnProperty('ISACTIVE')){
                filterConditions.ISACTIVE = stateFilters.ISACTIVE;
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

           
            const totalRecords = await SoftoneProduct.countDocuments(filterConditions);
            const softonefind = await SoftoneProduct.find(filterConditions)
                .populate('impas')
                .sort(sortState)
                .skip(skip)
                .limit(limit)
            if(!softonefind) {
                response.message = "Δεν βρέθηκαν προϊόντα"
                response.totalRecords = 0;
                response.result = []
                return res.status(200).json(response)
            }

            response.success = true
            response.result = softonefind
            response.totalRecords = totalRecords
            response.message = "Βρέθηκαν Προϊόντα"
            return res.status(200).json(response);
        } catch (e) {
            response.error = e.message
            response.message = "Αποτυχία"
            return res.status(400).json(response);
        }
    }

  

    //FOR THE DROPDOWNS:
    if (action === 'findCategories') {
        
        try {
            // await connectMongo();
            let response = await MtrCategory.find({}, { "softOne.MTRCATEGORY": 1, categoryName: 1, _id: 0 }).sort({ categoryName: 1 })
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
    if (action === 'findGroups') {
        // await connectMongo();
        let response = {}
        let { categoryID } = req.body;
        if(!categoryID) {
            response.success = false;
            response.result = [];
            response.error = "Δεν Υπάρχει κλειδί κατηγορίας"
            return res.status(200).json(response)
        }
       
        try {
            let result = await MtrGroup.find({ 'softOne.MTRCATEGORY': parseInt(categoryID) }, { "softOne.MTRGROUP": 1, groupName: 1, _id: 0 }).sort({ groupName: 1 })
                response.result = result;
                response.success = true;
                return res.status(200).json(response)
        } catch (e) {
            response.success = false;
            response.error = e.message;
            response.message = "Πρόβλημα στην ανάκτηση των ομάδων"
            return res.status(400).json(response)
        }

       
    }

    if (action === 'findGroupsNoParent') {
        await connectMongo();
        try {
            let result = await MtrGroup.find({},{ 
                _id: 0,
                "softOne.NAME": 1,
                "softOne.MTRGROUP": 1,
                "softOne.CODE": 1,
                "softOne.ISACTIVE": 1,
                "softOne.MTRCATEGORY": 1,
            })
            if(!result) throw new Error('Πρόβλημα στην ανάκτηση των ομάδων')
                return res.status(200).json({ success: true, result: result })
        } catch (e) {
            return res.status(400).json({ 
                success: false, 
                error: e.response?.data?.message || e.message
            })
        }

    }

    if (action === 'findSubGroups') {
        let { groupID } = req.body;
        if(!groupID) return res.status(200).json({ success: false, result: null})
        try {
            let response = await SubMtrGroup.find({ 'softOne.MTRGROUP': groupID }, { "softOne.cccSubgroup2": 1, subGroupName: 1, _id: 0 }).sort({ subGroupName: 1 })
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if(action === 'findBrands') {
        try {
            let response = await Markes.find({},  { "softOne.MTRMARK": 1, "softOne.NAME": 1, _id: 0 }).sort({ "softOne.NAME": 1 })
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }


    if(action === 'findVats') {
        try {
            let response = await Vat.find({ISACTIVE: "1"}, {VAT: 1, NAME: 1, _id: 0})
            return res.status(200).json({ success: true, result: response })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
    if(action === 'findManufacturers') {
        let response = {
            success: false,
            result: [],
            error: "",
            message: "",
        }
        try {
            response.result = await Manufacturers.find({}, { NAME: 1, MTRMANFCTR: 1,  _id: 0 }).sort({ NAME: 1 })
            response.success = true;
            return res.status(200).json(response)
        } catch (e) {
            response.error = e.message;
            response.message = "Πρόβλημα στην ανάκτηση των κατασκευαστών."
            return res.status(400).json(response)
        }
    }

    if(action === "findIntrastat") {
        let response = {}
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllIntrastat`;
            let result = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username : "Service",
                    password : "Service"
                })
               
            })
            let buffer = await translateData(result);
            buffer.result.sort((a, b) => a.NAME.localeCompare(b.NAME))
            response.result = buffer.result;
            response.message = "Επιτυχής ανάκτηση δεδομένων Intrastat"
            response.success = true;
            return res.status(200).json(response)
           
        } catch (e) {
            response.error = e.message;
            response.message = "Πρόβλημα στην ανάκτηση δεδομένων Intrastat"
            return res.status(400).json(response)
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


