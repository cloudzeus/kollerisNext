import mongoose from 'mongoose';
import { model, models, Schema } from 'mongoose';


    


const productAttributesSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
});



const ProductAttributes = models.ProductAttributes || model('ProductAttributes', productAttributesSchema);

export {
    ProductAttributes
}