import { model, models } from 'mongoose';
import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
    VAT: String,
    COMPANY: String,
    MTRUNIT: String,
    SHORTCUT: String,
    NAME: String,
    QDECIMALS: String,
    SODIM: String,
    SODIV: String,
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



const Unit = models.Unit || model('Unit' ,unitSchema );
export default Unit