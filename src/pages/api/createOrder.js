import Supplier from "../../../server/models/suppliersSchema";
import connectMongo from "../../../server/config";
import SoftoneProduct, { Product } from "../../../server/models/newProductModel";
import Markes from "../../../server/models/markesModel";
import nodemailer from 'nodemailer';
import { transporter } from "@/utils/nodemailerConfig";
import SupplierOrders from "../../../server/models/supplierOrders";
import PendingOrders from "../../../server/models/pendingOrders";


export default async function handler(req, res) {

    const action = req.body.action;
    if(action === 'findOrders') {
        const {skip, limit} = req.body;
        try {
            await connectMongo();
            let totalRecords = await SupplierOrders.countDocuments({});
            let orders = await SupplierOrders.find({}).sort({createdAt: -1}).skip(skip).limit(limit)
            return res.status(200).json({ success: true, result: orders, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if(action === "updateStatus") {
        const {status, id} = req.body;
        try {
            await connectMongo();
            let update = await SupplierOrders.updateOne({_id: id}, {
                $set: {
                    status: status
                }
            })
            return res.status(200).json({ success: true, result: update })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }


    if(action === 'fetchSuppliers') {
        const {skip, limit} = req.body
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
        const totalRecords = await Supplier.countDocuments({NAME: regexSearchTerm})
        let suppliers = await Supplier.find({NAME: regexSearchTerm}).skip(skip).limit(limit).select({NAME: 1, EMAIL: 1, _id: 1})
        return res.status(200).json({ success: true, result: suppliers, totalRecords: totalRecords })
    }

    if(action === "saveNewEmail") {
        let {email, id} = req.body;

        await connectMongo();
        try {
            console.log(email ,id)
            let update = await Supplier.updateOne({_id: id}, {
                $set: {
                    EMAIL: email
                }
            })
            return res.status(200).json({ success: true, result: update })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if(action === "fetchProducts") {
        const {skip, limit, searchTerm} = req.body;
        console.log('FETCH PRODUCTS')
        try {
            await connectMongo();
            let regexSearchTerm = new RegExp("^" + searchTerm, 'i');
            console.log(regexSearchTerm)
            let totalRecords;
            let pipeline = [
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
           

            if (searchTerm ) {
                totalRecords = await SoftoneProduct.countDocuments({NAME: regexSearchTerm});
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

    if(action === 'fetchMarkes') {
        console.log('fetch markes')
        try {
            await connectMongo();
            let markes = await Markes.find({}).select({"softOne.NAME": 1, "softOne.MTRMARK": 1, _id: 0})
            return res.status(200).json({ success: true, result: markes })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if(action == "searchBrand") {

        const {skip, limit, mtrmark, searchTerm} = req.body;
        try {
            await connectMongo();
            let regexSearchTerm = new RegExp("^" + searchTerm, 'i');

            let pipeline = [
                {
                    $match: {
                        MTRMARK: parseInt(mtrmark) // Filtering documents by MTRMARK
                    }
                },
                {
                    $lookup: {
                        from: "markes",  // Join with the MARKES collection
                        localField: "MTRMARK",  // Join using the MTRMARK field from SoftoneProduct
                        foreignField: "softOne.MTRMARK",  // Join using softOne.MTRMARK from MARKES
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
                        brandName: "$matched_mark.softOne.NAME",
                        "minValue": "$matched_mark.minValueOrder",
                        "minItems": "$matched_mark.minItemsOrder",
                        
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit:limit
                }
            ]

            if (searchTerm ) {
                pipeline.unshift({
                    $match: { NAME: regexSearchTerm }
                });
            }

            let totalRecords = await SoftoneProduct.countDocuments({MTRMARK: parseInt(mtrmark)})
            let products = await SoftoneProduct.aggregate(pipeline)
            return res.status(200).json({ success: true, result: products, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }


    if(action === "createBucket") {

        const {products, email, supplierName, TRDR, NAME, MTRMARK, minItems, minValue} = req.body;

        try {
            await connectMongo();
            const generateNextCode = async () => {
                const lastDoc = await PendingOrders.find().sort({orderNumber: -1}).limit(1).exec();
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

    if(action === "sendOrder") {
        const {products, email, supplierName, TRDR, NAME} = req.body;

        let body = products.map((product) => {
            return `<p>--- <strong>Προϊόν</strong>--- </p><p>Όνομα: ${product.NAME}</p>
            <p>Ποσότητα: <strong>${product.QTY1}</strong></p>
            <p>Τιμή: <strong>${product.PRICE}€</strong></p>
            <p>Σύνολο Τιμής: <strong>${product.TOTAL_PRICE}€</strong></p>
            <p>---------------</p>`;
        }).join(''); 

        try {

      
            const mtrlArr = products.map(item => {
                const MTRL = parseInt(item.MTRL);
                const QTY1 = parseInt(item.QTY1);
                return { MTRL, QTY1 };
            });

            const PURDOC = await getPurdoc(mtrlArr, TRDR)
        
            await connectMongo();
            const generateNextCode = async () => {
                const lastDoc = await SupplierOrders.find().sort({orderNumber: -1}).limit(1).exec();
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
                PURDOCNUM: PURDOC,
                orderNumber: orderNumber,
            }
            let insert = await SupplierOrders.create(obj)
            const mail = {
                from: 'info@kolleris.com',
                to: email,
                cc: [ 'gkozyris@i4ria.com', 'johnchiout.dev@gmail.com', 'info@kolleris.com'],
                subject: ` Παραγγελία NUM: ${orderNumber}`,
                html: body
              };
              
              transporter.sendMail(mail, (err, info) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Email sent successfully!');
                }
              });
            return res.status(200).json({ success: true, result: insert })

        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
        
    }

    if(action === 'findPending') {
        const {mtrmark} = req.body;
        console.log(mtrmark)
        try {
            await connectMongo();
            const orders = await PendingOrders.find({}).sort({createdAt: -1})
            const minvalues = await Markes.findOne({"softOne.MTRMARK": parseInt(mtrmark)}).select({minValueOrder: 1, minItemsOrder: 1, _id: 0})
            let minValue = minvalues.minValueOrder;
            let minItems = minvalues.minItemsOrder;
            console.log(result)
            return res.status(200).json({ success: true, result: orders, minValues: minValue, minItems: minItems })
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
