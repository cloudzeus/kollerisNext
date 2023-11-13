import connectMongo from "../../../server/config";
import SoftoneProduct from "../../../server/models/newProductModel";
import UploadedProduct from "../../../server/models/uploadedProductsModel";


export default async function handler(res, req) {
    const action = req.query.action;

    if(action == 'getStats') {
        try {
            await connectMongo();
            let findProductDescriptions = await SoftoneProduct.find({})
        } catch (e) {
            return res.status(500).json({message: 'getStats'})
        }
        return res.status(200).json({message: 'getStats'})
    }

    if(action === "getUploadedProducts") {
        const {skip, limit} = req.query;
        try {
            await connectMongo();
            let result = await UploadedProduct.find({}).skip(skip).limit(limit).sort({createdAt: -1})
            return res.status(200).json({success: true, result: result})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }
}