import mongoose from 'mongoose';
import { model, models, Schema } from 'mongoose';

const attributesSchema = new mongoose.Schema({
    localized: [{
        field: [{
            fieldName: String,
            translation: String
        }],
        locale: String,
        code: String,
    }],
    attributeValue:
    {
        label: {
            type: String
        }

    }
});

const productAttributesSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    attributes: [
        {
            attribute: {
                type: Schema.Types.ObjectId,
                ref: 'Attribute'
            },
            value: {
                type: String,
                required: true

            }
        }
    ]
});

const attributesGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    MtrGroup: {
        type: Schema.Types.ObjectId,
        ref: 'MtrGroupSchema'
    }
    ,
    attributes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Attribute'
        }]
});


const Attribute = models.Attribute || model('Attribute', attributesSchema);
const AttributesGroup  = models.AttributesGroup || model('AttributesGroup ', attributesGroupSchema);
const ProductAttributes = models.ProductAttributes || model('ProductAttributes', productAttributesSchema);

export {
    Attribute,
    AttributesGroup,
    ProductAttributes
}