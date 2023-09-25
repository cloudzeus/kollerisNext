
import { connect } from "mongoose";
import connectMongo from "../../../server/config";
import { Product, Descriptions } from "../../../server/models/newProductModel";
import SoftoneProduct from "../../../server/models/newProductModel";
export default async function handler(req, res) {
    const { data } = req.body;
    try {
        await connectMongo();
        console.log(data)
        for (const item of data) {
        
    
            let description = await Descriptions.create({
                es: item["ΙΣΠΑΝΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || '',
                en: item["ΑΓΓΛΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || '',
                de: item["ΓΕΡΜΑΝΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || '',
                fr: item["ΓΑΛΛΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || '',
            })
         


            let update = {
                $set: {
                    descriptions: description._id,
                    NAME: item.name || '',
                    CODE: item.CODE || '',
                    SOFTONESTATUS: false,
                    COUNTRY: item.COUNTRY || '',
                    VAT: item.VAT || '',
                    // DESCRIPTION: item["ΚΥΡΙΑ ΠΕΡΙΓΡΑΦΗ"] || item["ΑΓΓΛΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || item["ΓΕΡΜΑΝΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || '',
                    ATTRIBUTES: item.attributes || '',
                }
            }
            console.log(update)


            let softoneProduct = await SoftoneProduct.findOneAndUpdate(
                { NAME: item.name || '' },
                update,
                { upsert: true, new: true }
            )
            console.log(softoneProduct)
        }


        





      
        return res.status(200).json({ message: "Επιτυχής εισαγωγή στην βάση" })
    } catch (e) {
        return res.status(500).json({ error: "Αποτυχία εισαγωγής στην βάση" });
    }

}