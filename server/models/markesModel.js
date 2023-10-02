import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const markesSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description:String,
    minItemsOrder:{
        type:Number,
        default:0
    },
    //ΕΔΩ ΕΧΟΥΜΕ ΑΞΙΑΚΟ ΤΟ ΕΛΑΧΙΣΤΟ ΠΟΣΟ ΠΟΥ ΠΡΕΠΕΙ ΝΑ ΕΧΕΙ Η ΠΑΡΑΓΓΕΛΙΑ ΑΝ Η ΤΙΜΗ ΕΙΝΑΙ 0 ΔΕΝ ΥΠΑΡΧΕΙ ΠΕΡΙΟΡΙΣΜΟΣ ΑΥΤΟ ΥΠΟΛΟΓΙΖΕΤΑΙ
    //ΜΕ ΤΟ ΑΘΡΙΣΜΑ ΤΩΝ ITEMS ΠΟΥ ΒΡΙΣΚΟΝΤΑΙ ΣΤΟ ORDERBACKET COLLECTION ΠΡΟΣΘΕΤΟΝΤΑΣ ΤΗΝ ΤΙΜΉ ΚΑΤΑΛΌΓΟΥ ΚΑΙ ΌΧΙ ΤΙΣ ΤΙΜΕΣ ΤΟΥ SOFTONE
    minValueOrder:{
        type:Number,
        default:0    
    },
    //ΕΔΩ ΕΧΟΥΜΕ ΤΟ ΠΟΣΟ ΠΟΥ ΧΡΕΙΑΖΕΤΑΙ ΝΑ ΤΖΟΡΑΡΕΙ Η ΕΤΑΙΡΙΑ ΑΝΑ ΜΑΡΚΑ ΚΑΡΦΩΤΑ ΤΟ ΒΑΖΕΙ Ο ΧΡΗΣΤΗΣ
    minYearPurchases:{
        type:Number,
        default:0
    },
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
    localized: [{
        field: [{
            fieldName: String,
            translation: String
        }],
        locale: String,
        code: String,
    }],
    status: Boolean,
    updatedFrom: String,
    createdFrom: String,
    deletedFrom: String,
  
},{
    timestamps: true
});











const Markes = models.Markes || model('Markes', markesSchema);
// const Test = models.Test || model('Test', testSchema);
export default Markes
// export default Test