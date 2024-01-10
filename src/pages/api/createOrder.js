import Supplier from "../../../server/models/suppliersSchema";
import connectMongo from "../../../server/config";
import SupplierOrders from "../../../server/models/supplierOrders";
import PendingOrders from "../../../server/models/pendingOrders";
import CompletedOrders from "../../../server/models/completedOrdes";
import createCSVfile from "@/utils/createCSVfile";
import { sendEmail } from "@/utils/offersEmailConfig";

export function calculateCompletion(products) {
    let total = 0;
    for (let item of products) {
        total += item.COST * item.QTY1;
    }
    console.log('total')
    console.log(total)
    return parseFloat(total.toFixed(2));
}


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
   



    if (action === "createBucket") {
        const { products, email, TRDR, NAME, minOrderValue } = req.body;
        
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
            if (find) {
                return res.status(200).json({ success: false, result: "Υπάρχει ήδη ενεργή παραγγελία στον προμηθευτή" })
            }
            let completion = calculateCompletion(products);
            console.log('completion')
            console.log(completion)
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
            console.log('obj')
            console.log(obj)

            let insert = await PendingOrders.create(obj)
            console.log('insert')
            console.log(insert)
            let suppliersupdate = await Supplier.updateOne({ TRDR: TRDR }, {
                $set: {
                    ORDERSTATUS: true,
                }
            })

            return res.status(200).json({ success: true })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }


    }



    if (action === 'updateBucket') {
        const { products, TRDR } = req.body;
       
        try {
            await connectMongo();
            let find = await PendingOrders.findOne({ TRDR: TRDR })
            //find products in the database with this TRDR
            let dbproducts = find?.products;
            let newordercompletion = parseFloat(find.orderCompletionValue) + calculateCompletion(products);
         
          
          
            let _products = [];
            for (let item of products) {
                let itemDB = dbproducts.find(dbItem => dbItem.MTRL === item.MTRL);
                if(!itemDB) {
                    _products.push(item)
                }
            }

           
            let update = await PendingOrders.updateOne({ TRDR: TRDR }, {
                $set: {
                    orderCompletionValue: newordercompletion
                 },
                $push: {
                    products: _products
                },
                
            })
          
         
            await Supplier.updateOne({ TRDR: TRDR }, {
                $set: {
                    orderCompletionValue: newordercompletion
                }
            })
            return res.status(200).json({ success: true })

        } catch (e) {
            return res.status(500).json({ success: false })
        }





    }



    if (action === 'findPending') {
        const { TRDR } = req.body;
        try {
            await connectMongo();
            const order = await PendingOrders.find({ TRDR: TRDR })
            console.log(order)
            return res.status(200).json({ success: true, result: order })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }


    if (action === "findCompleted") {
        const { TRDR } = req.body;
        try {
            await connectMongo();
            let complete = await CompletedOrders.find({ TRDR: TRDR }).sort({ createdAt: -1 })
            return res.status(200).json({ success: true, result: complete })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if(action === "issuePurdoc") {
        const {id, TRDR} = req.body;
        try {
            await connectMongo();
            let find = await PendingOrders.findOne({ TRDR: TRDR });
            const products = find.products;
            const mtrlArr = products.map(item => {
                const MTRL = parseInt(item.MTRL);
                const QTY1 = parseInt(item.QTY1);
                return { MTRL, QTY1 };
            });

            const PURDOC = await getPurdoc(mtrlArr, TRDR)
            console.log('PURDOC')
            console.log(PURDOC)
            if (!PURDOC) {
                throw new Error('purdcocum not created')
            }

            let obj = {
                supplierName: find?.supplierName,
                supplierEmail: find?.supplierEmail,
                status: "issued",
                products: products,
                TRDR: TRDR,
                PURDOCNUM: PURDOC,
            }
          
            let create = await CompletedOrders.create(obj);
            if(!create) {
                throw new Error('order not transfered to completed')
                // return res.status(500).json({ success: false, result: null, message: 'order not transfered to completed' })
            }
            await PendingOrders.deleteOne({ TRDR: TRDR });
            await Supplier.updateOne({ TRDR: TRDR }, {
                $set: {
                    ORDERSTATUS: false,
                }
            })
            return res.status(200).json({success: true,result: create, message: null})
        } catch (e) {
            return res.status(500).json({success: false})
        }
    }
    if (action === "sentEmail") {
        const { TRDR, cc, subject, message, fileName, includeFile,  email } = req.body;
        
        
        let newcc = []
        for (let item of cc) {
            newcc.push(item.email)
        }
        try {
            let find = await CompletedOrders.findOne({ TRDR: TRDR });
            const products = find.products;
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
            let send = await sendEmail(email, newcc, subject, message, fileName, csv, includeFile);
            let update = await CompletedOrders.findOneAndUpdate({ TRDR: TRDR }, {
                $set: {
                    status: "sent"
                }
            }, { new: true
            })
            console.log('update')
            console.log(update)
            return res.status(200).json({ success: true,  send: send })

        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }

    }
    if (action === "deleteCompletedOrder") {
        const {id} = req.body;
        try {
            await connectMongo();
            let deleted = await CompletedOrders.deleteOne({_id: id})
            return res.status(200).json({success: true, result: deleted})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

    if(action === "updateQuantity") {
        const {id, QTY1, MTRL, TRDR} = req.body;
        
        
        try {
            await connectMongo();
            let find = await PendingOrders.findOne({_id: id});
            let products = find.products;


            let product = products.find(item => item.MTRL === MTRL);
            let newTotal = parseFloat(product.COST) * QTY1;
            let new_order_total = find.orderCompletionValue +  product.COST;
            let update = await PendingOrders.findOneAndUpdate({_id: id, 'products.MTRL': MTRL}, {
                $set: {
                    'orderCompletionValue': parseInt(new_order_total.toFixed(2)),
                    'products.$.QTY1': QTY1,
                    'products.$.TOTAL_COST': parseInt(newTotal.toFixed(2))
                }
            }, {new: true})
            
            await Supplier.updateOne({ TRDR: TRDR }, {
                $set: {
                    orderCompletionValue: new_order_total.toFixed(2)
                }
            })
            return res.status(200).json({success: true})

        } catch (e) {
            return res.status(500).json({success: false})
        }

    }

}





export const getPurdoc = async (data, TRDR) => {
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


