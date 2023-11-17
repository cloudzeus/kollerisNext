import { id } from "date-fns/locale";
import connectMongo from "../../../server/config";
import { MtrCategory, MtrGroup, SubMtrGroup } from "../../../server/models/categoriesModel";
import SoftoneProduct from "../../../server/models/newProductModel";
import translateData from "@/utils/translateDataIconv";

export default async function handler(req, res) {
    await connectMongo();

    let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/getMtrl`
    const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
            username: "Service",
            password: "Service",
            company: 1001,
            sodtype: 51,

        })
    });
    let buffer = await translateData(response)
    let updateProducts = [];
    for(let product of buffer.result) {
        let MTRL = product?.MTRL
        let CATEGORY = product?.MTRCATEGORY
        let CATEGORY_NAME = product?.MTRCATEGORY_NAME
        let GROUP = product?.MTRGROUP
        let GROUP_NAME = product?.MTRGROUP_NAME
        let SUBGROUP = product?.CCCSUBGOUP2
        let SUBGROUP_NAME = product?.CCCCSUBGOUP2_NAME

        let updateOBJ = {}
        if(CATEGORY) {
            updateOBJ.MTRCATEGORY= parseInt(CATEGORY)
            updateOBJ.MTRCATEGORY_NAME= CATEGORY_NAME
        }
        if(GROUP) {
            updateOBJ.MTRGROUP= parseInt(GROUP)
            updateOBJ.MTRGROUP_NAME= GROUP_NAME
        }
        if(SUBGROUP) {
            updateOBJ.CCCSUBGOUP2= parseInt(SUBGROUP)
            updateOBJ.CCCSUBGOUP2_NAME= SUBGROUP_NAME
        }

        let productUpdate = await SoftoneProduct.findOneAndUpdate({MTRL: MTRL}, updateOBJ, {new: true})
        console.log('----- UPDATE -----')
        console.log(productUpdate);
        if(productUpdate) {
            updateProducts.push({
                id: productUpdate?._id,
                MTRL: productUpdate?.MTRL,
                NAME: productUpdate?.NAME,
            })
        }
     
        
    }
    console.log(updateProducts);
    return res.status(200).json({success: true, data: category_name});

}