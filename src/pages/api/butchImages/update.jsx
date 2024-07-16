import connectMongo from "../../../../server/config";
import SoftoneProduct from "../../../../server/models/newProductModel";
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb' 
        }
    }
  }
export default async function handler(req, res) {
    await connectMongo();
    const response = {
        result: [],
        error: null,
        message: "",
        success: false
    };


    if (req.method !== "PUT") {
        response.message = "Method not allowed";
        return res.status(405).json({
            success: false,
            error: "Method not allowed",
        });
    }

    const { data } = req.body;
    try {
        let countSuccess = 0;
        let countError = 0;
        const results = [];
        for (let product of data) {
            let result = {};
            let error = {};
            let field;
            const { images,  ...rest } = product;
            // ------ IMAGEFORMAT  { name: 'image1.jpg' } ------
            // ------ Feild is either CODE or CODE1 ------
            field = Object.values(rest)[0];

            const findExistingImages = await SoftoneProduct.findOne(rest, { images: 1, _id: 0 });
            let newImages;
            if(findExistingImages?.images) {
                newImages = images.filter(img => !findExistingImages.images.some(existingImg => existingImg.name === img.name));
            } else {
                newImages = images;
            }
            const update = { 
                $push: {
                    images: newImages
                }
            };
            const productData = await SoftoneProduct.findOneAndUpdate(
                rest,
                update,
                { new: true }
            );
                //COMMON DATA:
                result.NAME = productData?.NAME || `Δεν βρέθηκε προϊόν με τον Κωδικό: ${field}`
                result.code = field;
            if (productData) {
                //PRODUCT FOUND:
                ++countSuccess;
                result.success = true;
            } else {
                //PRODUCT NOT FOUND:
                result.success  = false;
            }
            results.push(result);
        }
        
        return res.status(200).json({
            result: results,
            countSuccess: countSuccess,
            countError: countError,
            success: true,
            message: 'Τα προϊόντα ενημερώθηκαν επιτυχώς',

        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e.message,
        });
    }
}
