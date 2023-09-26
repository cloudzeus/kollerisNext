import connectMongo from "../../../server/config";
import { Catalogs } from "../../../server/models/catalogsModle";

export default async function handler(req, res) {
    const {action} = req.body;
    if(action === 'insert') {
        let {url} = req.body;
        console.log(url)
        try {
            await connectMongo();
            let find = await Catalogs.findOne({url: url})
            if(find) {
                return res.status(200).json({result: find, error: 'Το όνομα του αρχείου υπάρχει ήδη' });
            }
            let response = await Catalogs.create({url: url})
            return res.status(200).json({result: response, error: null });
        } catch (e) {
            return res.status(500).json({result: null, error: "catalog not saved in the database" });
        }
    }

    if(action === 'findAll') {
        try {
            await connectMongo();
            let find = await Catalogs.find({})
            console.log(find)
            return res.status(200).json({result: find, error: null });
        } catch (e) {
            return res.status(500).json({result: null, error: "catalog not saved in the database" });
        }
    }

    if(action === 'delete') {
        let {url} = req.body
        console.log(url)
        
        try {
            let deleteCatalog = await Catalogs.deleteOne({url: url})
            console.log('delete')
            console.log(deleteCatalog)
            return res.status(200).json({result: deleteCatalog, error: null });
        } catch (e) {
            return res.status(500).json({result: null, error: "catalog not deleted" });

        }
    }
   

    
}