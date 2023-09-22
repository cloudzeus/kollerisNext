import mongoose from 'mongoose';
import { model, models, Schema } from 'mongoose';


const softoneProduct = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    MTRL: { type: String },
    DESCRIPTION: String,
   
    ISACTIVE: String,
    NAME: String,
    CODE: String,
    CODE1: String,
    CODE2: String,
    MTRCATEGORY: {
        type: Number,
        default: 0
    },
    CATEGORY_NAME: String,
    MTRGROUP: {
        type: Number,
        default: 0
    },
    GROUP_NAME: String,
    CCCSUBGOUP2: {
        type: Number,
        default: 0
    },
    SUBGROUP_NAME: String,
    MTRMANFCTR: String,
    MTRMARK: {
        type: Number,
        default: 0
    },
    VAT: String,
    COUNTRY: String,
    INTRASTAT: String,
   
    WIDTH: String,
    HEIGHT: String,
    LENGTH: String,
    GWEIGHT: String,
    VOLUME: String,
    STOCK: String,
    PRICER: String,
    PRICEW: String,
    PRICER02: String,
    PRICER05: String,
    UPDDATE: String,
    availability: {
        DIATHESIMA: String,
        SEPARAGELIA: String,
        DESVMEVMENA: String,
        date: String,
    },
    SOFTONESTATUS: Boolean,
    ATTRIBUTES: [{
        name: String,
        value: String,
    }],
    UPDATEFROM: String,
},
 
{
    timestamps: true,
});


const productSchema = new mongoose.Schema({
    localized: [{
        fieldName: String,
        translations: [
            {
                locale: String,
                code: String,
                translation: String,
            }
        ]
}],
   
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }],
    impas: [{
        type: Schema.Types.ObjectId,
        ref: 'ImpaCodes'
    }],
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }],
    ventorUrl: { type: String, required: false },
    // updatedFrom: String,
    // softoneStatus: Boolean,

},
{
    timestamps: true,
});

productSchema.index({ name: 'text' });







const SoftoneProduct = models.SoftoneProduct || model('SoftoneProduct', softoneProduct)
const Product = models.Product || model('Product', productSchema);

export {
    Product,
}
export default SoftoneProduct;