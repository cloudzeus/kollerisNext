import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const markesSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description:String,
    logo:{
    //ALWAYS VECTOR LOGO PATH
        type:String,
        require:true
    },
    videoPromoList:[
        {
            name:String,
            videoUrl:String
        }
    ],
    photosPromoList:[
        {
            name:String,
            photosPromoUrl:String
        }
    ],
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
    status: Boolean,
    
  
},{
    timestamps: true
});











const Markes = models.Markes || model('Markes', markesSchema);
// const Test = models.Test || model('Test', testSchema);
export default Markes
// export default Test