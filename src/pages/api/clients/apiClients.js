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


    //Used on the clients page, and i think on the offers page.
    if(action === 'search') {
        let {searchTerm, skip, limit} = req.body;
        let regexSearchTerm = new RegExp("^" + searchTerm, 'i');
        console.log(searchTerm)
        try {
            await connectMongo();
            let clients;
            let totalRecords;
            if(searchTerm === '') {
                totalRecords = await Clients.countDocuments({})
               
                clients = await Clients.find({})
                .skip(skip)
                .limit(limit);
            } 
            if(searchTerm !== '') {
                clients = await Clients.find({
                    NAME: regexSearchTerm
                 });
                
                 totalRecords = await Clients.countDocuments({
                    NAME: regexSearchTerm
                 }).skip(skip).limit(limit);
            }

            return res.status(200).json({ success: true, result: clients, totalRecords: totalRecords })


        } catch (e) {
            return res.status(400).json({ success: false })
        }

      
    }

    if(action === 'sendOffer') {
        let {data } = req.body;
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getSalesDoc`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                SERIES: 7001,
                COMPANY:1001,
                ...data
            })
        });
        let responseJSON = await response.json();
        console.log(responseJSON)
        return res.status(200).json({ success: true, result: responseJSON })
    }
}