import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const intrastatSchema = new mongoose.Schema({
    COMPANY: String,
    INTRASTAT: String,
    CODE: String,
    NAME: String,
    NAME1: String,
    INTMTRUNIT: String,
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



const Intrastat = models.Intrastat || model('Intrastat', intrastatSchema );
export default Intrastat