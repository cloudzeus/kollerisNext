import { model, models } from 'mongoose';
import mongoose from 'mongoose';


const pendingOrderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        unique: true,
        default: 10000,
    },
    minOrderValue: Number,
    orderCompletionValue: {
        type: Number,
        default: 0,
    },
    supplierName: String,
    supplierEmail: String,
    TRDR: String,
    status: String,
    createdFrom: String,
    products: [
        {
            _id: String,
            MTRL: String,
            NAME: String,
            QTY1: Number,
            PRICE: Number,
            TOTAL_PRICE: Number,
            COST: Number,
            TOTAL_COST: Number,

        }
    ]
},
    {
        timestamps: true
    }
);


const PendingOrders = models.PendingOrders || model('PendingOrders',  pendingOrderSchema);
export default PendingOrders;