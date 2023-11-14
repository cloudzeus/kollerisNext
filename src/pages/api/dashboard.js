import connectMongo from "../../../server/config";
import SoftoneProduct from "../../../server/models/newProductModel";
import UploadedProduct from "../../../server/models/uploadedProductsModel";


export default async function handler(req, res) {
    const {action} = req.body;

    if(action == 'getStats') {
        try {   
            console.log()
            await connectMongo();
            let totalRecords = await SoftoneProduct.countDocuments({});
        
            let withImages = await SoftoneProduct.countDocuments({hasImage: true});
            let inSoftone = await SoftoneProduct.countDocuments({SOFTONESTATUS: true});

            let imageStat = (withImages / totalRecords) * 100;
            let inSoftoneStat = (inSoftone  / totalRecords) * 100;
            let result = {
                imageStat: imageStat,
                totalWithImages: withImages,
                softoneStat: 0,
                totalProducts: totalRecords,
                inSoftoneStat: inSoftoneStat,
                inSoftone: inSoftone,

            }
            return res.status(200).json({success: true, result: result})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

 
}