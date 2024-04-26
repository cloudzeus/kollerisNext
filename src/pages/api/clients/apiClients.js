import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import Clients from "../../../../server/models/modelClients";
import SingleOffer from "../../../../server/models/singleOfferModel";
import Holders from "../../../../server/models/holderModel";
export default async function handler(req, res) {
    const action = req.body.action
 
    if(action === 'addClient') {
        let {data} = req.body;
       
        try {
            await connectMongo();
            let result = await Clients.create({
                ...data,
                OFFERSTATUS: false,
            })
            console.log(result)
            return res.status(200).json({ success: true })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    
    if(action === 'upsert') {
        let {data} = req.body;
       

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

    if(action === "updateOne") {
        let {data} = req.body;
       
        try {
            await connectMongo();
            const updateData = {
                CODE: data.CODE,
                NAME: data.NAME,
                AFM: data.AFM,
                DIASCODE: data.DIASCODE,
                ADDRESS: data.ADDRESS,
                PHONE01: data.PHONE01,
                PHONE02: data.PHONE02,
                EMAIL: data.EMAIL,
                ZIP: data.ZIP,
              };
            let result = await Clients.findOneAndUpdate(
                {_id: data._id}, 
                {$set: updateData},
                {new: true}
            )
          
            return res.status(200).json({ success: true })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
    //USE IN THE GLOBAL CUSTOMERS TABLE WHERE YOU SELECT A CUSTOMER:
    if(action === "fetchAll") {
        const {skip, limit, searchTerm, sortOffers} = req.body;
        try {
            await connectMongo();
            let totalRecords;
            let clients;
            if(!searchTerm.afm  && !searchTerm.name && !searchTerm.address && !searchTerm.phone01 && !searchTerm.phone02 && !searchTerm.email) {
                totalRecords = await Clients.countDocuments({});
                clients = await Clients.find({}).skip(skip).limit(limit);
            }
            if(searchTerm?.name) {
                let name  = searchTerm.name.replace(/[^a-zA-Z0-9_]/g, '')
                let regexSearchTerm = new RegExp(name , 'i');
                totalRecords = await Clients.countDocuments({ NAME: regexSearchTerm });
                clients = await Clients.find({ NAME: regexSearchTerm }).skip(skip).limit(limit);
            }
            if(searchTerm?.phone01) {
                let regexSearchTerm = new RegExp(searchTerm?.phone01, 'i');
                totalRecords = await Clients.countDocuments({ PHONE01: regexSearchTerm });
                clients = await Clients.find({  PHONE01: regexSearchTerm }).skip(skip).limit(limit);
            }
            if(searchTerm?.phone02) {
                let regexSearchTerm = new RegExp(searchTerm?.phone02, 'i');
                totalRecords = await Clients.countDocuments({ PHONE02: regexSearchTerm });
                clients = await Clients.find({  PHONE02: regexSearchTerm }).skip(skip).limit(limit);
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

            if(sortOffers !== 0 && sortOffers !== undefined) {
              
                clients = await Clients.find({}).sort({OFFERSTATUS: sortOffers}).skip(skip).limit(limit);
               
                totalRecords = await Clients.countDocuments({});
            }
          
          
          
            return res.status(200).json({ success: true, result: clients, totalRecords: totalRecords })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
  
}