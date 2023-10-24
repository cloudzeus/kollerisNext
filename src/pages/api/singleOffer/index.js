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

    if(action ==="findOrders") {
        try {
            await connectMongo();
            let find = await SingleOffer.find({})
            console.log(find)
            return res.status(200).json({ success: true, result: find })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if (action === "sendOfferEmail") {
        const { products, email, id} = req.body;
        let body =  products.map((item) => {
            let elements = item.products.map((product) => {
                return `<p>--- <strong>Προϊόν</strong>--- </p><p>Όνομα: ${product.NAME}</p>
                <p>Ποσότητα: <strong>${product.QTY1}</strong></p>
                <p>Τιμή: <strong>${product.PRICE}€</strong></p>
                <p>---------------</p>`;
            }).join('');  // Join array elements into a single string
            return `<p>Κωδικός Impa: <strong>${item.name}</strong></p> ${elements}`;
        });


        try {

            const mail = {
                from: 'info@kolleris.com',
                to: email,
                cc: [ 'gkozyris@i4ria.com', 'johnchiout.dev@gmail.com', 'info@kolleris.com'],
                subject:`Προσφορά - NUM: ${num}`,
                html: `${body}`
              };
         
              
              function sendEmail(mail) {
                return new Promise((resolve, reject) => {
                  transporter.sendMail(mail, (err, info) => {
                    if (err) {
                      console.log(err);
                      resolve(false); // Resolve with false if there's an error
                    } else {
                      console.log('Email sent successfully!');
                      resolve(true); // Resolve with true if the email is sent successfully
                    }
                  });
                });
              }

              let send = await sendEmail(mail);
              console.log(send);
            await connectMongo();
            let update = await Holders.updateOne({ _id: id }, {
                $set: {
                    status: "sent"
                }
            })
            console.log(update)
            let modified = update.modifiedCount
            return res.status(200).json({ success: true, result: modified, send: send })
        } catch (e) {
            return res.status(500).json({ success: false, result: null,  })
        }


    }
 
}