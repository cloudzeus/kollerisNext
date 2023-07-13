import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const currencychema = new mongoose.Schema({
    SOCURRENCY: String,
    LOCKID: String,
    SHORTCUT: String,
    NAME: String,
    ISACTIVE: String,
    INTERCODE: String,
    LRATE: String,
    PDECIMALS: String,
    VDECIMALS: String,
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



const Currency = models.Currency || model('Currency', currencychema);
export default Currency