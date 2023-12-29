import SoftoneProduct from "../../../server/models/newProductModel";
import connectMongo from "../../../server/config"
import { ImpaCodes } from "../../../server/models/impaSchema"
import Clients from "../../../server/models/modelClients";
import Holders from "../../../server/models/holderModel";
import SingleOffer from "../../../server/models/singleOfferModel";
import createCSVfile from "@/utils/createCSVfile";
import { sendEmail } from "@/utils/offersEmailConfig";

function generateOfferNum(length) {
    const max = Math.pow(10, length) - 1; // Generates a number like 999999 for length = 6
    const min = Math.pow(10, length - 1); // Generates a number like 100000 for length = 6
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}



async function correlateProductsToImpa(products, impa) {
    const ids = products.map((item) => item._id)
    try {
       
        let find = await ImpaCodes.updateOne(
            { code: impa },
            { $addToSet: { products: { $each: ids } } }

        )
        return {
            success: true,
            result: find
        };
    } catch (e) {
        return {
            success: false,
            error: 'failed to correlate products to impa'
        }
    }
}

export default async function handler(req, res) {
    const action = req.body.action



    if(action === 'startOffer') {
        const { selectedClient, user } = req.body;
        let TRDR = selectedClient.TRDR;
        let clientName = selectedClient.NAME;
        let clientEmail = selectedClient.EMAIL;
        let clientPhone = selectedClient.PHONE01;
        const num = generateOfferNum(6);    
        console.log(selectedClient)
        try {
            let create = await Holders.create({
                clientName: clientName,
                clientEmail: clientEmail,
                clientPhone: clientPhone,
                TRDR: TRDR,
                createdFrom:  user,
                status: 'created',
                num: num
            })
            console.log('created')
            console.log(create)
            return res.status(200).json({ success: true, result: create })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
  

    }

    if(action === "createImpaHolder") {
        const { products, impa, holderId } = req.body;
        try {
            console.log('products')
            console.log(products)
          
            const subString = impa?.greekDescription || impa?.englishDescriptio
            const fullName = impa?.code + ': ' + subString
            // let productsToImpa = await correlateProductsToImpa(products, impa);
            // if(!productsToImpa.success) {
            //     return res.status(500).json({ success: false, result: productsToImpa?.error })
            // }

            const checkimpa = await Holders.findOne({ _id: holderId, 'holders.impaCode': impa.code })
            if(checkimpa) {
                return res.status(200).json({ success: false, result: `Υπάρχει ήδη Holder για τον impa ${impa.code}` })
            }
            const update = await Holders.findOneAndUpdate(
                { _id: holderId },
                {
                    $push: {
                        holders: {
                            name: fullName,
                            isImpa: true,
                            impaCode: impa.code,
                            products: products
                        }
                    }
                },
                { new: true }
            );
            console.log(update)
            return res.status(200).json({ success: true, result: update })
        }catch(e) {
            return res.status(500).json({ success: false, result: null })
        }   
    }

    if(action === "createHolder") {
        const { products, name, holderId } = req.body;
        try {
            console.log('products')
            console.log(products)
            console.log('name ' +  name)
            const update = await Holders.findOneAndUpdate(
                { _id: holderId },
                {
                    $push: {
                        holders: {
                            name: name,
                            isImpa: false,
                            products: products
                        }
                    }
                },
                { new: true } // This option returns the modified document after the update
            );
            console.log(update)
            return res.status(200).json({ success: true })
        }catch(e) {
            return res.status(500).json({ success: false, result: null })
        }   
    }

    if(action === "addMoreToHolder") {
        const {  holderId, products} = req.body;
       
        const _products = [];
        const _existing = [];
        await connectMongo();
        try {
            let findImpaProducts = await Holders.findOne({ 'holders._id': holderId }, { 'holders.$': 1, _id: 0})
            let existingProducts = findImpaProducts.holders[0].products
            products.filter((product) => {
                let found = existingProducts.find((item) => item.MTRL === product.MTRL)
                if(!found) {
                    _products.push(product)
                } else {
                    _existing.push(product.NAME)
                }
            })
            console.log('_products')
            console.log(_products)
            let update = await Holders.findOneAndUpdate({
                'holders._id': holderId 
            }, {
                $push: {
                    'holders.$.products': { $each: _products }
                }
            })
            console.log('update')
            console.log(update)
            return res.status(200).json({ success: true, result: update, _existing: _existing })
        } catch (e) {

        }
        return res.status(200).json({ success: true, result: 'ok' })
    }


    if (action === "findImpaProducts") {
        let { code } = req.body
        try {
            await connectMongo();
            const impas = await ImpaCodes.find({ code: code })
            .populate('products', 'MTRL CODE COST PRICER _id NAME');
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
            const holder = await Holders.findOne({ _id: documentID, 'holders._id': holderID }, { "holders.$": 1 })
            console.log('find holder')
            console.log(holder)
            return res.status(200).json({ success: true, result: holder })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    // if (action === "findHolderProductsByDocumentID") {
    //     const { documentID } = req.body;
    //     console.log(documentID)
    //     try {
    //         await connectMongo();
    //         const holder = await Holders.find({ _id: documentID }, { holders: { products: 1 } })
    //         console.log(holder)
    //         return res.status(200).json({ success: true, result: holder })
    //     } catch (e) {
    //         return res.status(500).json({ success: false, result: null })
    //     }
    // }

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
        const { status, id, TRDR, data } = req.body;
        let saldoc;
      
        if(status === 'done') {
            const mtrlArr = data.flatMap(holder => {
                let arr = holder.products.map(product => {
                         const MTRL = parseInt(product.MTRL);
                         const QTY1 = parseInt(product.QTY1);
                         return { MTRL, QTY1 };
                   })
                   return arr
                })
              
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
                return responseJSON;
            }
        
            let softResponse = await getSaldoc();
            if(!softResponse.success) {
                saldoc = 'saldoc error'
            } else {
                saldoc = softResponse.SALDOCNUM
            }
        } 
       

            try {
                await connectMongo();
                let update = await Holders.updateOne({ _id: id }, {
                    $set: {
                        status: status,
                        SALDOCNUM: saldoc,
                    }
                })
                console.log(update)
                return res.status(200).json({ success: true, result: update })
            } catch (e) {
                return res.status(500).json({ success: false, result: null })
            }
       
    }


    if (action === "addOfferDatabase") {
        const { holders, client, email, id, num, createdFrom } = req.body;
        

        try {
            await connectMongo();
            let insert = await Holders.create({
                clientName: client.NAME,
                clientEmail: email,
                clientPhone: client.PHONE01 || '',
                TRDR: client.TRDR,
                holders: holders,
                createdFrom: createdFrom,
                status: 'created',
                num: num
            })
            console.log('insert')
            console.log(insert)
           
            await Clients.updateOne({ NAME: client.NAME }, {
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
        const { holders, products, cc, clientName, clientEmail, id, num, subject, message, fileName, includeFile, TRDR, mtrLines } = req.body;
        let newcc = []
        for (let item of cc) {
            newcc.push(item.email)
        }

        try {
            let csv = await createCSVfile(products)
            let send = await sendEmail(clientEmail, newcc, subject, message, fileName, csv, includeFile);
            await connectMongo();
            let update = await Holders.updateOne({ _id: id }, {
                $set: {
                    status: "sent"
                }
            })
           
            let modified = update.modifiedCount
            return res.status(200).json({ success: true, result: modified, send: send })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }


    }

    if (action === "addProductsToImpa") {
        const { products, impa } = req.body;
        console.log('PRODUCTS')

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
                holder = await Holders.find({}).sort({ createdAt: -1 })
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

    if(action === 'deleteOffer') {
        const { id } = req.body;
        try {
            await connectMongo();
            const deleted = await Holders.deleteOne({ _id: id });
            return res.status(200).json({ success: true, result: deleted })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
}



