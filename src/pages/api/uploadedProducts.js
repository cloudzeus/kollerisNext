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
}