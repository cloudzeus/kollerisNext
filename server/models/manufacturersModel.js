import { model, models } from 'mongoose';
import mongoose from 'mongoose';




const manufacturersSchema = new mongoose.Schema({
    COMPANY: String,
    MTRMANFCTR: String,
    CODE: String,
    NAME: String,
    ISACTIVE: String,
    CCCPRICEMULTI: String,
    CCCMULTITRUE: String,
    CCCYEARGOAL: String,
    updatedFrom: String,
},
    {
        timestamps: true
    }
);



const Manufacturers = models.Manufacturers || model('Manufacturers', manufacturersSchema);
export default Manufacturers