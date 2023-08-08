import mongoose from 'mongoose';
import { model, models, Schema } from 'mongoose';





const softoneProduct = new mongoose.Schema({
    MTRL: { type: String, required: true },
    ISACTIVE: String,
    NAME: String,
    CODE: String,
    CODE1: String,
    CODE2: String,
    MTRCATEGORY: String,
    MTRGROUP: String,
    MTRTYPE: String,
    CCCSUBGOUP2: String,
    MTRMANFCTR: String,
    MTRMARK: String,
    VAT: String,
    COUNTRY: String,
    INTRASTAT: String,
    MTRUNIT1: String,
    MTRUNIT3: String,
    MU31: String,
    MTRUNIT4: String,
    MU41: String,
    WIDTH: String,
    HEIGHT: String,
    LENGTH: String,
    GWEIGHT: String,
    VOLUME: String,
    STOCK: String,
    SOCURRENCY: String,
    PRICER: String,
    PRICEW: String,
    PRICER01: String,
    PRICER02: String,
    PRICER03: String,
    PRICER04: String,
    PRICER05: String,
    PRICEW01: String,
    PRICEW02: String,
    PRICEW03: String,
    PRICEW04: String,
    PRICEW05: String,
    UPDDATE: String,
}, {

    timestamps: true,
});






const SoftoneProduct =  models.SoftoneProduct || model('SoftoneProduct', softoneProduct)


export default SoftoneProduct;