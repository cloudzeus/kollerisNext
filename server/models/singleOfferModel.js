import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const singleOfferchema = new mongoose.Schema({
    clientName: String,
    clientEmail: String,
    clientPhone: String,
    status: String,
    TRDR: String,
    name: String,
    SALDOCNUM: Number,
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




},
    {
        timestamps: true
    }
);


const SingleOffer = models.SingleOffer || model('SingleOffer', singleOfferchema);
export default SingleOffer