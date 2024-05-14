import Supplier from "../../../../server/models/suppliersSchema";
import connectMongo from "../../../../server/config";
import translateData from "@/utils/translateDataIconv";

export default async function handler(req, res) {

    const action = req.body.action;

    if (action === "fetchAll") {
        const { skip, limit, searchTerm, sortOffers } = req.body;
        try {
            await connectMongo();

            const filterConditions = {};
            if (searchTerm.afm) filterConditions.AFM = new RegExp(searchTerm.afm, 'i');
            if (searchTerm.name) filterConditions.NAME = new RegExp(searchTerm.name, 'i');
            if (searchTerm.phone01) filterConditions.PHONE01 = new RegExp(searchTerm.phone01, 'i');
            if (searchTerm.phone02) filterConditions.PHONE02 = new RegExp(searchTerm.phone02, 'i');
            if (searchTerm.email) filterConditions.EMAIL = new RegExp(searchTerm.email, 'i');
            if (searchTerm.address) filterConditions.ADDRESS = new RegExp(searchTerm.address, 'i');

            let query = Supplier.find(filterConditions);

            if (sortOffers === 1) {
                query = query.sort({ ORDERSTATUS: 1 });
            } else if (sortOffers === -1) {
                query = query.sort({ ORDERSTATUS: -1 });
            }
            let condition = Object.keys(filterConditions).length === 0;
            const totalRecords = await (condition
                ? Supplier.countDocuments()
                : Supplier.countDocuments(filterConditions));

            const suppliers = await query.skip(skip).limit(limit);

            return res.status(200).json({ success: true, result: suppliers, totalRecords: totalRecords })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if (action === "updateOne") {
        let response = {
            result: null,
            success: false,
            error: null,
            message: ""
        }
        const { data, user } = req.body;

        //  ACCETPED VALUES FOR SOFTONE UPDATE:
        let softoneObj = {
            sodtype: 12,
            TRDR: data.TRDR,
            EMAIL: data.EMAIL,
            EMAILACC: data.EMAILACC,
            AFM: data.AFM,
            NAME: data.NAME,
            PHONE01: data.PHONE01,
            PHONE02: data.PHONE02,
            ADDRESS: data.ADDRESS,
            ZIP: data.ZIP,
            CITY: data.CITY,
            COUNTRY: data.COUNTRY,
            BRANCH: data.BRANCH,
            IRSDATA: data.IRSDATA,
            JOBTYPE: data.JOBTYPE,
            ISACTIVE: data.ISACTIVE,
            CODE: data.CODE,
        }
        // let removeUndefined = Object.fromEntries(Object.entries(softoneObj).filter(([key, value]) => value !== undefined));
        function removeUndefined(obj) {
            Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
        }
        removeUndefined(softoneObj)

        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/updateSupplier`;
            const result = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                 
                    ...softoneObj
                })
            });
            let buffer = await translateData(result)
            if (!buffer) {
                response.success = false;
                response.message = 'No data found';
                return res.status(200).json(response)
            }
            response.success = true;
            response.message = "Supplier updated in Softone successfully";
        } catch (e) {
            response.message = "SoftoneError Error updating supplier";
            response.error = e;

        }
        try {
            await connectMongo();
            let result = await Supplier.findOneAndUpdate({ _id: data._id }, {
                ...data,
                updatedFrom: user
            }, { new: true })
            console.log('mongo Result')
            console.log(result)
            if (!result) {
                response.success = false;
                response.message = "Supplier updated in Softone but not in MongoDB";
            }
            response.result = result;
            response.success = true;
            response.message = "Supplier updated in Softone and MongoDB successfully";
        } catch (e) {
            response.message = "MongoError Error updating supplier";
            response.error = e;
        }
        console.log(response)
        return res.status(200).json(response)
    }

    if (action === "create") {
        let response = {
            result: null,
            success: false,
            error: null,
            message: ""
        }
        const { data } = req.body;
        let softoneObj = {
            TRDR: data.TRDR,
            company: 1001,
            sodtype: 12,
            SOCURRENCY: data.SOCURRENCY,
            code: data.CODE,
            EMAIL: data.EMAIL,
            EMAILACC: data.EMAILACC,
            afm: data.AFM,
            name: data.NAME,
            PHONE01: data.PHONE01,
            PHONE02: data.PHONE02,
            ADDRESS: data.ADDRESS,
            ZIP: data.ZIP,
            CITY: data.CITY,
            country: data.COUNTRY,
            BRANCH: data.BRANCH,
            IRSDATA: data.IRSDATA,
            JOBTYPE: data.JOBTYPE,
            ISACTIVE: data.ISACTIVE,
          
        }
        function removeUndefined(obj) {
            Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
        }
        removeUndefined(softoneObj)

        console.log(softoneObj)
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/insertSupplier`;
            const result = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    ...softoneObj
                })
            });
            let buffer = await translateData(result)
            console.log(buffer)
            if (!buffer) {
                response.success = false;
                response.message = 'No data found';
            }
            response.message = "Supplier created in Softone successfully";
        } catch (e) {
            response.message = "SoftoneError Error creating supplier";
            response.error = e;
        }

        try {
            await connectMongo();
            let insert = await Supplier.create(data);
            response.result = insert;
            response.success = true;
            response.message = "Supplier created in Softone and MongoDB successfully";
        } catch (e) {
            response.message = "MongoError Error creating supplier";
            response.error = e;
        }
        console.log(response)
        return res.status(200).json(response)
    }

    if (action === 'saveCatalog') {
        const { catalogName, id } = req.body;

        try {
            await connectMongo();
            let result = await Supplier.findOneAndUpdate({ _id: id }, {
                $set: {
                    catalogName: catalogName
                }
            })
            return res.status(200).json({ success: true, result: result })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if (action === 'findSuppliersBrands') {

        const { supplierID } = req.body;

        try {
            await connectMongo();
            let result = await Supplier.findOne({
                _id: supplierID
            }, { brands: 1 }).populate('brands');

            return res.status(200).json({ success: true, result: result });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }

    if (action === "deleteBrandFromSupplier") {
        const { supplierID, brandID } = req.body;

        try {
            await connectMongo();
            let result = await Supplier.findOneAndUpdate({ _id: supplierID }, {
                $pull: {
                    brands: brandID
                }
            })
            return res.status(200).json({ success: true, result: result })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }


    if (action === "getTRDCATEGORIES") {
        let send = {
            result: null,
            success: false,
            error: null,
            message: ""
        }
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllTrdCategory`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    sodtype: 12,
                    company: 1001
                })
            });
            let buffer = await translateData(response)
            console.log(buffer)
            if (!buffer) {
                send.success = false;
                send.message = 'No data found';
                return res.status(200).json(send)

            }
            send.success = true;
            send.result = buffer.result;
            return res.status(200).json(send)
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
    if (action === "getCountries") {
        let send = {
            result: null,
            success: false,
            error: null,
            message: ""
        }
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllCountries`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",

                })
            });
            let buffer = await translateData(response)
            if (!buffer) {
                send.success = false;
                send.message = 'No data found';
                return res.status(200).json(send)

            }
            send.success = true;
            send.result = buffer.result;
            return res.status(200).json(send)
        } catch (e) {
            send.error = e;
            send.message = "Error fetching data"
            return res.status(400).json(send)
        }
    }
}