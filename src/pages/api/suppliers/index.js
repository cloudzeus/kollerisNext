import Supplier from "../../../../server/models/suppliersSchema";
import connectMongo from "../../../../server/config";
import { connect } from "mongoose";
export default async function handler(req, res) {

    const action = req.body.action;
    // if (action === 'fetchSuppliers') {
    //     const { skip, limit } = req.body
    //     try {
    //         await connectMongo();
    //         let totalRecords = await Supplier.countDocuments({});
    //         let suppliers = await Supplier.find({}).skip(skip).limit(limit)

    //         return res.status(200).json({ success: true, result: suppliers, totalRecords: totalRecords });
    //     } catch (e) {
    //         return res.status(500).json({ success: false, result: null })
    //     }
    // }

    // if (action === "searchSupplier") {
    //     let { skip, limit, searchTerm } = req.body;
     
    // }

    // if(action === "search") {
    //     let { skip, limit, searchTerm } = req.body;
    //     try {
    //         await connectMongo();
    //         let result;
    //         let totalRecords;
    
    //         if(searchTerm.name !== '') {
    //             let regexSearchTerm = new RegExp(searchTerm.name, 'i');
    //             totalRecords = await Supplier.countDocuments({ NAME: regexSearchTerm })
    //             result = await Supplier.find({ NAME: regexSearchTerm }).skip(skip).limit(limit)
               
    //         }
    //         if(searchTerm.email !== '') {
    //             let regexSearchTerm = new RegExp(searchTerm.email, 'i');
    //             totalRecords = await Supplier.countDocuments({ EMAIL: regexSearchTerm })
    //             result = await Supplier.find({ EMAIL: regexSearchTerm }).skip(skip).limit(limit)
    //         }
    
    //         if(searchTerm.phone !== '') {
    //             let regexSearchTerm = new RegExp(searchTerm.phone, 'i');
    //             totalRecords = await Supplier.countDocuments({ PHONE01: regexSearchTerm })
    //             result = await Supplier.find({ PHONE01: regexSearchTerm }).skip(skip).limit(limit)
    //         }
    
    //         return res.status(200).json({ success: true, result: result, totalRecords: totalRecords })
    //     } catch (e) {
    //         return res.status(400).json({success: false, result: null})
    //     }
    // }
    
    if(action === "fetchAll") {
        const {skip, limit, searchTerm} = req.body;
        try {
            await connectMongo();
            let totalRecords;
            let suppliers;
            if(!searchTerm.afm  && !searchTerm.name && !searchTerm.address && !searchTerm.phone01 && !searchTerm.phone02 && !searchTerm.email) {
                totalRecords = await Supplier.countDocuments({});
                suppliers = await Supplier.find({}).skip(skip).limit(limit);
            }
            if(searchTerm?.name) {
                let regexSearchTerm = new RegExp(searchTerm.name, 'i');
                totalRecords = await Supplier.countDocuments({ NAME: regexSearchTerm });
                suppliers = await Supplier.find({ NAME: regexSearchTerm }).skip(skip).limit(limit);
            }
            if(searchTerm?.phone01) {
                let regexSearchTerm = new RegExp(searchTerm?.phone01, 'i');
                totalRecords = await Supplier.countDocuments({ PHONE01: regexSearchTerm });
                suppliers= await Supplier.find({  PHONE01: regexSearchTerm }).skip(skip).limit(limit);
            }
            if(searchTerm?.phone02) {
                let regexSearchTerm = new RegExp(searchTerm?.phone02, 'i');
                totalRecords = await Supplier.countDocuments({ PHONE02: regexSearchTerm });
                suppliers = await Supplier.find({  PHONE02: regexSearchTerm }).skip(skip).limit(limit);
            }
            if(searchTerm?.afm) {
                let regexSearchTerm = new RegExp(searchTerm.afm, 'i');
                totalRecords = await Supplier.countDocuments({ AFM: regexSearchTerm });
                suppliers = await Supplier.find({ AFM: regexSearchTerm }).skip(skip).limit(limit);
            }
            if(searchTerm?.address) {
                let regexSearchTerm = new RegExp(searchTerm.address, 'i');
                totalRecords = await Supplier.countDocuments({ ADDRESS: regexSearchTerm });
                suppliers = await Supplier.find({ ADDRESS: regexSearchTerm }).skip(skip).limit(limit);
            }
            if(searchTerm?.email) {
                let regexSearchTerm = new RegExp(searchTerm.email, 'i');
                totalRecords = await Supplier.countDocuments({ EMAIL: regexSearchTerm });
                suppliers = await Supplier.find({ EMAIL: regexSearchTerm }).skip(skip).limit(limit);
            }

         
            return res.status(200).json({ success: true, result: suppliers, totalRecords: totalRecords })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if(action === "updateOne") {
        const {data, user} = req.body;
        console.log('sefsefsfesfsfes')
        console.log(data)
        console.log(user)
        try {
            await connectMongo();
            let result = await Supplier.findOneAndUpdate({ _id: data._id }, {
                ...data,
                updatedFrom: user
            }, { new: true })
            return res.status(200).json({ success: true, result: result })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if(action === "create") {
        const {data} = req.body;
        console.log(data)
        // try {
        //     await connectMongo();
        //     let result = await Supplier.create(data);
        //     console.log('result')
        //     console.log(result)
        //     return res.status(200).json({ success: true, result: result })
        // } catch (e) {
        //     return res.status(400).json({ success: false })
        // }
    }

}