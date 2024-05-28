import connectMongo from "../../../server/config";
import SoftoneProduct from "../../../server/models/newProductModel";
import UploadedProduct from "../../../server/models/uploadedProductsModel";
import {removeEmptyObjectFields} from "@/utils/removeEmptyObjectFields";

export default async function handler(req, res) {
    const {data, UNIQUE_CODE} = req.body;
    await connectMongo();

    try {

        const {SOFTONE_DATA, PRODUCT_DATA} = createData(data)
        console.log(SOFTONE_DATA.slice(0, 20))
        // let productData = {}
        // return res.status(200).json({success: true});
        // //CREATE THE UPLOADED PRODUCT FOR THIS SUPPLIER
        // const uploadedOBJ = {
        //     NAME: data.NAME,
        //     PRICER: data.PRICER ? parseFloat(data.PRICER.toFixed(2)) : 0,
        //     PRICEW: data.PRICEW ? parseFloat(data.PRICEW.toFixed(2)) : 0,
        //     COST: data.COST ? parseFloat(data.COST.toFixed(2)) : 0,
        //     PRICER01: data?.PRICER01 ? parseFloat(data?.PRICER01.toFixed(2)) : 0,
        //     UNIQUE_CODE: UNIQUE_CODE,
        // }
        //
        // let uploadedProduct = await UploadedProduct.create(uploadedOBJ)
        //
        // //CREATE A FILTER WITH EITHER THE NAME OR THE CODE OF THE PRODUCT FROM THE UPLOADED FILE
        // const filter = {
        //     CODE2: data.CODE2
        // };
        //
        //
        // //IF THE PRODUCT EXIST IN SOFTONE THEN UPDATE THE PRODUCT
        //
        //
        // const find = await SoftoneProduct.findOne(filter);
        //
        // if (find) {
        //     if (find.MTRL) {
        //         //if you find MTRL it means that the product is in softone and you need to update the prices:
        //         let MTRL = find.MTRL
        //         await updateSoftone(MTRL)
        //
        //     }
        //     let product = await SoftoneProduct.findOneAndUpdate(filter, {
        //             $set: productData,
        //         },
        //         {new: true,}
        //     );
        //
        //     //UPDATE THE STATUS TO UPDATED
        //     await UploadedProduct.findOneAndUpdate({_id: uploadedProduct._id}, {
        //         $set: {
        //             STATUS: product ? 'updated' : 'Αποτυχία update προϊόντος',
        //             NEW: false
        //         }
        //     })
        //
        // }
        //
        // if (!find) {
        //     let product = await SoftoneProduct.create(productData);
        //     //UPDATE THE STATUS TO CRATED
        //     await UploadedProduct.findOneAndUpdate({_id: uploadedProduct._id}, {
        //         $set: {
        //             STATUS: product ? 'created' : 'Αποτυχία εισαγωγής στην βάση',
        //             NEW: true
        //         }
        //     })
        //
        //
        // }
        // return res.status(200).json({success: true, name: data.NAME});
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({success: false, error: "Αποτυχία εισαγωγής στην βάση"});
    }

}

function createData(data) {
    const SOFTONE_DATA = [],
        PRODUCT_DATA = []

    for (let item of data) {
        let COMMON_DATA = {
            NAME: item?.NAME,
            VAT: item?.VAT,
            //CODES:
            CODE: item?.CODE.toString(),
            CODE1: item?.CODE1.toString(),
            CODE2: item?.CODE2.toString(),
            //DIMENSIONS:
            GWEIGHT: item?.GWEIGHT,
            WIDTH: item?.WIDTH,
            HEIGHT: item?.HEIGHT,
            LENGTH: item?.LENGTH,
        }

        let softone_data = {
            ...COMMON_DATA,
            //PRICES:
            PRICER: item?.PRICER,
            PRICEW: item?.PRICEW,
            COST: item?.COST,
        }
        let product_data = {
            ...COMMON_DATA,
            NAME_ENG: item?.NAME_ENG,
            DESCRIPTION: item?.DESCRIPTION,
            DESCRIPTION_ENG: item?.DESCRIPTION_ENG,
            SOFTONESTATUS: false,
            isSkroutz: item?.isSkroutz,
            //PRICES:
            PRICER: item?.PRICER && parseFloat(item.PRICER.toFixed(2)),
            PRICEW: item?.PRICEW && parseFloat(item.PRICEW.toFixed(2)),
            COST: item?.COST && parseFloat(item.COST.toFixed(2)),
        }
        //remove null;
        let _newProductData = removeEmptyObjectFields(product_data)
        let _newSoftoneData = removeEmptyObjectFields(softone_data)
        SOFTONE_DATA.push(_newProductData)
        PRODUCT_DATA.push(_newSoftoneData)
    }
    return {SOFTONE_DATA, PRODUCT_DATA}
}

async function updateSoftone(MTRL) {
    await UploadedProduct.findOneAndUpdate({_id: uploadedProduct._id}, {
        $set: {
            SHOULD_UPDATE_SOFTONE: true,
        }
    })
    let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrlPrice`;
    const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
            username: "Service",
            password: "Service",
            MTRL: MTRL,
            PRICER: productData.PRICER,
            PRICEW: productData.PRICEW,
            PRICE01: productData.PRICER01,
        })
    });
    let responseJSON = await response.json();

    await UploadedProduct.findOneAndUpdate({_id: uploadedProduct._id}, {
        $set: {
            UPDATED_SOFTONE: responseJSON.success ? true : false,
        }
    })
}