import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import Clients from "../../../../server/models/modelClients";
import { connect } from "mongoose";

export default async function handler(req, res) {
    const action = req.body.action
    if (action === 'findAll') {
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/getCustomers`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
            })
        });
        console.log('response')
        let buffer = await translateData(response)
      
        try {
            await connectMongo();
            let findClients = await Clients.find({});
            let missingArray = []
            if(buffer.result.length > findClients.length) {
                      let diff = buffer.result.filter((client) => {
                        let find = findClients.find((findClient) => findClient.TRDR === client.TRDR)
                        if(!find) return client
                      })
                      missingArray.push(...diff)
            }
            return res.status(200).json({ success: true, result: findClients, missing: missingArray })
        } catch (e) {
            return res.status(400).json({ success: false, data: [] })
        }

    }


    if (action === "insert") {
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/getCustomers`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
            })
        });
        console.log('response')
        let buffer = await translateData(response)

        try {
            await connectMongo();
            let result = await Clients.insertMany(buffer.result)
            console.log(result)
            return res.status(200).json({ success: true, data: result })
        } catch (e) {
            return res.status(400).json({ success: false, data: [] })
        }
    }
    if(action === 'upsert') {
        let {data} = req.body;
        console.log('upsert')
        console.log(data)
       

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
}