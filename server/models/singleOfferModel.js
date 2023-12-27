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
    FINCODE: String,
    createdFrom: String,
    totalDiscount: Number,
    totalPrice: Number,
    products: [
        {
            _id: String,
            MTRL: String,
            PRICE: Number,
            NAME: String,
            QTY1: Number,
            COST: Number,
            TOTAL_PRICE: Number,
            DISCOUNTED_TOTAL: Number,
            DISC1PRC: Number,
            TOTAL_COST: Number,
        }
    ],




},
    {
        timestamps: true
    }
);


const SingleOffer = models.SingleOffer || model('SingleOffer', singleOfferchema);
export default SingleOffer