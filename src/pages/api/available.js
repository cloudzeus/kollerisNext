import connectMongo from "../../../server/config";

import SoftoneProduct from "../../../server/models/newProductModel";


export default async function handler(req, res) {
   
    try {
        await connectMongo();
        let result = await SoftoneProduct.find({})
        for (let item of result) {
            let update = await SoftoneProduct.updateOne(
              { _id: item._id },
              {
                $set: {
                  availability: {
                    DIATHESIMA: parseInt(item.availability.DIATHESIMA),
                    SEPARAGELIA: parseInt(item.availability.SEPARAGELIA),
                    DESVMEVMENA: parseInt(item.availability.DESVMEVMENA),
                    date: formattedDateTime.toString()
                  }
                }
              }
            );
              console.log('updated')
            console.log(update);
          }
        return res.status(200).json({success: true})
    } catch (e) {
        return res.status(500).json({success: null})
    }

}