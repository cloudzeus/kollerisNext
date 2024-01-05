import { model, models } from 'mongoose';
import mongoose from 'mongoose';


const pickingnewSchema = new mongoose.Schema({
        TRDR: Number,
        NAME: String,
        JOBTYPETRD: String,
        AFM: String,
        IRSDATA: String,
        ADDRESS: String,
        ZIP: String,
        CITY: String,
        PHONE01: String,
        EMAIL: String,
        REMARKS: String,
        MTRLINES: [{
            LINENUM: Number,
            MTRL: Number,
            ERPCODE: String,
            BARCODE: String,
            KODERGOSTASIOU: String,
            QTY: Number,
            PRICE: Number,
            PRICE1: Number,
            LINEVAL: Number,
            VATAMNT: Number,
            SALESCVAL: Number,
            TRNLINEVAL: Number,
            LTRNLINEVAL: Number,
            SXPERC: Number,
        }],
        SALDOCNUM: String,
        WHOUSE: String,
        INVOICE: {
            FINDOC: String,
            TRNDATE: String,
            TAXSERIES: String,
            TAXSERIESNUM: String,
            SHIPKIND: String,
            PAYMENT: String,
        }
},
    {
        timestamps: true
    }
);


const Pickingnew = models.Pickingnew || model('Pickingnew',  pickingnewSchema);
export default Pickingnew;