
import { connect } from "mongoose";
import connectMongo from "../../../server/config";
import SoftoneProduct from "../../../server/models/newProductModel";
import { ConnectedOverlayScrollHandler } from "primereact/utils";
export default async function handler(req, res) {
    const { data } = req.body;
    try {
        await connectMongo();
        let productData = {
            DESCRIPTION: data?.description || '',
            NAME: data.NAME,
            ATTRIBUTES: data?.attributes || [],
            SOFTONESTATUS: false,
            COUNTRY: data?.COUNTRY || '',
            VAT: data?.VAT || '',
            CODE: data?.CODE || '',
            CODE1: data?.CODE1 || '',
            CODE2: data?.CODE2 || '',
            PRICER: data.PRICER,
            PRICEW: data.PRICEW,
            COST: parseFloat(data.COST.toFixed(2)),
            PRICER05: data.PRICER05,
            WIDTH: data?.WIDTH || '',
            HEIGHT: data?.HEIGHT || '',
            LENGTH: data["ΠΛΑΤΟΣ"] || '',
            IMAGE_STATUS: false,
        }

        const filter = {
            $or: [
                { NAME: productData.NAME }, // Match by NAME
                { CODE1: productData.CODE1 } // Match by CODE1
            ]
        };
        let softoneUpdate = false;
        const isSoftone = await SoftoneProduct.findOne(filter, {MTRL: 1, _id: 0});
        if(isSoftone?.MTRL) {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrl`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    PRICER: productData.PRICER,
                    PRICEW: productData.PRICEW,
                    PRICER05: productData.PRICER05,
                })
            });
            let responseJSON = await response.json();
            console.log('response')
            console.log(responseJSON)
            softoneUpdate = true;

        }
        console.log('is softone')
        console.log(isSoftone)
        console.log('softone update')
        console.log(softoneUpdate)
        const find = await SoftoneProduct.find(filter);
        let product;
        let action;
        if(!find.length) {
            product = await SoftoneProduct.create(productData);
            action = 'created';
        } 
        if(find.length) {
            product = await SoftoneProduct.findOneAndUpdate(filter, {
                $set: productData,
            },
            { new: true,} 
            );
           action = 'updated';
        }
        
        let _product = {
            ...product._doc,
            action: action,
            softoneUpdate: softoneUpdate,
        }
        console.log(_product)
        return res.status(200).json({success: true, result: _product });

      
    } catch (e) {
        return res.status(500).json({success: false, error: "Αποτυχία εισαγωγής στην βάση" });
    }

}