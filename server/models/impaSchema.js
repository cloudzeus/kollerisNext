import mongoose from 'mongoose';
import { model, models, Schema } from 'mongoose';

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
    products:[{ type: Schema.Types.ObjectId, ref: "Product" }]

}, {

    timestamps: true,
});















const   ImpaCodes = mongoose.models.ImpaCodes || mongoose.model('ImpaCodes', impaSchema );


export {
    ImpaCodes
}