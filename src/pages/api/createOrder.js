import Supplier from "../../../server/models/suppliersSchema";
import connectMongo from "../../../server/config";
import SoftoneProduct, { Product } from "../../../server/models/newProductModel";
import Markes from "../../../server/models/markesModel";
import nodemailer from 'nodemailer';
import { transporter } from "@/utils/nodemailerConfig";
import SupplierOrders from "../../../server/models/supplierOrders";
import PendingOrders from "../../../server/models/pendingOrders";
import CompletedOrders from "../../../server/models/completedOrdes";
import createCSVfile from "@/utils/createCSVfile";
import { sendEmail } from "@/utils/offersEmailConfig";

export default async function handler(req, res) {

    const action = req.body.action;
    if (action === 'findOrders') {
        const { skip, limit } = req.body;
        try {
            await connectMongo();
            let totalRecords = await SupplierOrders.countDocuments({});
            let orders = await SupplierOrders.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit)
            return res.status(200).json({ success: true, result: orders, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if (action === "updateStatus") {
        const { status, id } = req.body;
        try {
            await connectMongo();
            let update = await CompletedOrders.updateOne({ _id: id }, {
                $set: {
                    status: status
                }
            })
            return res.status(200).json({ success: true, result: update })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }


    if (action === 'fetchSuppliers') {
        const { skip, limit } = req.body
        try {
            await connectMongo();
            let totalRecords = await Supplier.countDocuments({});
            let suppliers = await Supplier.find({}).skip(skip).limit(limit)

            return res.status(200).json({ success: true, result: suppliers, totalRecords: totalRecords });
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if (action === "searchSupplier") {
        let { skip, limit, searchTerm } = req.body;
        let regexSearchTerm = new RegExp("^" + searchTerm, 'i');
        const totalRecords = await Supplier.countDocuments({ NAME: regexSearchTerm })
        let suppliers = await Supplier.find({ NAME: regexSearchTerm }).skip(skip).limit(limit).select({ NAME: 1, EMAIL: 1, TRDR: 1, _id: 1 })
        return res.status(200).json({ success: true, result: suppliers, totalRecords: totalRecords })
    }

    if (action === "saveNewEmail") {
        let { email, id } = req.body;

        await connectMongo();
        try {
            console.log(email, id)
            let update = await Supplier.updateOne({ _id: id }, {
                $set: {
                    EMAIL: email
                }
            })
            return res.status(200).json({ success: true, result: update })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    //FUNCTIONS:
    function calculateCompletion(products) {
        let total = 0;
        for (let item of products) {
            total += item.TOTAL_COST
        }
        return parseFloat(total);
    }

  

    if (action === "createBucket") {
        const { products, email, TRDR, NAME, minOrderValue} = req.body;
        console.log(TRDR)
        //First time we create the order to the suppliers. 
        //So we create an id based on the last completed order and increment it by 10
        //Min order value is a fixed mumber that we get from the suppliers
        //First time we create the order the order completion value is 0 and we just add the sum, the rest of the proccess will happen when we add more products to the order
      
        try {
            await connectMongo();
            const generateNextCode = async () => {
                const lastDoc = await CompletedOrders.find().sort({ orderNumber: -1 }).limit(1).exec();
                const lastCode = (lastDoc.length > 0) ? lastDoc[0].orderNumber : 100000; // Start from 100000 if no document is present
                return lastCode + 10;
            };
        
            //CHECK IF THERE IS ALREADY AN ORDER WITH THIS TRDR
            let find = await PendingOrders.findOne({ TRDR: TRDR });
            console.log('find')
            console.log(find)
            if(find) {
                return res.status(200).json({success: false, result: "Υπάρχει ήδη ενεργή παραγγελία στον προμηθευτή"})
            }
            console.log('next')
            let completion = calculateCompletion(products);
            let obj = {
                orderNumber: await generateNextCode(),
                supplierName: NAME,
                supplierEmail: email || '',
                status: "pending",
                products: products,
                TRDR: TRDR,
                minOrderValue: minOrderValue,
                orderCompletionValue: completion,
            }
            console.log(obj)
          
            let insert = await PendingOrders.create(obj)
            console.log('insert')
            console.log(insert)
            // let update = await Supplier.updateOne({ TRDR: TRDR }, {
            //     $set: {
            //         minOrderValue: minOrderValue,
            //         orderCompletionValue: completion,
            //     }
            // })
          
            return res.status(200).json({ success: true, result: insert})
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }

      
    }
    


    if (action === 'updateBucket') {
        const { products, TRDR } = req.body;
       
        try {
            await connectMongo();
            let find = await PendingOrders.findOne({ TRDR: TRDR})
            //find products in the database with this TRDR
            let dbproducts = find?.products;
            let newordercompletion =  find.orderCompletionValue + calculateCompletion(products);
            //loop through the products that are sent from the client
            // find those that already exist in the holder and update the quanityt and prices
            // push those that do not exist
            for (let item of products) {
                let itemDB = dbproducts.find(dbItem => dbItem.MTRL === item.MTRL);
                if (itemDB) {
                    await updateDB(item, itemDB);
                } else {
                    await pushToDB(item);
                }
            }

            await PendingOrders.updateOne(
                {TRDR: TRDR}, 
                {
                $set: {
                     orderCompletionValue: newordercompletion
                }
            })
            await Supplier.updateOne({ TRDR: TRDR }, {
                $set: {
                    orderCompletionValue: newordercompletion
                }
            })

            async function updateDB(item, itemDB) {
                let newQuantity = item.QTY1 + itemDB.QTY1;
                let newTotal = parseFloat(item.TOTAL_COST) + parseFloat(itemDB.TOTAL_COST);
                await PendingOrders.updateOne(
                    {
                        TRDR: TRDR,
                        'products.MTRL': item.MTRL
                    }, {
                    $set: {
                        'products.$.QTY1': newQuantity,
                        'products.$.TOTAL_COST': newTotal,
                    }
                })
            }
            async function pushToDB(item) {
                await PendingOrders.updateOne(
                    { TRDR: TRDR },
                    {
                        $push: {
                            products: item
                        }
                    })
               
            }

            return res.status(200).json({ success: true })

        } catch (e) {
            return res.status(500).json({ success: false })
        }





    }
   


    if (action === 'findPending') {
        const { TRDR } = req.body;
        try {
            await connectMongo();
            const order = await PendingOrders.find({TRDR: TRDR})
            console.log(order)
            return res.status(200).json({ success: true, result: order})
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
    if (action === "findOnePending") {
        const { mtrmark } = req.body;
        try {
            await connectMongo();
            const orders = await PendingOrders.countDocuments({ MTRMARK: mtrmark });
            console.log(orders)
            return res.status(200).json({ success: true, result: orders })

        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }

    }

    if(action === "findCompleted") {
        const { mtrmark } = req.body;
        try {
            await connectMongo();
            let complete = await CompletedOrders.find({MTRMARK: mtrmark}).sort({ createdAt: -1 })
            console.log(complete)
            return res.status(200).json({ success: true, result: complete })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }


    if (action === "submitOrder") {
        const { TRDR, products, cc,  subject, message, fileName, includeFile, name, email, createdAt } = req.body;
        let newcc = []
        for (let item of cc) {
            newcc.push(item.email)
        }
        try {
            let find = await PendingOrders.findOne({ TRDR:TRDR });
            
            const products = find.products;
          
            const orderNumber = find?.orderNumber;
          
            const mtrlArr = products.map(item => {
                const MTRL = parseInt(item.MTRL);
                const QTY1 = parseInt(item.QTY1);
                return { MTRL, QTY1 };
            });
            console.log(mtrlArr)

            const PURDOC = await getPurdoc(mtrlArr, TRDR)
            if(!PURDOC) {
                return res.status(200).json({ success: false, result: null, message: 'ORDER NOT CREATED' })
            }
            console.log(PURDOC)

            const generateNextCode = async () => {
                const lastDoc = await CompletedOrders.find().sort({ orderNumber: -1 }).limit(1).exec();
                const lastCode = (lastDoc.length > 0) ? lastDoc[0].orderNumber : 100000; // Start from 100000 if no document is present
                return lastCode + 10;

            };
            


            let nextCode = await generateNextCode()
            console.log(nextCode)
            let obj = {
                supplierName: find?.supplierName,
                supplierEmail: email,
                status: "pending",
                products: products,
                TRDR: TRDR,
                PURDOCNUM: PURDOC,
                orderNumber: nextCode,
               
            }
            console.log(obj)
            // let create = await CompletedOrders.create(obj);
            // console.log('create')
            // console.log(create)
            
            const _products = products.map((item, index) => {
                return {
                    PRODUCT_NAME: item.NAME,
                    COST: item.COST,
                    QTY1: item.QTY1,
                    TOTAL_COST: item.TOTAL_COST
                }
            })
        console.log(_products)
            let csv = await createCSVfile(_products)
            console.log(csv)
            let send = await sendEmail(email, newcc, subject, message, fileName, csv, includeFile);
            console.log(send)
            // if(PURDOC) {
            //    let deletePending = await PendingOrders.deleteOne({ MTRMARK: mtrmark });
            //    console.log(deletePending)

            // }
            // return res.status(200).json({ success: true, result: create })

        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }

    }


}



const getPurdoc = async (data, TRDR) => {
    let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getPurDoc`;
    const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
            username: "Service",
            password: "Service",
            COMPANY: "1001",
            SERIES: 2021,
            TRDR: TRDR,
            MTRLINES: data
        })
    });
    let resJson = await response.json();
    return resJson.PURDOCNUM;
}


