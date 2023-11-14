import UploadedProduct from "../../../server/models/uploadedProductsModel";
import connectMongo from "../../../server/config";
export default async function handler(req, res) {
    const {action} = req.body;
    if(action === "returnedUploadedProducts") {
        const {NAME, UNIQUE_CODE} = req.body
        console.log(NAME, UNIQUE_CODE)
        try {
            await connectMongo();
            let result = await UploadedProduct.findOne({NAME: NAME, UNIQUE_CODE:  UNIQUE_CODE})
            // console.log('result from database')
            // console.log(result)
            return res.status(200).json({success: true, result: result})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

    if(action === "fetchAll") {
        const {skip, limit} = req.body;
        try {
            await connectMongo();
            let totalRecords = await UploadedProduct.countDocuments({});
            let result = await UploadedProduct.find({}).skip(skip).limit(limit).sort({createdAt: -1});

            return res.status(200).json({success: true, result: result, totalRecords: totalRecords})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }
}