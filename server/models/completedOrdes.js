import { model, models } from 'mongoose';
import mongoose from 'mongoose';


const completedOrderSchema = new mongoose.Schema({
    supplierName: String,
    supplierEmail: String,
    TRDR: String,
    status: String,
    PURDOCNUM: Number,
    createdFrom: String,
    products: [
        {
            MTRL: String,
            NAME: String,
            PRICE: Number,
            QTY1: Number,
            COST: Number,
            TOTAL_PRICE: Number,
            TOTAL_COST: Number,
        }
    ]
},
    {
        timestamps: true
    }
);


const CompletedOrders = models.CompletedOrders || model('CompletedOrders', completedOrderSchema);
export default CompletedOrders;