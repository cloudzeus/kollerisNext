import { model, models } from 'mongoose';
import mongoose from 'mongoose';


const smallOrderSchema = new mongoose.Schema({
    supplierName: String,
    TRDR: String,
    NAME: String,
    supplierEmail: String,
    status: String,
    PURDOCNUM: String,
    updatedFrom: String,
    createdFrom: String,
    total_cost: Number,
    products: [
        {
            MTRL: String,
            PRICE: Number,
            NAME: String,
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


const SmallOrders = models.SmallOrders || model('SmallOrders', smallOrderSchema);
export default SmallOrders