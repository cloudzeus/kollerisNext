import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const countriesSchema = new mongoose.Schema({
    COUNTRY: String,
    SHORTCUT: String,
    NAME: String,
    SOCURENCY: String,
    COUNTRYTYPE: String,
    INTERCODE: String,
    EANCODE: String,
    CNTIRS: String,
    ISACTIVE: String,
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



const Countries = models.Countries || model('Countries', countriesSchema);
export default Countries 