import Supplier from "../../../../server/models/suppliersSchema";
import connectMongo from "../../../../server/config";
import { connect } from "mongoose";
export default async function handler(req, res) {

    const action = req.body.action;
    if (action === 'fetchSuppliers') {
        console.log('works')
        const { skip, limit } = req.body
        try {
            await connectMongo();
            let totalRecords = await Supplier.countDocuments({});
            let suppliers = await Supplier.find({}).skip(skip).limit(limit)

            return res.status(200).json({ success: true, result: suppliers, totalRecords: totalRecords });
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if (action === "searchSupplier") {
        let { skip, limit, searchTerm } = req.body;
     
    }

    if(action === "search") {
        let { skip, limit, searchTerm } = req.body;
        try {
            await connectMongo();
            let result;
            let totalRecords;
    
            if(searchTerm.name !== '') {
                let regexSearchTerm = new RegExp(searchTerm.name, 'i');
                totalRecords = await Supplier.countDocuments({ NAME: regexSearchTerm })
                result = await Supplier.find({ NAME: regexSearchTerm }).skip(skip).limit(limit)
               
            }
            if(searchTerm.email !== '') {
                let regexSearchTerm = new RegExp(searchTerm.email, 'i');
                totalRecords = await Supplier.countDocuments({ EMAIL: regexSearchTerm })
                result = await Supplier.find({ EMAIL: regexSearchTerm }).skip(skip).limit(limit)
            }
    
            if(searchTerm.phone !== '') {
                let regexSearchTerm = new RegExp(searchTerm.phone, 'i');
                totalRecords = await Supplier.countDocuments({ PHONE01: regexSearchTerm })
                result = await Supplier.find({ PHONE01: regexSearchTerm }).skip(skip).limit(limit)
            }
    
            return res.status(200).json({ success: true, result: result, totalRecords: totalRecords })
        } catch (e) {
            return res.status(400).json({success: false, result: null})
        }
    }


}