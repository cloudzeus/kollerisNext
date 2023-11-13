import mongoose from 'mongoose';
import { model, models, Schema } from 'mongoose';

const uploadedProduct = new mongoose.Schema({
    //DETAILS:
    NAME: String,
    UNIQUE_CODE: Number,
    EANCODE: String,
    PRICER: Number,
    COST: Number,
    PRICEW: Number,
    PRICER05: Number,
    SUPPLIER_NAME: String,
    SUPPLIER_TRDR: String,
    //STATUSES:
    UPDATED_SOFTONE: Boolean,
    SHOULD_UPDATE_SOFTONE: Boolean,
    STATUS: String, //  'created', 'updated', 'error'
    NEW: Boolean
    
  
   
},

{
    timestamps: true,
});












const UploadedProduct = models.UploadedProduct|| model('UploadedProduct', uploadedProduct)
export default UploadedProduct;