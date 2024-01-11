import { model, models } from 'mongoose';
import mongoose from 'mongoose';


const pendingOrderSchema = new mongoose.Schema({
    minOrderValue: Number,
    total_order_cost: Number,
    orderCompletionValue: {
        type: Number,
        default: 0,
    },
    supplierName: String,
    supplierEmail: String,
    TRDR: String,
    status: String,
    createdFrom: String,
    updatedFrom: String,
    products: [
        {
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