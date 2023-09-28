import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const holderchema = new mongoose.Schema({
    clientName: String,
    clientEmail: String,
    clientPhone: String,
    status: String,
    holders: [
        {
            id: String,
            impaCode: String,
            products: [
                {
                    _id: String,
                    MTRL: String,
                    PRICE: String,
                    NAME: String,
                    QUANTITY: Number,
                    TOTAL_PRICE: Number

                }
            ],
        }
    ]



},
    {
        timestamps: true
    }
);


const Holders = models.Holders || model('Holders', holderchema);
export default Holders