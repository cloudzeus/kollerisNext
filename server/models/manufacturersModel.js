import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const manufacturersSchema = new mongoose.Schema({
    softOne: {
        COMPANY: String,
        MTRMANFCTR: String,
        CODE: String,
        NAME: String,
        ISACTIVE: String,
        CCCPRICEMULTI: String,
        CCCMULTITRUE: String,
        CCCYEARGOAL: String
      
    },
    status: Boolean,
    updatedFrom: String,
    createdFrom: String,
    deletedFrom: String,
  
    },
    {
    timestamps: true
    }
);



const Manufacturers = models.Manufacturers || model('Manufacturers', manufacturersSchema);
export default Manufacturers