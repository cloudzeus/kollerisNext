import SoftoneProduct from "../../../server/models/newProductModel";
import connectMongo from "../../../server/config"
import { ImpaCodes } from "../../../server/models/impaSchema"
import Clients from "../../../server/models/modelClients";
import Holders from "../../../server/models/holderModel";
import { closeMongo } from "../../../server/config";
import nodemailer from 'nodemailer';


export default async function handler(req, res) {
    const action = req.body.action
    if (action === "findImpaProducts") {
        let { code } = req.body
        try {
            await connectMongo();
            const impas = await ImpaCodes.find({ code: code })
                .populate('products', 'MTRL CODE PRICER _id NAME');
            let products = impas[0].products
            return res.status(200).json({ success: true, result: products })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }

    }

    if (action === 'findProducts') {
        const { skip, limit } = req.body;
        try {
            await connectMongo();
            const totalRecords = await SoftoneProduct.countDocuments();
            const products = await SoftoneProduct.find({}).skip(skip).limit(limit)
                .select('MTRL CODE PRICER _id NAME')
                .populate('impas');
            return res.status(200).json({ success: true, result: products, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if (action === 'findClients') {
        const { skip, limit, } = req.body;
      
        try {
            await connectMongo();
            const totalRecords = await Clients.countDocuments();
            const clients = await Clients.find({}).skip(skip).limit(limit);
            return res.status(200).json({ success: true, result: clients, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if (action === "searchClients") {
        const { skip, limit, searchTerm } = req.body;
        try {
            await connectMongo();
            let regexSearchTerm = new RegExp("^" + searchTerm, 'i');
            const totalRecords = await Clients.countDocuments({ NAME: regexSearchTerm });
            const clients = await Clients.find({ NAME: regexSearchTerm }).skip(skip).limit(limit);
            console.log(clients)
            return res.status(200).json({ success: true, result: clients, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
      
    }



    if (action === "findHolders") {

        try {
            await connectMongo();
            const holders = await Holders.find({});
            console.log(holders)
            // await closeMongo();
            return res.status(200).json({ success: true, result: holders })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if (action == "saveNewEmail") {
        try {
            await connectMongo();
            const { id, email } = req.body;
            console.log(id, email)
            let update = await Clients.updateOne({ _id: id }, {
                $set: {
                    EMAIL: email
                }
            },
                { upsert: true }
            )
            console.log(update)
            return res.status(200).json({ success: true, result: update })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })

        }
    }


    if(action === "updateStatus") {
        const {status, id} = req.body;
        console.log(id)
        try {
            await connectMongo();
            let update = await Holders.updateOne({_id: id}, {
                $set: {
                    status: status
                }
            })
            console.log(update)
            return res.status(200).json({ success: true, result: update })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
    if (action === "finalizedOffer") {
        const { holders, client, email, id, num} = req.body;

        let body = holders.map((item) => {
            let elements = item.products.map((product) => {
                return `<p>--- <strong>Προϊόν</strong>--- </p><p>Όνομα: ${product.NAME}</p>
                <p>Ποσότητα: <strong>${product.QUANTITY}</strong></p>
                <p>Τιμή: <strong>${product.PRICE}€</strong></p>
                <p>---------------</p>`;
            }).join('');  // Join array elements into a single string

            return `<p>Κωδικός Impa: <strong>${item.impaCode}</strong></p> ${elements}`;
        });


        try {
            const mailOptions = {
                from: "johnchiout.dev@gmail.com", // sender address
                to: email, // list of receivers
                subject: `Προσφορά - NUM: ${num}`, // Subject line
                html: `${body}` // html body
            };



            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });


            await connectMongo();
            let insert = await Holders.create({
                clientName: client.NAME,
                clientEmail: client.EMAIL || '',
                clientPhone: client.PHONE01 || '',
                holders: holders,
                status: 'pending',
                num: num
            })
            console.log(insert)
            await closeMongo();
            return res.status(200).json({ success: true, result: insert })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }


    }

    if (action === "addProductsToImpa") {
        const { products, impa } = req.body;
        console.log('PRODUCTS')
     
        console.log(products)
        console.log('impa')
        console.log(impa)
        const ids = products.map((item) => item._id)
        try {
            await connectMongo();
            let find = await ImpaCodes.updateOne(
                { code: impa },
                { $addToSet: { products: { $each: ids } } }

            )
    
            // await closeMongo();
            console.log('find')
            console.log(find);
            return res.status(200).json({ success: true, result: find })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ success: false, result: null })
        }
    }

  
}



// const transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',
//     port: 587,
//     secure: false, // use SSL, you can try with true also
//     auth: {
//         user: process.env.OFFICE365_USER,
//         pass: process.env.OFFICE365_PASSWORD
//     },
//     tls: {
//         ciphers: 'SSLv3'
//     }
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "johnchiout.dev@gmail.com",
        pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS
    }
});