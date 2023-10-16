import { model, models } from 'mongoose';
import mongoose from 'mongoose';


const completedOrderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        unique: true,
        default: 10000,
    },
    MTRMARK: Number,
    supplierName: String,
    TRDR: String,
    NAME: String,
    supplierEmail: String,
    status: String,
    PURDOCNUM: String,
    products: [
        {
            _id: String,
            MTRL: String,
            PRICE: String,
            NAME: String,
            QTY1: Number,
            TOTAL_PRICE: Number

        }
    ]
},
    {
        timestamps: true
    }
);


const CompletedOrders = models.CompletedOrders || model('CompletedOrders', completedOrderSchema);
export default CompletedOrders;