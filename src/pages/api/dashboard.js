import connectMongo from "../../../server/config";
import SoftoneProduct from "../../../server/models/newProductModel";



export default async function handler(req, res) {
    const {action} = req.body;

    if(action == 'getStats') {
        try {   
            console.log()
            await connectMongo();
            let totalRecords = await SoftoneProduct.countDocuments({});
          
            function percentage(input) {
                return (input / totalRecords) * 100;
            }

            async function mongoResults(filter) {
                let result = await SoftoneProduct.countDocuments(filter);
                return result;
            }
            //COUNT HOW MANY:
            let withImages = await mongoResults({hasImage: true});
            let inSoftone = await mongoResults({SOFTONESTATUS: true});
            let inSkroutz = await mongoResults({isSkroutz: true});
            let activeProducts = await mongoResults({ISACTIVE: true});
            let haveDescriptions = await mongoResults({DESCRIPTION: {$exists: true, $ne: ''}})
               //CREATER THE STAT:
            let imageStat = percentage(withImages)
            let inSoftoneStat = percentage(inSoftone)
            let inSkroutzStat = percentage(inSkroutz)
            let activeProductsStat = percentage(activeProducts)
            let haveDescriptionsStat = percentage(haveDescriptions)
         
            let result = {
                totalProducts: totalRecords,
                //Image Stats:
                imageStat: imageStat,
                totalWithImages: withImages,
                //in softone
                inSoftoneStat: inSoftoneStat,
                inSoftone: inSoftone,
                //Scroutz:
                inSkroutz: inSkroutz,
                inSkroutzStat: inSkroutzStat,
                //active products:
                activeProducts: activeProducts,
                activeProductsStat: activeProductsStat,
                //have descriptions:
                haveDescriptions: haveDescriptions,
                haveDescriptionsStat: haveDescriptionsStat,


            }
            return res.status(200).json({success: true, result: result})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

    if(action === 'fetchProducts') {
        const {filter, skip, limit} = req.body;
        console.log(filter)

        await connectMongo();
        let result = await SoftoneProduct.find(filter).skip(skip).limit(limit);
        let totalRecords = await SoftoneProduct.countDocuments(filter);
        return res.status(200).json({success: true, result: result, totalRecords: totalRecords})
    }

 
}