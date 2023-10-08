
import { connect } from "mongoose";
import connectMongo from "../../../server/config";
import SoftoneProduct from "../../../server/models/newProductModel";
export default async function handler(req, res) {
    const { data } = req.body;
    try {
        await connectMongo();
        let productData = {
            DESCRIPTION: data?.description || '',
            descriptions: {
                en: data['ΑΓΓΛΙΚΗ ΠΕΡΙΓΡΑΦΗ'] || '',
                de: data['ΓΕΡΜΑΝΙΚΗ ΠΕΡΙΓΡΑΦΗ'] || '',
                es: data['ΙΣΠΑΝΙΚΗ ΠΕΡΙΓΡΑΦΗ'] || '',
            },
            NAME: data?.name || '',
            ATTRIBUTES: data?.attributes || [],
            SOFTONESTATUS: false,
            COUNTRY: data?.COUNTRY || '',
            VAT: data?.VAT || '',
            CODE: data?.CODE || '',
            CODE1: data?.CODE1 || '',
            CODE2: data?.CODE2 || '',
            PRICER: data?.PRICER,
            PRICEW: data?.PRICEW,
            PRICER05: data?.PRICER05,
            WIDTH: data?.WIDTH || '',
            HEIGHT: data?.HEIGHT || '',
            LENGTH: data["ΠΛΑΤΟΣ"] || '',

        }
        const product = await SoftoneProduct.findOneAndUpdate(
            { NAME: productData.NAME }, // filter: search for product by name
            productData, 
            {
              new: true, // return the new product data
              upsert: true, // insert the data if it doesn't exist
              setDefaultsOnInsert: true // apply schema defaults if we're inserting
            }
          );
            console.log(product)
        return res.status(200).json({success: true, result: product,  message: "Επιτυχής εισαγωγή στην βάση" });
      
    } catch (e) {
        return res.status(500).json({success: false, error: "Αποτυχία εισαγωγής στην βάση" });
    }

}