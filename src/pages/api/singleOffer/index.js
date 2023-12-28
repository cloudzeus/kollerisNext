import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import Clients from "../../../../server/models/modelClients";
import SingleOffer from "../../../../server/models/singleOfferModel";
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

    if(action=== "findOfferProducts") {
        const {id} = req.body;
        try {
            await connectMongo();
            let newsum =  await calculateTotal(id)
            let find = await SingleOffer.findOne({_id: id}, {products: 1, _id: 1, totalPrice: 1, totalDiscount: 1})
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

   
    if(action === "addDiscount") {
        const {id, discount, products, TRDR, DISC1PRC } = req.body;

        // console.log('products')
        // console.log(products)

        // console.log('id')
        // console.log(id)
        await connectMongo();
       
        
        try {
            const mtrLines = products.map(item => {
                return { MTRL: item.MTRL, QTY1: item.QTY1, DISC1PRC:  DISC1PRC };
            })
            let discountSoftone = await getNewSalesDoc(TRDR, products, discount)
            if(!discountSoftone.success) {
                return res.status(200).json({ success: false, error: "softone saldocnum error" })
            }
     
            for(let product of products) {
                let _discount = DISC1PRC / 100;
                let _newPrice =  product.PRICE - (product.PRICE* _discount);
                let _discounted_total = _newPrice * product.QTY1;
                let update = await SingleOffer.findOneAndUpdate({_id: id, "products.MTRL": product.MTRL}, {
                            $set: {
                                "products.$.DISC1PRC": DISC1PRC,
                                "products.$.DISCOUNTED_TOTAL": _discounted_total
                            }
                }, {new: true})
                        
                console.log('update')
                console.log(update)               
            }
           
      
            // CALCULATE TOTAL PRICE
            await calculateTotal(id)
            return res.status(200).json({ success: true, result: true })

        } catch (e) {
            return res.status(400).json({ success: false })
        }
        // return res.status(200).json({ success: true })
    }


    if(action === "totalDiscount") {
        const {id, TRDR, discount, products } = req.body;
        await connectMongo();
        let discountSoftone = await getNewSalesDoc(TRDR, products, discount)
        if(!discountSoftone.success) {
            return res.status(200).json({ success: false, error: "softone saldocnum error" })
        }
        let updateDiscount = await SingleOffer.findOneAndUpdate({_id: id}, {
            $set: {
                totalDiscount: discount
            }
        }, {new: true})
    
        // UPDATE TOTAL PRICE
        let newsum =  await calculateTotal(id)
        // console.log('newsum')
        // console.log(newsum)
        return res.status(200).json({ success: true })
    }

}


async function getNewSalesDoc(TRDR, MTRLINES, totalDiscount) {
    let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.parastatika/newSalesDoc`;
    const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
            username: "Service",
            password: "Service",
            COMPANY: 1001,
            SERIES: 7021,
            PAYMENT: 1012,
            TRDR: TRDR,
            SOCARRIER: 238,
            DISC1PRC: totalDiscount,
            MTRLINES: MTRLINES
        })
    });

    let responseJSON = await response.json();
    console.log(responseJSON)
    return responseJSON;
}


async function calculateTotal(id) {
    let find = await SingleOffer.findOne({_id: id});
    let totalPrice = 0;
    for(let item of find.products) {
        totalPrice += item.DISCOUNTED_TOTAL ? item.DISCOUNTED_TOTAL : item.TOTAL_PRICE
    }

    if(find.totalDiscount) {
        totalPrice = totalPrice - totalPrice * (find.totalDiscount / 100)
    }

    let update = await SingleOffer.findOneAndUpdate({_id: id}, {
        $set: {
            totalPrice: totalPrice.toFixed(2),
        }
    }, {new: true})
    return update;
}