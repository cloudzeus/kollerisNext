import { model, models } from 'mongoose';
import mongoose from 'mongoose';

//Need to import BrandCatalog to use it in the markesSchema
//eslint-disable-next-line
import {BrandCatalog} from './catalogsModel.js'

const markesSchema = new mongoose.Schema({
    description:String,
    logo:{
        type:String,
    },
    videoPromoList:[
        {
            name:String,
            videoUrl:String
        }
    ],
    images: [{
        name: String,
    }],
    pimAccess:{
        pimUrl:String,
        pimUserName:String,
        pimPassword:String
    },
    webSiteUrl:String,
    officialCatalogueUrl:String,
    facebookUrl:String,
    instagramUrl:String,
    softOne: {
        COMPANY: String,
        SODTYPE: String,
        MTRMARK: {
            type: Number,
            require: true
        },
        CODE: String,
        NAME: String,
        ISACTIVE:Number
    },

    updatedFrom: String,
    catalogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BrandCatalog'
    }],
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    
  
},{
    timestamps: true
});











const Markes = models.Markes || model('Markes', markesSchema);
// const Test = models.Test || model('Test', testSchema);
export default Markes
// export default Test