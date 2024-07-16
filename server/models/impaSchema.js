import { model, models, Schema } from 'mongoose';
import mongoose from 'mongoose';


 const impaSchema = new mongoose.Schema({
    code: {
        type: String,
    },
    englishDescription: {
        type: String,
    },
    greekDescription: {
        type: String,  },
    unit: {
        type: String,
    },
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
    status: Boolean,
    updatedFrom: String,
    products:[{ type: Schema.Types.ObjectId, ref: "SoftoneProduct" }],
    isActive: {
        type: Boolean,
        default: true
    },

}, {

    timestamps: true,
});









const ImpaCodes = models.ImpaCodes || model('ImpaCodes', impaSchema);


export {
    ImpaCodes
}