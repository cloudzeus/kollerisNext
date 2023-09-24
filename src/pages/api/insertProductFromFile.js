
import { connect } from "mongoose";
import connectMongo from "../../../server/config";
import { Product } from "../../../server/models/newProductModel";
import SoftoneProduct from "../../../server/models/newProductModel";

export default async function handler(req, res) {
    const { data } = req.body;
    console.log(data)
   
    try {
        await connectMongo();
    let products = data.map((item) => {
        return {
            localized: [{
                fieldName: 'description',
                translations: [
                    {
                        locale: 'EN',
                        code: 'EN',
                        translation: item["ΑΓΓΛΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || '',
                    },
                    {
                        locale: 'DE',
                        code: '',
                        translation: item["ΓΕΡΜΑΝΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || '',
                    },
                    {
                        locale: 'FR',
                        code: 'FR',
                        translation: item["ΓΑΛΛΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || '',
                    },
                    {
                        locale: 'SP',
                        code: 'SP',
                        translation: item["ΙΣΠΑΝΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || '',
                    },

                ]

            }]
        }
    })

    let insertProducts = await Product.insertMany(products)
    console.log('insert products')
    console.log(insertProducts)
    let ids = insertProducts.map((item) => item._id)

    let softoneProducts = data.map((item, index) => {
        return {
            product: ids[index],
            NAME: item.NAME || '',
            CODE: item.CODE || '',
            PRICER: item.PRICER || '',
            PRICEW: item.PRICEW || '',
            PRICE05: item.PRICE05 || '',
            SOFTONESTATUS: false,
            COUNTRY: item.COUNTRY || '',
            VAT: item.VAT || '',
            DECRIPTION: item.MAIN_DESCRIPTION || '',
            ATTRIBUTES: item.ATTRIBUTES || '',
        }
    })
    let insertSoftoneProducts = await SoftoneProduct.insertMany(softoneProducts)
    console.log(softoneProducts)
        
    console.log('insert softone products')
    console.log(insertSoftoneProducts)
    return res.status(200).json({ message: "Επιτυχής εισαγωγή στην βάση"})
    } catch (e) {
        return res.status(500).json({ error: "Αποτυχία εισαγωγής στην βάση" });
    }

}