import Supplier from "../../../server/models/suppliersSchema";
import connectMongo from "../../../server/config";
export default async function handler(req, res) {

    const action = req.body.action;
    if(action === 'fetchSuppliers') {
        const {skip, limit} = req.body
        try {
            await connectMongo();
            console.log('wtf')
            let suppliers = await Supplier.find({}).skip(skip).limit(limit)
            console.log(suppliers)
            return res.status(200).json({ success: true, result: suppliers });
        } catch (e) {

        }
    }
    
    if (action === "searchSupplier") {
        let { skip, limit, searchTerm } = req.body;
        console.log(searchTerm)
        let regexSearchTerm = new RegExp("^" + searchTerm, 'i');
        const totalRecords = await Supplier.countDocuments({NAME: regexSearchTerm})
        let suppliers = await Supplier.find({NAME: regexSearchTerm}).skip(skip).limit(limit).select({NAME: 1, EMAIL: 1, _id: 1})
        return res.status(200).json({ success: true, result: suppliers, totalRecords: totalRecords })
    }

    if(action === "saveNewEmail") {
        let {email, id} = req.body;
       

        await connectMongo();
        try {
            console.log(email ,id)
            let update = await Supplier.updateOne({_id: id}, {
                $set: {
                    EMAIL: email
                }
            })
            return res.status(200).json({ success: true, result: update })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
}
