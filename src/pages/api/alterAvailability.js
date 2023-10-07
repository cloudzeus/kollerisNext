import format from "date-fns/format";
import connectMongo from "../../../server/config";
import SoftoneProduct from "../../../server/models/newProductModel";
export default async function handler(req, res) {
    let data = req.body;
    const now = new Date();
    const formattedDateTime = format(now, 'yyyy-MM-dd HH:mm:ss');
    try {
        await connectMongo();
        let update = await SoftoneProduct.updateOne({ MTRL: data.MTRL }, {
                $set: {
                    availability: {
                        DIATHESIMA: data.DIATHESIMA,
                        SEPARAGELIA: data.SEPARAGELIA,
                        DESVMEVMENA: data.DESVMEVMENA,
                        date: formattedDateTime.toString()
                    }
                }
            })
           
             let updateResult = {
                MTRL: item.MTRL,
                updated: update.modifiedCount > 0 
            };
            return res.status(200).json({ success: true, result: updateResult  })
      
    } catch (e) {
        return res.status(500).json({ success: false, result: null })
    }
}
