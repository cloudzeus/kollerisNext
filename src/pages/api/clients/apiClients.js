import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import Clients from "../../../../server/models/modelClients";

export default async function handler(req, res) {
    const action = req.body.action
 


    
    if(action === 'upsert') {
        let {data} = req.body;
        console.log('upsert')
       

        try {
            await connectMongo();
            for(let item of data) {
                let result = await Clients.updateOne({TRDR: item.TRDR}, item, {upsert: true})
                console.log(result)
            }
            return res.status(200).json({ success: true })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    
    }

    //USE IN THE GLOBAL CUSTOMERS TABLE WHERE YOU SELECT A CUSTOMER:
    if(action === "fetchAll") {
        console.log('fetch all')
        const {skip, limit, searchTerm} = req.body;
        try {
            await connectMongo();
            let totalRecords;
            let clients;
            if(!searchTerm.afm  && !searchTerm.name && !searchTerm.address && !searchTerm.phone) {
                totalRecords = await Clients.countDocuments({});
                clients = await Clients.find({}).skip(skip).limit(limit);
            }

            if(searchTerm?.name) {
                let regexSearchTerm = new RegExp(searchTerm.name, 'i');
                totalRecords = await Clients.countDocuments({ NAME: regexSearchTerm });
                clients = await Clients.find({ NAME: regexSearchTerm }).skip(skip).limit(limit);
            }

            
            if(searchTerm?.afm) {
                let regexSearchTerm = new RegExp(searchTerm.afm, 'i');
                totalRecords = await Clients.countDocuments({ AFM: regexSearchTerm });
                clients = await Clients.find({ AFM: regexSearchTerm }).skip(skip).limit(limit);
            }
            if(searchTerm?.address) {
                let regexSearchTerm = new RegExp(searchTerm.address, 'i');
                totalRecords = await Clients.countDocuments({ ADDRESS: regexSearchTerm });
                clients = await Clients.find({ ADDRESS: regexSearchTerm }).skip(skip).limit(limit);
            }
          
            if(searchTerm?.email) {
                let regexSearchTerm = new RegExp(searchTerm.email, 'i');
                totalRecords = await Clients.countDocuments({ EMAIL: regexSearchTerm });
                clients = await Clients.find({ EMAIL: regexSearchTerm }).skip(skip).limit(limit);
            }
            return res.status(200).json({ success: true, result: clients, totalRecords: totalRecords })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
    if(action === "searchName") {
        const { skip, limit, searchTerm, key} = req.body;
        try {
            await connectMongo();
            let regexSearchTerm = new RegExp(searchTerm, 'i');
            const totalRecords = await Clients.countDocuments({ ["NAME"]: regexSearchTerm });
            const clients = await Clients.find({ "NAME": regexSearchTerm }).skip(skip).limit(limit);
            console.log('clients')
            console.log(clients)
            return res.status(200).json({ success: true, result: clients, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
    if(action === "searchAFM") {
        const { skip, limit, searchTerm } = req.body;
        console.log(searchTerm)
        try {
            await connectMongo();
            let regexSearchTerm = new RegExp(searchTerm, 'i');
            const totalRecords = await Clients.countDocuments({ AFM: regexSearchTerm });
            const clients = await Clients.find({ AFM: regexSearchTerm }).skip(skip).limit(limit);
            return res.status(200).json({ success: true, result: clients, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
    if(action === "searchAddress") {
        const { skip, limit, searchTerm } = req.body;
        try {
            await connectMongo();
            let regexSearchTerm = new RegExp(searchTerm, 'i');
            const totalRecords = await Clients.countDocuments({ ADDRESS: regexSearchTerm });
            const clients = await Clients.find({ ADDRESS: regexSearchTerm }).skip(skip).limit(limit);
            return res.status(200).json({ success: true, result: clients, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
    if(action === "searchPhone") {
        const { skip, limit, searchTerm } = req.body;
        try {
            await connectMongo();
            let regexSearchTerm = new RegExp(searchTerm, 'i');
            const totalRecords = await Clients.countDocuments({ PHONE01: regexSearchTerm });
            const clients = await Clients.find({ PHONE01: regexSearchTerm }).skip(skip).limit(limit);
            return res.status(200).json({ success: true, result: clients, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
}