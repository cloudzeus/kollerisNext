import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import Clients from "../../../../server/models/modelClients";
import SingleOffer from "../../../../server/models/singleOfferModel";
import { transporter } from "@/utils/nodemailerConfig";
import { sendEmail } from "@/utils/offersEmailConfig";
import createCSVfile from "@/utils/createCSVfile";


export default async function handler(req, res) {
    const action = req.body.action
    if (action === 'createOrder') {
        console.log('create offer')
        const { data, email, name, TRDR, createdFrom } = req.body;
        console.log(data)
        console.log(email, name, TRDR)
        const mtrlArr = data.map(item => {
            const MTRL = parseInt(item.MTRL);
            const QTY1 = parseInt(item.QTY1);
            return { MTRL, QTY1 };
        });
     
        try {
            async function getSaldoc() {
                let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getSalesDoc`;
                const response = await fetch(URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                        SERIES: 7001,
                        COMPANY: 1001,
                        TRDR: TRDR,
                        MTRLINES: mtrlArr
                    })
                });

                let responseJSON = await response.json();
                console.log(responseJSON)

                return responseJSON;
            }

            async function getFinDoc(saldoc) {
                let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getFinDocInfo`;
                const response = await fetch(URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                        SALDOC: saldoc,
                        SODTYPE: 13,
                      
                    })
                });

             
                let data = await translateData(response)
                return  data;
            }
            let saldoc = await getSaldoc();
            if (!saldoc.success) {
                return res.status(200).json({ success: false, error: "softone saldocnum error" })
            }
        
            let finDoc = await getFinDoc(saldoc.SALDOCNUM);
            if (!finDoc.success) {
                return res.status(200).json({ success: false, error: "softone findoc error" })
            }
            let create = await SingleOffer.create({
                SALDOCNUM: saldoc.SALDOCNUM,
                FINCODE: finDoc.result[0].FINCODE,
                products: data,
                status: 'created',
                TRDR: TRDR,
                clientName: name,
                clientEmail: email,
                createdFrom: createdFrom
            })
            console.log('create')
            console.log(create)
            await Clients.updateOne({ TRDR: TRDR }, {
                $set: {
                    OFFERSTATUS: true
                }
            })
            return res.status(200).json({ success: true })
        } catch (e) {
            return res.status(400).json({ success: false })
        }

    }

   
    if (action === "findOffers") {
        const { clientName } = req.body;
        try {
            await connectMongo();
            let find;
            if (clientName !== '' || clientName !== null || clientName !== undefined) {
                console.log('ther is no client name')
                find = await SingleOffer.find({ clientName: clientName })
            } 
            if(clientName === undefined || clientName === null || clientName === ''){
                find = await SingleOffer.find().sort({createdAt: -1})
            }
            return res.status(200).json({ success: true, result: find })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if(action === "sendEmail") {
        const {products, cc, subject, fileName, message, createdAt, includeFile, clientEmail, clientName, SALDOCNUM} = req.body;
            let newcc = []
            for(let item of cc) {
                newcc.push(item.email)
            }
          
           try {
            let csv = await createCSVfile(products)
            console.log(csv)
            let send = await sendEmail(clientEmail, newcc, subject, message, fileName, csv, includeFile);
            console.log(send)
            if(send) {
                await SingleOffer.updateOne({SALDOCNUM: SALDOCNUM}, {
                    $set: {
                        status: 'sent'
                    }
                })
            }
            return res.status(200).json({ success: true, send: send})
           } catch (e) {
            return res.status(400).json({ success: false })
           }
    }

    if(action === "deleteOffer") {
        const {id} = req.body;
        console.log(id)
        try {
            let del = await SingleOffer.deleteOne({_id: id})
            console.log('delete offer')
            console.log(del)
            return res.status(200).json({ success: true, result: del })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }


}