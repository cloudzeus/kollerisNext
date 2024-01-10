
import { toNamespacedPath } from "path";
import connectMongo from "../../../server/config";
import SmallOrders from "../../../server/models/smallOrdersModel";
import { calculateCompletion } from "./createOrder";

export default async function handler(req, res) {
     const {action} = req.body;

     if(action === "createOrder") {
        const {mtrLines, supplier, createdFrom} = req.body;
        const TRDR = supplier?.TRDR;
        const NAME = supplier.NAME;
        const supplierEmail = supplier.EMAIL;
        const supplierName = supplier.NAME;

       

        //CALCULATE THE TOTAL COST OF THE PRODUCTS:
        let total_cost = calculateCompletion(mtrLines);
     
        try {
            await connectMongo();
            let create = await SmallOrders.create({
                total_cost: total_cost,
                supplierName: supplierName,
                TRDR: TRDR,
                supplierEmail: supplierEmail || "",
                status: "pending",
                PURDOCNUM: "",
                updatedFrom: createdFrom,
                products: mtrLines
            })
          
            return res.status(200).json({success: true, result: create});
            
        } catch (e) {   
            return res.status(400).json({success: false, result: null});
        }
     }

     if(action === "getOrders") {
        try {
            await connectMongo();
            let orders = await SmallOrders.find({}).sort({createdAt: -1});
            return res.status(200).json({success: true, result: orders});
        } catch (e) {
            return res.status(400).json({success: false, result: null});
        }
     }

     if(action === "getProducts") {
        const {id} = req.body;
        try {
            await connectMongo();
            let orders = await SmallOrders.findOne({_id: id }, {
                products: 1,
                total_cost: 1,
                _id: 0
            });
          
            return res.status(200).json({success: true, result: orders});
        } catch (e) {
            return res.status(400).json({success: false, result: null});
        }
     }

     if (action === 'addMore') {
        const { mtrLines, id } = req.body;
       
        try {
            await connectMongo();
            let find = await SmallOrders.findOne({ _id: id })
            //find products in the database with this TRDR
            let dbproducts = find?.products;
            let newtotal =find.total_cost + calculateCompletion(mtrLines);
            newtotal = parseFloat(newtotal.toFixed(2));
         
          
            let _products = [];
            for (let item of mtrLines) {
                let itemDB = dbproducts.find(dbItem => dbItem.MTRL === item.MTRL);
                if(!itemDB) {
                    _products.push(item)
                }
            }

           
            let update = await SmallOrders.updateOne({_id: id }, {
                $set: {
                    total_cost: newtotal
                 },
                $push: {
                    products: _products
                },
                
            })
           
            return res.status(200).json({ success: true })

        } catch (e) {
            return res.status(500).json({ success: false })
        }





    }

    if(action === "updateQuantity") {
        const {id, QTY1, MTRL } = req.body;
        
        try {
            await connectMongo();
            let find = await SmallOrders.findOne({_id: id, 'products.MTRL': MTRL});

            //find all products
            let products = find.products;
            //find the products that the quantity doesnt change
            let rest_products = products.filter(item => item.MTRL !== MTRL);
            //The item that we change the QUANTITY
            let product = products.find(item => item.MTRL === MTRL);

            //ESTIMATE THE NEW TOTAL:
            let total = 0;
            for(let item of rest_products) {
                total += item.TOTAL_COST;
            }
            let itemTotal = QTY1 * product.COST;
            itemTotal = parseFloat(itemTotal.toFixed(2));
            total += itemTotal;
            total = parseFloat(total.toFixed(2));

            //UPDATE THE ORDER
            let update = await SmallOrders.findOneAndUpdate({_id: id, 'products.MTRL': MTRL}, {
                $set: {
                    'total_cost': total,
                    'products.$.QTY1': QTY1,
                    'products.$.TOTAL_COST': itemTotal
                }
            }, {new: true})

            console.log(update);
            return res.status(200).json({success: true})
        } catch (e) {
            return res.status(500).json({success: false})
        }

    }
}