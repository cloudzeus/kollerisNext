import Supplier from "../../../server/models/suppliersSchema";
import connectMongo from "../../../server/config";
import SoftoneProduct, { Product } from "../../../server/models/newProductModel";
import Markes from "../../../server/models/markesModel";
import nodemailer from 'nodemailer';
import { transporter } from "@/utils/nodemailerConfig";
import SupplierOrders from "../../../server/models/supplierOrders";
import PendingOrders from "../../../server/models/pendingOrders";
import CompletedOrders from "../../../server/models/completedOrdes";


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

    if (action === "fetchProducts") {
        const { skip, limit, searchTerm, mtrmark } = req.body;
        console.log('FETCH PRODUCTS')
        try {
            await connectMongo();
            let regexSearchTerm = new RegExp("^" + searchTerm, 'i');
            let totalRecords;
            let pipeline = [
                {
                    $match: {
                        MTRMARK: parseInt(mtrmark) // Filtering documents by MTRMARK
                    }
                },
                {
                    $lookup: {
                        from: "markes",
                        localField: "MTRMARK",
                        foreignField: "softOne.MTRMARK",
                        as: "matched_mark"  // Output alias for matched documents from MARKES
                    }
                },
                {
                    $unwind: "$matched_mark"
                },
                {
                    $project: {
                        _id: 0,
                        NAME: 1,
                        PRICER: 1,
                        MTRL: 1,
                        CATEGORY_NAME: 1,
                        GROUP_NAME: 1,
                        SUBGROUP_NAME: 1,
                        "brandName": "$matched_mark.softOne.NAME",
                        "mtrmark": "$matched_mark.softOne.MTRMARK",
                        "minValue": "$matched_mark.minValueOrder",
                        "minItems": "$matched_mark.minItemsOrder",
                    }
                },
                {
                    $skip: skip  // Skip the first 10 documents
                },
                {
                    $limit: limit // Limit the result to 10 documents
                }
            ]


            if (searchTerm) {
                totalRecords = await SoftoneProduct.countDocuments({ NAME: regexSearchTerm });
                pipeline.unshift({
                    $match: { NAME: regexSearchTerm }
                });
            } else {
                totalRecords = await SoftoneProduct.countDocuments({});
            }

            let products = await SoftoneProduct.aggregate(pipeline)
            return res.status(200).json({ success: true, result: products, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if (action === 'fetchMarkes') {
        console.log('fetch markes')
        try {
            await connectMongo();
            let markes = await Markes.find({}).select({ "softOne.NAME": 1, "softOne.MTRMARK": 1, _id: 0 })
            return res.status(200).json({ success: true, result: markes })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

   

    if (action === "createBucket") {

        const { products, email, supplierName, TRDR, NAME, MTRMARK, minItems, minValue } = req.body;

        try {
            await connectMongo();
            const generateNextCode = async () => {
                const lastDoc = await CompletedOrders.find().sort({ orderNumber: -1 }).limit(1).exec();
                const lastCode = (lastDoc.length > 0) ? lastDoc[0].orderNumber : 100000; // Start from 100000 if no document is present
                return lastCode + 10;

            };
            let orderNumber = await generateNextCode();
            let obj = {
                supplierName: supplierName,
                supplierEmail: email,
                status: "pending",
                products: products,
                TRDR: TRDR,
                NAME: NAME,
                MTRMARK: MTRMARK,
                minItems: minItems,
                minValue: minValue,
                orderNumber: orderNumber,
            }
            let insert = await PendingOrders.create(obj)

            return res.status(200).json({ success: true, result: insert })

        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }

    }

    if (action === 'updateBucket') {
        const { products, MTRMARK } = req.body;

        try {
            await connectMongo();
            let find = await PendingOrders.findOne({ MTRMARK: MTRMARK })
            //find products in the database with this MTRMARK
            let dbproducts = find?.products;
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

            async function updateDB(item, itemDB) {
                let newQuantity = item.QTY1 + itemDB.QTY1;
                let newTotal = parseFloat(item.TOTAL_PRICE) + parseFloat(itemDB.TOTAL_PRICE);
                await PendingOrders.updateOne(
                    {
                        MTRMARK: MTRMARK,
                        'products.MTRL': item.MTRL
                    }, {
                    $set: {
                        'products.$.QTY1': newQuantity,
                        'products.$.TOTAL_PRICE': newTotal,
                    }
                })
            }
            async function pushToDB(item) {
                await PendingOrders.updateOne(
                    { MTRMARK: MTRMARK },
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
        const { mtrmark } = req.body;
        console.log(mtrmark)
        try {
            await connectMongo();
            const orders = await PendingOrders.find({MTRMARK: mtrmark}).sort({ createdAt: -1 })
            const minvalues = await Markes.findOne({ "softOne.MTRMARK": mtrmark }).select({ minValueOrder: 1, minItemsOrder: 1, _id: 0 })
            let minValue = minvalues.minValueOrder;
            let minItem = minvalues.minItemsOrder;
            return res.status(200).json({ success: true, result: orders, minValue: minValue, minItem: minItem })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
    if (action === "findOnePending") {
        const { mtrmark } = req.body;
        console.log(mtrmark)
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
        console.log(mtrmark)
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
        const { mtrmark } = req.body;
        try {
            let find = await PendingOrders.findOne({ MTRMARK: mtrmark });
            // const _id = find?._id
            const products = find?.products;
            const email = find?.supplierEmail;
            const orderNumber = find?.orderNumber;
            const TRDR = find?.TRDR;
            console.log(TRDR)
            const mtrlArr = products.map(item => {
                const MTRL = parseInt(item.MTRL);
                const QTY1 = parseInt(item.QTY1);
                return { MTRL, QTY1 };
            });
            console.log( mtrlArr)
            const PURDOC = await getPurdoc(mtrlArr, TRDR)
            console.log(PURDOC)
            if(!PURDOC) {
                return res.status(200).json({ success: false, result: null, message: 'ORDER NOT CREATED' })
            }
            let obj = {
                supplierName: find?.NAME,
                supplierEmail: email,
                status: "pending",
                products: products,
                TRDR: TRDR,
                PURDOCNUM: PURDOC,
                orderNumber: orderNumber,
                MTRMARK: parseInt(mtrmark),
            }
            let create = await CompletedOrders.create(obj);

            const template = await emailTemplate(products, orderNumber, email);
            console.log(template)
            if(PURDOC) {
               let deletePending = await PendingOrders.deleteOne({ MTRMARK: mtrmark });
               console.log(deletePending)

            }
            return res.status(200).json({ success: true, result: create, emailSent: template })
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


const emailTemplate = async (products, orderNumber, email) => {
    let body = products.map((product) => {
        return `<p>--- <strong>Προϊόν</strong>--- </p><p>Όνομα: ${product.NAME}</p>
        <p>Ποσότητα: <strong>${product.QTY1}</strong></p>
        <p>Τιμή: <strong>${product.PRICE}€</strong></p>
        <p>Σύνολο Τιμής: <strong>${product.TOTAL_PRICE}€</strong></p>
        <p>---------------</p>`;
    }).join('');
    let emailSent;
    const mail = {
        from: 'info@kolleris.com',
        to: email,
        cc: ['gkozyris@i4ria.com', 'johnchiout.dev@gmail.com', 'info@kolleris.com'],
        subject: ` Παραγγελία NUM: ${orderNumber}`,
        html: body
    };

    transporter.sendMail(mail, (err, info) => {
        if (err) {
            console.log(err);
            emailSent = false

        } else {
            console.log('Email sent successfully!');
            emailSent = true
        }
    });
    return emailSent;
}