import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import Clients from "../../../../server/models/modelClients";
import SingleOffer from "../../../../server/models/singleOfferModel";
import { sendEmail } from "@/utils/offersEmailConfig";
import createCSVfile from "@/utils/createCSVfile";
import Offer from "@/components/grid/Product/Offer";


export default async function handler(req, res) {
    const action = req.body.action
    if (action === 'createOrder') {
        const { data, email, name, TRDR, createdFrom } = req.body;
  
        const mtrlArr = data.map(item => {
            const MTRL = parseInt(item.MTRL);
            const QTY1 = parseInt(item.QTY1);
            return { MTRL, QTY1 };
        });

       
        let total = data.reduce((a, b) => a + (b['PRICE']), 0);
       
        try {
           
            // let saldoc = await getSaldoc(TRDR, mtrlArr);
            // if (!saldoc.success) {
            //     return res.status(200).json({ success: false, error: "softone saldocnum error" })
            // }
        
            // let finDoc = await getFinDoc(saldoc.SALDOCNUM);
            // if (!finDoc.success) {
            //     return res.status(200).json({ success: false, error: "softone findoc error" })
            // }


            let create = await SingleOffer.create({
              
                products: data,
                status: 'created',
                TRDR: TRDR,
                clientName: name,
                clientEmail: email,
                createdFrom: createdFrom,
                totalPrice: total,
                discountedTotal: total,
                discount: 0,

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
            // let newsum =  await calculateTotal(id)
            let find = await SingleOffer.findOne({_id: id}, {products: 1, _id: 1, totalPrice: 1, discountedTotal: 1, discount: 1})
            console.log(find)
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

    
    if(action === "updateDiscount") {
        const {id, discount, TRDR, MTRL, PRICE, QTY1, } = req.body;
        const mtrLines = [{
            MTRL: MTRL,
            QTY1: QTY1,
            PRICE: PRICE
        
        }]


        await connectMongo();
        try {
            
            let discountSoftone = await getNewSalesDoc(TRDR, mtrLines, discount)
        
            if(!discountSoftone.success) {
                return res.status(200).json({ success: false, error: "softone saldocnum error" })
            }
     
                let _discount = discount / 100;
                let _discounted_price = PRICE - (PRICE * _discount);
                let _newTotal = _discounted_price * QTY1;
                let update = await SingleOffer.findOneAndUpdate({_id: id, "products.MTRL": MTRL}, {
                            $set: {
                                "products.$.DISCOUNT":  discount,
                                "products.$.TOTAL_PRICE": _newTotal.toFixed(2),
                                "products.$.DISCOUNTED_PRICE": _discounted_price.toFixed(2) 
                            }
                }, {new: true})
           
     
            return res.status(200).json({ success: true, result: true })

        } catch (e) {
            return res.status(400).json({ success: false })
        }
        // return res.status(200).json({ success: true })
    }

    if(action === "updateDiscountTotal") {
        const {id, discount, TRDR} = req.body;
        await connectMongo();
       
        
        try {
            let offer = await SingleOffer.findOne({_id: id})
            console.log(offer)
            const mtrLines = offer.products.map(item => {
                const MTRL = parseInt(item.MTRL);
                const QTY1 = parseInt(item.QTY1);
                const PRICE = item.DISCOUNTED_PRICE ? item.DISCOUNTED_PRICE : item.PRICE;
                return { MTRL, QTY1, PRICE };
            })
            // let discountSoftone = await getNewSalesDoc(TRDR, mtrLines, discount)
            // if(!discountSoftone.success) {
            //     return res.status(200).json({ success: false, error: "softone saldocnum error" })
            // }

            let discountedTotal = offer.totalPrice - offer.totalPrice * (discount / 100);
            console.log('discountedTotal')
            console.log(discountedTotal)
            let update = await SingleOffer.findOneAndUpdate({_id: id}, {
                $set: {
                    discount: discount,
                    discountedTotal: discountedTotal.toFixed(2)
                }
            }, {new: true})

            return res.status(200).json({ success: true, result: true })

        } catch (e) {
            return res.status(400).json({ success: false })
        }
        // return res.status(200).json({ success: true })
    }


    // if(action === "totalDiscount") {
    //     const {id, TRDR, discount, products } = req.body;
    //     await connectMongo();
    //     let discountSoftone = await getNewSalesDoc(TRDR, products, discount)
    //     if(!discountSoftone.success) {
    //         return res.status(200).json({ success: false, error: "softone saldocnum error" })
    //     }
    //     let updateDiscount = await SingleOffer.findOneAndUpdate({_id: id}, {
    //         $set: {
    //             totalDiscount: discount
    //         }
    //     }, {new: true})
    
    //     // UPDATE TOTAL PRICE
    //     let newsum =  await calculateTotal(id)
    //     console.log('newsum')
    //     console.log(newsum)
    //     return res.status(200).json({ success: true })
    // }

    if(action === "calculateTotal") {
        const {id} = req.body;
        await connectMongo();
        let find = await SingleOffer.findOne({_id: id});
        
        let totalPrice = 0;
        for(let item of find.products) {
            let _price = item.DISCOUNTED_PRICE ? item.DISCOUNTED_PRICE : item.PRICE;
            totalPrice += _price * item.QTY1;
            
        }
        // console.log('totalPrice')
        // console.log(totalPrice)
        // if(find.discountedTotal) {
        //     totalPrice = totalPrice - totalPrice * (find?.discount / 100)
        // }
        // console.log('totalPrice')
        // console.log(totalPrice)
        let update = await SingleOffer.findOneAndUpdate({_id: id}, {
            $set: {
                totalPrice: totalPrice.toFixed(2),
            }
        }, {new: true})
        console.log('update')
        return res.status(200).json({ success: true, result: update })
    
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
    console.log(find)
    let totalPrice = 0;
    for(let item of find.products) {
        totalPrice += item.DISCOUNTED_PRICE ? item.DISCOUNTED_PRICE : item.PRICE
    }

    if(find.discountedTotal) {
        totalPrice = totalPrice - totalPrice * (find.discountedTotal / 100)
    }

    let update = await SingleOffer.findOneAndUpdate({_id: id}, {
        $set: {
            discountedTotal: discountedTotal.toFixed(2),
        }
    }, {new: true})
    return update;
}





 export async function getSaldoc(TRDR, mtrlArr) {
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

export async function getFinDoc(saldoc) {
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