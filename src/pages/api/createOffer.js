import SoftoneProduct from "../../../server/models/newProductModel";
import connectMongo from "../../../server/config"
import { ImpaCodes } from "../../../server/models/impaSchema"
import Clients from "../../../server/models/modelClients";
import Holders from "../../../server/models/holderModel";
import SingleOffer from "../../../server/models/singleOfferModel";
import createCSVfile from "@/utils/createCSVfile";
import { sendEmail } from "@/utils/offersEmailConfig";


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



    if (action === "findHolderProducts") {
        const { documentID, holderID } = req.body;
        try {
            await connectMongo();
            const holder = await Holders.findOne({ _id: documentID, 'holders._id': holderID }, { holders: { products: 1 } })
            console.log(holder)
            return res.status(200).json({ success: true, result: holder })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if (action === "findHolderProductsByDocumentID") {
        const { documentID } = req.body;
        console.log(documentID)
        try {
            await connectMongo();
            const holder = await Holders.find({ _id: documentID }, { holders: { products: 1 } })
            console.log(holder)
            return res.status(200).json({ success: true, result: holder })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if (action == "saveNewEmail") {
        try {
            await connectMongo();
            const { id, email } = req.body;
            console.log('email')
            console.log(id, email)

            let update = await Clients.updateOne({ _id: id }, {
                $set: {
                    EMAIL: email
                }
            })
            console.log(update)
            return res.status(200).json({ success: true, result: update })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })

        }
    }


    if (action === "updateStatus") {
        const { status, id } = req.body;
        console.log(id)
        try {
            await connectMongo();
            let update = await Holders.updateOne({ _id: id }, {
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


    if (action === "addOfferDatabase") {
        const { holders, client, email, id, num } = req.body;
        console.log(JSON.stringify(holders))
        try {
            await connectMongo();
            let insert = await Holders.create({
                clientName: client.NAME,
                clientEmail: client.EMAIL || '',
                clientPhone: client.PHONE01 || '',
                holders: holders,
                status: 'created',
                num: num
            })
            await Clients.updateOne({ NAME: NAME }, {
                $set: {
                    OFFERSTATUS: true
                }
            })
            return res.status(200).json({ success: true, result: insert })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }


    }
    if (action === "sendEmail") {
        const { holders, products, cc, clientName, clientEmail, id, num, subject, message, fileName, includeFile } = req.body;
        let newcc = []
        for (let item of cc) {
            newcc.push(item.email)
        }

        try {
            let csv = await createCSVfile(products)
            console.log(csv)
            let send = await sendEmail(clientEmail, newcc, subject, message, fileName, csv, includeFile);
            console.log(send)
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

    if (action === "removeHolderItems") {
        const { mtrl, documentID, holderID } = req.body;
        console.log(holderID)
        console.log(documentID)
        try {
            await connectMongo();
            let removeItem = await Holders.findOneAndUpdate(
                { _id: documentID, 'holders._id': holderID },
                {
                    $pull: {
                        'holders.$.products': { MTRL: mtrl.toString() }
                    }
                }
            )
            console.log(removeItem)
            return res.status(200).json({ success: true, result: removeItem })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
    if (action === "findClientHolder") {
        const { clientName } = req.body;

        try {
            let holder;
            await connectMongo();
            if (clientName) {
                holder = await Holders.find({ clientName: clientName })
            }
            if (!clientName || clientName === '') {
                holder = await Holders.find({})
            }

            return res.status(200).json({ success: true, result: holder })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if (action === 'countOffers') {
        const { clientName } = req.body;
        try {
            await connectMongo();
            const totalRecords = await Holders.countDocuments({ clientName: clientName });
            const totalRecords2 = await SingleOffer.countDocuments({ clientName: clientName });
            const newRecords = totalRecords + totalRecords2
            console.log(totalRecords)
            console.log(newRecords)
            return res.status(200).json({ success: true, result: newRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
}



