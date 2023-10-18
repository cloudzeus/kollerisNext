import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const holderchema = new mongoose.Schema({
    num: Number,
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
                    QTY1: Number,
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