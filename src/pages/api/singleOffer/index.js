import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import Clients from "../../../../server/models/modelClients";
import SingleOffer from "../../../../server/models/singleOfferModel";

export default async function handler(req, res) {
    const action = req.body.action
 
  
    if(action === 'createOrder') {
        let {data, email, name , TRDR} = req.body;
        console.log(data)
        console.log(email, name, TRDR)
        const mtrlArr = data.map(item => {
            const MTRL = parseInt(item.MTRL);
            const QTY1 = parseInt(item.QTY1);
            return { MTRL, QTY1 };
        });
        console.log(data)
        console.log(mtrlArr)
        try {
            async function getSaldoc() {
                let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getSalesDoc`;
                const response = await fetch(URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                        SERIES: 7001,
                        COMPANY:1001,
                        TRDR: TRDR,
                        MTRLINES: mtrlArr
                    })
                });
        
                let responseJSON = await response.json();
                console.log(responseJSON)
            
                return responseJSON;
            }
            let saldoc = await getSaldoc();
            if(!saldoc.success) {
                return res.status(200).json({ success: false, error: "softone saldocnum error" })
            }
            if(saldoc.SALDOCNUM) {
                let create = await SingleOffer.create({
                    SALDOCNUM: saldoc.SALDOCNUM,
                    products: data,
                    status: 'created',
                    TRDR: TRDR,
                    clientName: name,
                    clientEmail: email
                })
                console.log('created single offer')
                console.log(create)
            }
            return res.status(200).json({ success: true })
        } catch (e) {
            return res.status(400).json({ success: false })
        }

    }

    if(action === 'findSingleOrder') {
        const {TRDR} = req.body;
        console.log(TRDR)

        try {
            await connectMongo();
            let find = await SingleOffer.find({ TRDR: TRDR })
            console.log(find)
            return res.status(200).json({ success: true, result: find })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }


  
 
}