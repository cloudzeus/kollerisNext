
import { connect } from "mongoose";
import connectMongo from "../../../server/config";
import { Product } from "../../../server/models/newProductModel";
import SoftoneProduct from "../../../server/models/newProductModel";

export default async function handler(req, res) {
    const { data } = req.body;

    try {
        await connectMongo();
     
        for (const item of data) {
            let product = await Product.findOneAndUpdate(
                { name: "random " },
                {
                    $set: {
                        name: item.name || '',
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
                                    code: 'DE',
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
                },
                { upsert: true, new: true })
                console.log('----------')
            console.log(product )
            let update = {
                $set: {
                    product: product._id,
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


        





        // let ids = insertProducts.map((item) => item._id)
        // console.log(ids)

        // let softoneProducts = data.map((item, index) => {
        //     return {
        //         product: ids[index],
        //         NAME: item.NAME || '',
        //         CODE: item.CODE || '',
        //         SOFTONESTATUS: false,
        //         COUNTRY: item.COUNTRY || '',
        //         VAT: item.VAT || '',
        //         DESCRIPTION: item["ΚΥΡΙΑ ΠΕΡΙΓΡΑΦΗ"] || item["ΑΓΓΛΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || item["ΓΕΡΜΑΝΙΚΗ ΠΕΡΙΓΡΑΦΗ"] || '',
        //         ATTRIBUTES: item.ATTRIBUTES || '',
        //     }
        // })


        // let insertSoftoneProducts = await SoftoneProduct.insertMany(softoneProducts)
        // console.log( insertSoftoneProducts)
        // console.log('insert softone products')
        // console.log(insertSoftoneProducts)
        return res.status(200).json({ message: "Επιτυχής εισαγωγή στην βάση" })
    } catch (e) {
        return res.status(500).json({ error: "Αποτυχία εισαγωγής στην βάση" });
    }

}