import { model, models } from 'mongoose';
import mongoose from 'mongoose';


const pendingOrderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        unique: true,
        default: 10000,
    },
    minValue: Number,
    supplierName: String,
    supplierEmail: String,
    TRDR: String,
    status: String,
    createdFrom: String,
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


const PendingOrders = models.PendingOrders || model('PendingOrders',  pendingOrderSchema);
export default PendingOrders;