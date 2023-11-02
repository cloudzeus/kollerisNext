import { model, models } from 'mongoose';
import mongoose from 'mongoose';


const supplierOrderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        unique: true,
        default: 10000,
    },
    supplierName: String,
    TRDR: String,
    NAME: String,
    supplierEmail: String,
    status: String,
    PURDOCNUM: String,
    createdFrom: String,
    products: [
        {
            _id: String,
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


const SupplierOrders= models.SupplierOrders || model('SupplierOrders', supplierOrderSchema);
export default SupplierOrders