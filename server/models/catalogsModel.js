import { model, models } from 'mongoose';
import mongoose from 'mongoose';

const brandsCatalogSchema= new mongoose.Schema({
    name: String,
    date: String,
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Markes'
    },
},{
    timestamps: true
});
const BrandCatalog = models.BrandCatalog || model('BrandCatalog', brandsCatalogSchema);
export default BrandCatalog