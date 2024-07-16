import connectMongo from "../../../server/config";
import Markes from "../../../server/models/markesModel";
import BrandCatalog from "../../../server/models/catalogsModel";
import { uploadBunnyFolderName } from "@/utils/bunny_cdn";
export default async function handler(req, res) {
    const {action} = req.body;
    await connectMongo();
    if(action === 'save') {
        const {fileName,  bunnyData, id } = req.body;
        try {
            let upload = await uploadBunnyFolderName(bunnyData, fileName, 'catalogs')
            let createCatalog = await BrandCatalog.create({
                brand: id,
                name: fileName,
                date: new Date().toISOString()
            })
            if(!createCatalog) throw new Error('Error creating catalog')
            let updateMarkes = await Markes.findByIdAndUpdate({_id: id}, {
                $push: {
                    catalogs: createCatalog._id
                }
            }, {new: true})
            if(!updateMarkes) throw new Error('Error updating markes')
            return res.status(200).json({ 
                success: true, 
                message: "Δημιουργία καταλόγου επιτυχής"
             })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }


    if(action === 'getBrandCatalogs') {
        // this is the brand id
        const {id, skip, limit} = req.body;
        await connectMongo();
        try {
            let cat = await Markes.findById(id).skip(skip).limit(limit).populate('catalogs');
            let totalRecords = await Markes.findById(id).populate('catalogs');
            return res.status(200).json({ success: true, result: cat, totalRecords: totalRecords})
        } catch (e) {
            return res.status(400).json({ success: false, result: null, totalRecords: null })
        }
    }

    if(action === 'findAll') {
        const {skip, limit} = req.body;
        try {
            let result = await BrandCatalog.find().skip(skip).limit(limit);
            return res.status(200).json({ 
                success: true,
                result: result,
            })
        } catch (e) {
            return res.status(400).json({ success: false, result: null })
        }
    }
    if(action === "deleteCatalog") {
        await connectMongo();
        
        const { id} = req.body;
        try {
            let deleteCatalog = await BrandCatalog.findByIdAndDelete(id);
            let updateMarkes = await Markes.findByIdAndUpdate({
                _id: deleteCatalog.brand,
            }, {
                $pull: {
                    catalogs: deleteCatalog._id
                }
            }, {new: true})
            return res.status(200).json({ success: true, result: updateMarkes })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
}