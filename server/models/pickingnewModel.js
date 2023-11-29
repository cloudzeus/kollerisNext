import { model, models } from 'mongoose';
import mongoose from 'mongoose';


const pickingnewSchema = new mongoose.Schema({
        TRDR: String,
        SUPPLIER: String,
        PRODUCTS: [{
            MTRL: String,
            NAME: String,
        }],
        SALDOCNUM: String,
        WHOUSE: String,
        INVOICE_STATUS: Boolean,
},
    {
        timestamps: true
    }
);


const Pickingnew = models.Pickingnew || model('Pickingnew',  pickingnewSchema);
export default Pickingnew;