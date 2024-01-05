import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const holderchema = new mongoose.Schema({
    num: Number,
    clientName: String,
    clientEmail: String,
    clientPhone: String,
    TRDR: String,
    status: String,
    createdFrom: String,
    SALDOCNUM: Number,
    FINDOC: Number,
    totalPrice: Number,
    discount: Number,
    discountedTotal: Number,
    holders: [
        {
            name: String,
            isImpa: Boolean,
            impaCode: String,
            products: [
                {   
                    COST: Number,
                    MTRL: String,
                    PRICE: Number,
                    DISCOUNTED_PRICE: Number,
                    DISCOUNT: Number,
                    NAME: String,
                    QTY1: Number,
                    TOTAL_PRICE: Number,
                    TOTAL_COST: Number,
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