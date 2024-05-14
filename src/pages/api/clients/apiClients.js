import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import Clients from "../../../../server/models/modelClients";
import SingleOffer from "../../../../server/models/singleOfferModel";
import Holders from "../../../../server/models/holderModel";
export default async function handler(req, res) {
    const action = req.body.action
 
    if(action === 'addClient') {
        let {data} = req.body;
        let response = {
            success: false,
            message: '',
            error: '',
            result: [],
        };

        let softoneObj = {
            company: 1001,
            sodtype: 13,
            country:parseInt(data.COUNTRY.COUNTRY),
            SOCURRENCY: parseInt(data.COUNTRY.SOCURRENCY),
            name: data.NAME,
            afm: data.AFM,
            ADDRESS: data.ADDRESS,
            PHONE01: data.PHONE01,
            PHONE02: data.PHONE02,
            EMAIL: data.EMAIL,
            code: data.code,
        }
        console.log(softoneObj)
        function removeUndefined(obj) {
            Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
        }
        removeUndefined(softoneObj)
        console.log(softoneObj)
        let buffer;
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/insertSupplier`;
            const result = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    ...softoneObj
                })
            });
            buffer = await translateData(result)
            console.log('buffer')
            console.log(buffer)
            if (!buffer.success) {
                response.message = buffer.error;
                return res.status(200).json(response)
            }
            response.message = "Supplier created in Softone successfully";
        } catch (e) {
            response.message = "SoftoneError Error creating supplier";
            response.error = e;
            return res.status(200).json(response)
        }

        try {
            await connectMongo();
            let find = await Clients.findOne({TRDR: buffer.TRDR})
            if(find) {
                response.success = false;
                response.message = "Client already exists";
                return res.status(200).json(response)
            }

            let result = await Clients.create({
                ...data,
                TRDR: buffer.TRDR,
                OFFERSTATUS: false,
            })
            response.success = true;
            response.message = "Client created successfully";
            response.result = result;
            return res.status(200).json(response)
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
        let response = {
            success: false,
            message: '',
            error: '',
            result: [],
        };
        try {
            await connectMongo();
            const softData = {
                sodType: 13,
                TRDR: data.TRDR,
                CODE: data.CODE,
                NAME: data.NAME,
                AFM: data.AFM,
                ADDRESS: data.ADDRESS,
                PHONE01: data.PHONE01,
                PHONE02: data.PHONE02,
                EMAIL: data.EMAIL,
                ZIP: data.ZIP,
              };

              let removeUndefined = Object.fromEntries(Object.entries(softData).filter(([key, value]) => value !== undefined));
              console.log(removeUndefined)
              try {
                let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/updateSupplier`;
                const result = await fetch(URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                        ...removeUndefined
                    })
                });
                let buffer = await translateData(result)
                console.log(buffer)
                if (!buffer) {
                    response.success = false;
                    response.message = 'No data found';
                    return res.status(200).json(response)
                }
                response.success = true;
                response.message = "Supplier updated in Softone successfully";
            } catch (e) {
                response.message = "SoftoneError Error updating supplier";
                response.error = e;
    
            }
            let result = await Clients.findOneAndUpdate(
                {_id: data._id}, 
                {$set: data},
                {new: true}
            )
            console.log(result)
            if(!result) {
                response.error = 'Error updating client in database';
                response.success = false;
            }
            response.result = result;
            return res.status(200).json(response)
          
        } catch (e) {
            return res.status(400).json(response)
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