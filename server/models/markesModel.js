import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const markesSchema = new mongoose.Schema({
  
    description:String,
    minItemsOrder:{
        type:Number,
        default:0
    },
    minValueOrder:{
        type:Number,
        default:0    
    },
    minYearPurchases:{
        type:Number,
        default:0
    },
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
    catalogName: String,
    
  
},{
    timestamps: true
});











const Markes = models.Markes || model('Markes', markesSchema);
// const Test = models.Test || model('Test', testSchema);
export default Markes
// export default Test