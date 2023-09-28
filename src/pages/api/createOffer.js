import SoftoneProduct from "../../../server/models/newProductModel";
import connectMongo from "../../../server/config"
import { ImpaCodes } from "../../../server/models/impaSchema"
import Clients from "../../../server/models/modelClients";


export default async function handler(req, res) {
    const action = req.body.action 
    console.log(action)
    if(action === 'findImpaBatch') {
        let {skip, limit} = req.body;
        console.log('skip', skip, 'limit', limit)
        try {
            await connectMongo();
            let totalRecords;
            totalRecords = await ImpaCodes.countDocuments();
            const impas = await ImpaCodes.find({}).skip(skip).limit(limit);
            return res.status(200).json({success: true, result: impas, totalRecords})
        } catch (e) {
            console.log(e)
        }
    }

    if(action === "searchGreekImpa") {
        let {skip, limit, searchTerm} = req.body;
        let regexSearchTerm = new RegExp("^" + searchTerm.greek, 'i');
        const totalRecords = await ImpaCodes.countDocuments({ greekDescription: regexSearchTerm});
        const impas  = await ImpaCodes.find({ greekDescription: regexSearchTerm}).skip(skip).limit(limit);
        return res.status(200).json({success: true, result: impas, totalRecords: totalRecords})
    }
    if(action === "searchEng") {
        let {skip, limit, searchTerm} = req.body;
        let regexSearchTerm = new RegExp("^" + searchTerm.english, 'i');
        const totalRecords = await ImpaCodes.countDocuments({ englishDescription: regexSearchTerm});
        const impas  = await ImpaCodes.find({ englishDescription: regexSearchTerm}).skip(skip).limit(limit);
        return res.status(200).json({success: true, result: impas, totalRecords: totalRecords})
    }
    if(action === "searchCode") {
        let {skip, limit, searchTerm} = req.body;
        let regexSearchTerm = new RegExp("^" + searchTerm.code, 'i');
        const totalRecords = await ImpaCodes.countDocuments({code: regexSearchTerm});
        const impas  = await ImpaCodes.find({ code: regexSearchTerm}).skip(skip).limit(limit);
        return res.status(200).json({success: true, result: impas, totalRecords: totalRecords})
    }

    if(action === "findImpaProducts") {
        let {code } = req.body
        try {
            await connectMongo();
            const impas = await ImpaCodes.find({code: code})
            .populate('products', 'MTRL CODE PRICER _id NAME');
            let products = impas[0].products
            return res.status(200).json({success: true, result: products})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
         
    }

    if(action === 'findProducts') {
        const {skip, limit} = req.body;
        console.log(skip, limit)
        try {
            await connectMongo();
            const totalRecords = await SoftoneProduct.countDocuments();
            const products = await SoftoneProduct.find({}).skip(skip).limit(limit)
            .select('MTRL CODE PRICER _id NAME')
            .populate('impas');
            return res.status(200).json({success: true, result: products, totalRecords: totalRecords})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

    if(action === 'findClients') {
        const {skip, limit} = req.body;
        console.log(skip, limit)
        console.log('sefsef')
        try {
            await connectMongo();
            const totalRecords = await Clients.countDocuments();
            const clients = await Clients.find({}).skip(skip).limit(limit);
            console.log(clients)
            return res.status(200).json({success: true, result: clients, totalRecords: totalRecords})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

    if(action === "relateProducts") {
        let { products, impa} = req.body;
        console.log(products, impa)
        try {
            return res.status(200).json({success: true, result: null})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

}