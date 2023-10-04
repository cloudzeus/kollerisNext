import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../server/config";
import { Product } from "../../../server/models/newProductModel";
import format from "date-fns/format";
import SoftoneProduct from "../../../server/models/newProductModel";


export default async function handler(req, res) {
    console.log('availability')
    let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAvailability`;
    const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
            username: "Service",
            password: "Service",
        })
    });
    try {
        await connectMongo();
        let buffer = await translateData(response)
        const now = new Date();
        const formattedDateTime = format(now, 'yyyy-MM-dd HH:mm:ss');
        for(let item of buffer.result) {
            let update = await SoftoneProduct.updateOne({MTRL: item.MTRL}, {
                $set: {
                    availability: {
                        DIATHESIMA: item.DIATHESIMA,
                        SEPARAGELIA: item.SEPARAGELIA,
                        DESVMEVMENA: item.DESVMEVMENA,
                        date: formattedDateTime.toString()
                    }
                }
            })
        }
        return res.status(200).json({success: true})

    } catch (e) {
        return res.status(500).json({success: null})
    }

    // try {
     
    // } catch (e) {
    //     console.log(e)
    // }
    // await connectMongo();
    // let result = await Product.find().populate('softoneProduct')
    // for(let item of result) {
    //     let update = await Product.updateOne({_id: item._id},{
    //         $set: {
    //             MTRL: item.softoneProduct.MTRL
    //         }
    //     })
    //     console.log(update)
    // }

    // return res.status(200).json({result})

}