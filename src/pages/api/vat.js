import UploadedProduct from "../../../server/models/uploadedProductsModel";
import connectMongo from "../../../server/config";
import Vat from "../../../server/models/vatModel";
import { connect } from "mongoose";
export default async function handler(req, res) {
    const {action} = req.body;
    if(action === "findVatName") {
        const {VAT} = req.body
        await connectMongo();
        try {
            let result = await Vat.find({
                VAT: VAT
            }).select('NAME');
            return res.status(200).json({success: true, result: result[0].NAME})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

  
}