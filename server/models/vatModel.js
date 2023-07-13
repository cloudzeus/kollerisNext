import { model, models } from 'mongoose';
import mongoose from 'mongoose';

const vatSchema = new mongoose.Schema({
    VAT: String,
    NAME: String,
    PERCNT: String,
    VATS1: String,
    ISACTIVE: String,
    ACNMSKS: String,
    ACNMSKX: String,
    MYDATACODE: String,
    DEPART: String,
    localized: [
        {
            locale: String,
            name: String,
            fields: [
              {
                fieldName: String,
                translation: String
              }

            ]
        }
    ],
    },
    {
    timestamps: true
    }
);



const Vat = models.Vat || model('Vat', vatSchema);
export default Vat