import Supplier from "../../../server/models/suppliersSchema";
import connectMongo from "../../../server/config";
import SoftoneProduct, { Product } from "../../../server/models/newProductModel";
import Markes from "../../../server/models/markesModel";
export default async function handler(req, res) {

    const action = req.body.action;
    if(action === 'fetchSuppliers') {
        const {skip, limit} = req.body
        try {
            await connectMongo();
            let suppliers = await Supplier.find({}).skip(skip).limit(limit)
            return res.status(200).json({ success: true, result: suppliers });
        } catch (e) {

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
        const {skip, limit} = req.body;
        // let regexSearchTerm = new RegExp("^" + searchTerm, 'i');
        console.log(skip, limit)

        try {
            await connectMongo();
            // if(regexSearchTerm !== '') {
            //     const totalRecords = await Product.countDocuments({NAME: regexSearchTerm})
            //     let product = await Product.find({NAME: regexSearchTerm}).skip(skip).limit(limit);
            //     return res.status(200).json({ success: true, result:product, totalRecords: totalRecords })
            // }
            // const totalRecords = await SoftoneProduct.countDocuments({});
            // console.log(totalRecords)
            // let product = await SoftoneProduct.find({}).skip(skip).limit(limit);
            // return res.status(200).json({ success: true, result: product, totalRecords: totalRecords })\
            await connectMongo();
            let totalRecords = await SoftoneProduct.countDocuments({});
            let products = await SoftoneProduct.aggregate([
                {
                    $lookup: {
                        from: "markes",  // Join with the MARKES collection
                        localField: "MTRMARK",  // Join using the MTRMARK field from SoftoneProduct
                        foreignField: "softOne.MTRMARK",  // Join using softOne.MTRMARK from MARKES
                        as: "matched_mark"  // Output alias for matched documents from MARKES
                    }
                },
                {
                    $unwind: "$matched_mark"  // Flatten the matched_mark array
                },
                {
                    $project: {
                        _id: 0,  // Exclude the _id field from the output
                        NAME: 1,  // Include NAME from SoftoneProduct
                        "brandName": "$matched_mark.softOne.NAME",  // Include softOne.NAME from MARKES
                        "mtrmark": "$matched_mark.softOne.MTRMARK"  // Include softOne.NAME from MARKES
                    }
                },
                {
                    $skip: skip  // Skip the first 10 documents
                },
                {
                    $limit: limit // Limit the result to 10 documents
                }
            ])
            console.log(products)
            return res.status(200).json({ success: true, result: products, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if(action === 'fetchMarkes') {
        try {
            await connectMongo();
            let markes = await Markes.find({}).select({"softOne.NAME": 1, "softOne.MTRMARK": 1, _id: 0})
            return res.status(200).json({ success: true, result: markes })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if(action == "searchBrand") {
        const {skip, limit, mtrmark} = req.body;
        console.log('mtrmark')
        try {
            await connectMongo();
            let products = SoftoneProduct.aggregate([
                {
                    $match: {
                        MTRMARK: mtrmark  // Filtering documents by MTRMARK
                    }
                },
                {
                    $lookup: {
                        from: "MARKES",
                        localField: "MTRMARK",
                        foreignField: "softOne.MTRMARK",
                        as: "matched_mark"
                    }
                },
                {
                    $unwind: "$matched_mark"
                },
                {
                    $project: {
                        _id: 0,
                        NAME: 1,
                        brandName: "$matched_mark.softOne.NAME"
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit:limit
                }
            ])
            console.log('sefsefef')
            console.log(products)
            return res.status(200).json({ success: true, result: products })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

}
