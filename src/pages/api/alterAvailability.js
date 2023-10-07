import format from "date-fns/format";
import connectMongo from "../../../server/config";
import SoftoneProduct from "../../../server/models/newProductModel";
export default async function handler(req, res) {
    let data = req.body;
    const now = new Date();
    const formattedDateTime = format(now, 'yyyy-MM-dd HH:mm:ss');
    let updateResults = [];
    try {
        await connectMongo();
        for (let item of data) {
            let update = await SoftoneProduct.updateOne({ MTRL: item.MTRL }, {
                $set: {
                    availability: {
                        DIATHESIMA: item.DIATHESIMA,
                        SEPARAGELIA: item.SEPARAGELIA,
                        DESVMEVMENA: item.DESVMEVMENA,
                        date: formattedDateTime.toString()
                    }
                }
            })
            updateResults.push({
                MTRL: item.MTRL,
                updated: update.nModified > 0 
            });
    
        }
        return res.status(200).json({ success: true, result: updateResults  })
    } catch (e) {
        return res.status(500).json({ success: false, result: null })
    }
}
