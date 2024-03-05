import { images } from "../../../next.config";
import SoftoneProduct from "../../../server/models/newProductModel";
import connectMongo from "../../../server/config";
export default async function handler(req, res) {
    const {action} = req.body;
    if(action === "product") {
        const {imagesURL, id} = req.body;
        console.log(imagesURL)
        const product = await SoftoneProduct.findOneAndUpdate(
            { id: id }, // Using the passed 'id' variable
            { $push: { images: imagesURL } }, // Push the 'imagesURL' to the 'images' array
            { new: true } // To return the updated document
        );

        console.log(product)
        return res.status(200).json({message: "success"})
    }

    if(action === 'getProductImages') {
        const {id} = req.body;
        console.log(id)
        await connectMongo()
        const product = await SoftoneProduct.findOne({id: id}, {images: 1, id: 0});
        console.log(product)
        return res.status(200).json({message: "success", product: product})
    }
}