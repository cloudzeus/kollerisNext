import mongoose from 'mongoose';
import { model, models, Schema } from 'mongoose';


    


const catalogSchema = new mongoose.Schema({
        url: String,
});



const Catalogs = models.Catalogs || model('Catalogs',  catalogSchema);
export {
    Catalogs
}