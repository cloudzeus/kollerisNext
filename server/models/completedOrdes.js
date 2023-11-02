import { model, models } from 'mongoose';
import mongoose from 'mongoose';


const completedOrderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        unique: true,
        default: 10000,
    },
    supplierName: String,
    supplierEmail: String,
    TRDR: String,
    status: String,
    PURDOCNUM: String,
    createdFrom: String,
    products: [
        {
            _id: String,
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