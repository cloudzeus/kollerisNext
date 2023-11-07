

import axios from "axios";
import format from "date-fns/format";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import SoftoneProduct from "../../../../server/models/newProductModel"
import { MtrCategory, MtrGroup, SubMtrGroup } from "../../../../server/models/categoriesModel";


import { Product } from "../../../../server/models/newProductModel";
import { ProductAttributes } from "../../../../server/models/attributesModel";
import Offer from "@/components/grid/Product/Offer";



export const config = {
    api: {
        responseLimit: false,
    },
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 's-maxage=10');
    const action = req.body.action;

    if (action === "create") {
        const { data } = req.body;
        let MTRL = null;
        let SOFTONESTATUS = false
        if (MTRL) {
            SOFTONESTATUS = true;
        }
        try {
            await connectMongo();
            let product = await SoftoneProduct.create({
                ...data,
                SOFTONESTATUS: SOFTONESTATUS,
            });

            return res.status(200).json({ success: true, result: product });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }

    if (action === 'update') {
        let { data } = req.body;
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrl`;
        let obj = {

            MTRL: data.MTRL,
            NAME: data.NAME,
            CODE: data.CODE,
            CODE1: data.CODE1,
            CODE2: data.CODE2,
            ISACTIVE: data.ISACTIVE || 1,
            MTRCATEGORY: data.category.softOne.MTRCATEGORY,
            MTRGROUP: data.group.softOne.MTRGROUP,
            CCCSUBGOUP2: data.subgroup.softOne.cccSubgroup2,
            MTRMARK: data.MTRMARK.toString(),
            MTRMANFCTR: data.MTRMANFCTR,
            VAT: data.vat.VAT,
            COUNTRY: data.MTRMANFCTR,
            WIDTH: data.WIDTH || '0',
            HEIGHT: data.HEIGHT || '0',
            LENGTH: data.LENGTH || '0',
            GWEIGHT: data.GWEIGHT || '0',
            VOLUME: data.VOLUME || '0',
            STOCK: data.STOCK || '0',
            PRICER: data.PRICER || '0',
            PRICER01: data.PRICE01 || '0',
            PRICER02: data?.PRICE02 || '0',
            PRICER03: data?.PRICE03 || '0',
            PRICER04: data?.PRICE04 || '0',
            PRICER05: data?.PRICER05 || '0',
            PRICEW01: data?.PRICEW01 || '0',
            PRICEW02: data?.PRICEW02 || '0',
            PRICEW03: data?.PRICEW03 || '0',
            PRICEW04: data?.PRICEW04 || '0',
            PRICEW05: data?.PRICEW05 || '0',
            PRICEW: data?.PRICEW,

        }
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                ...obj
            })
        });
        let responseJSON = await response.json();


        if (!responseJSON.success) {
            return res.status(200).json({ success: false, result: null, error: 'Softone update error' });
        }
        let updateSoftoneProduct = await SoftoneProduct.updateOne({ MTRL: data.MTRL }, {
            $set: {
                COST: data.COST,
                NAME: data.NAME,
                CODE: data.CODE,
                CODE1: data.CODE1,
                CODE2: data.CODE2,
                MTRCATEGORY: parseInt(data.category.softOne.MTRCATEGORY),
                MTRGROUP: parseInt(data.group.softOne.MTRGROUP),
                CCCSUBGOUP2: parseInt(data.subgroup.softOne.cccSubgroup2),
                MTRMANFCTR: data.MTRMANFCTR.toString(),
                VAT: data.vat.VAT,
                COUNTRY: data.COUNTRY,
                INTRASTAT: data.INTRASTAT,
                WIDTH: data.WIDTH,
                HEIGHT: data.HEIGHT,
                LENGTH: data.LENGTH,
                GWEIGHT: data.GWEIGHT,
                VOLUME: data.VOLUME,
                STOCK: data.STOCK,
                PRICER: data.PRICER,
                PRICEW: data.PRICEW,
                PRICER02: data.PRICE02 || 0,
                PRICER05: data.PRICER05,
                CATEGORY_NAME: data.category.categoryName,
                DESCRIPTION: data.DESCRIPTION,
                GROUP_NAME: data.category.groupName,
                SUBGROUP_NAME: data.category.subGroupName,
                SOFTONESTATUS: true,
                descriptions: data.descriptions,
            }
        })
        return res.status(200).json({ success: true, result: updateSoftoneProduct, softOneResult: responseJSON });

    }

    if (action === 'search') {
        let query = req.body.query;
        await connectMongo();
        // Construct a case-insensitive regex pattern for the search query

        const regexPattern = new RegExp(query, 'i');
        let search = await SoftoneProduct.find({ NAME: regexPattern })
        return res.status(200).json({ success: true, result: search });
    }

    if (action === 'insert') {
        await connectMongo();
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/getMtrl`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
            })
        });
        let buffer = await translateData(response)
        console.log(buffer.result)
        await connectMongo();
        let insert1 = await SoftoneProduct.insertMany(buffer.result)

        let softone = await SoftoneProduct.find({}, { MTRL: 1, NAME: 1, _id: 1 })


        let productsInsert = softone.map((item) => ({
            softoneProduct: item._id,
            name: item.NAME,
            MTRL: item.MTRL,
            softoneStatus: true,
        }))
        let insert = await Product.insertMany(productsInsert)

        return res.status(200).json({ success: true, result: insert });



    }

    if (action === 'updateClass') {
        let { categoryid, groupid, subgroupid, gridData, categoryName, groupName, subGroupName } = req.body;
        let OBJ = {
            MTRGROUP: groupid,
            GROUP_NAME: groupName,
            MTRCATEGORY: categoryid,
            CATEGORY_NAME: categoryName,
            CCCSUBGOUP2: subgroupid,
            SUBGROUP_NAME: subGroupName,
            CCCSUBGROUP3: ""
        }

        await connectMongo()

        async function updateSoft(item) {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrlCat`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    MTRL: item.MTRL,
                    MTRCATEGORY: categoryid,
                    MTRGROUP: groupid,
                    CCCSUBGOUP2: subgroupid,
                    CCCSUBGROUP3: ""
                })
            });

            let respJSON = await response.json()
            return respJSON;
        }

        try {
            let results = [];
            if (gridData) {
                for (let item of gridData) {
                    if (!item.hasOwnProperty('MTRL')) {
                        results.push({ name: item?.NAME, updated: false, mtrl: false })
                    }
                    let MTRLID = item.MTRL;
                    let result = await SoftoneProduct.updateOne({
                        MTRL: MTRLID
                    }, {
                        ...OBJ
                    })

                    if (result.modifiedCount > 0 && item.hasOwnProperty('MTRL')) {
                        results.push({ name: item.NAME, updated: true, mtrl: true })
                    }
                    if (result.modifiedCount < 1) {
                        results.push({ MTRLID: MTRLID, updated: false, mtrl: true })
                    }

                    updateSoft(item)



                }
            }
            // console.log(results)
            return res.status(200).json({ success: true, result: results });

        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }


    }



    if (action === 'warehouse') {
        const { exportWarehouse, importWarehouse, diathesimotita } = req.body;
        const now = new Date();
        const formattedDateTime = format(now, 'yyyy-MM-dd HH:mm:ss');

        const updates = diathesimotita.map(item => ({
            updateOne: {
                filter: { MTRL: item.MTRL },
                update: {
                    $set: {
                        "availability.DIATHESIMA": item.available,
                        "availability.date": formattedDateTime.toString(),
                    }
                },
                upsert: false  // optional: set to true if you want to create a new document when no document matches the filter
            }
        }));
        SoftoneProduct.bulkWrite(updates)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.error(err);
            });

        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getItemDoc`;
        async function modifySoftonePost(SERIES, data) {
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    COMPANY: 1001,
                    WHOUSE: 1000,
                    SERIES: SERIES,
                    WHOUSESEC: 1000,
                    MTRLINES: data
                })
            });
            let resJSON = await response.json();
            console.log(resJSON);
            return resJSON;
        }

        try {
            let importRes;
            let exportRes;
            if (exportWarehouse && exportWarehouse.length > 0) {
                importRes = await modifySoftonePost(1011, exportWarehouse)
            }
            if (importWarehouse && importWarehouse.length > 0) {
                exportRes = await modifySoftonePost(1010, importWarehouse)
            }


            return res.status(200).json({ success: true, resultImport: importRes, resultExport: exportRes });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }

    }

    if (action === "importCSVProducts") {

        const { data } = req.body;
        await connectMongo();
        //ADD THE SOFTONE PRODUCT
        try {

            const softOneData = data.map((item) => {
                return {
                    NAME: item.name || '',
                    CODE: item.CODE || '',
                    CODE1: item.CODE1 || '',
                    CODE2: item.CODE2 || '',
                    VAT: item.VAT || '',
                    COUNTRY: item.COUNTRY || '',
                    INTRASTAT: item.INTRASTAT || '',
                    WIDTH: item.WIDTH || '',
                    HEIGHT: item.HEIGHT || '',
                    LENGTH: item.LENGTH || '',
                    GWEIGHT: item.GWEIGHT || '',
                    VOLUME: item.VOLUME || '',
                    STOCK: item.STOCK || '',
                    PRICER: item.PRICER || '',
                    PRICEW: item.PRICEW || '',
                    PRICER05: item.PRICER05 || '',
                }
            })
            let createSoftone = await SoftoneProduct.create(softOneData)

            let productInsert = createSoftone.map((item) => {
                return {
                    name: item.NAME || '',
                    description: item.description || '',
                    softoneStatus: false,
                    attributes: item.attributes || [],
                }
            })
            let insert = await Product.insertMany(productInsert)
            return res.status(200).json({ success: true, result: insert });

        } catch {
            return res.status(400).json({ success: false, error: 'error' });
        }

    }

    if (action === "addToSoftone") {
        const { data, id, mongoData } = req.body;
        // console.log(mongoData)
        try {
            const filteredObject = {};

            for (const key in data) {
                if (data[key] !== '') {
                    filteredObject[key] = data[key];
                }
            }

            await connectMongo();

            async function createSoftone() {
                let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/addNewMtrl`;
                const response = await fetch(URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                        ...filteredObject
                    })
                });
                let responseJSON = await response.json();
                return responseJSON;
            }
            let responseJSON = await createSoftone();
            if (responseJSON.success) {
                let update = await SoftoneProduct.findOneAndUpdate({ _id: id },
                    {
                        $set: {
                            SOFTONESTATUS: true,
                            MTRL: responseJSON.MTRL,
                            ...mongoData
                        }
                    }
                )
            }


            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }

    if (action === 'checkStatus') {
        const { products } = req.body;
        try {
            await connectMongo();
            const productsArray = []
            for (let item of products) {
                let product = await SoftoneProduct.findOne({ SOFTONESTATUS: false, _id: item._id })
                if (product) {
                    productsArray.push(product)

                }
            }
            return res.status(200).json({ success: true, result: productsArray });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }


    //IMAGES
    if (action === "addImages") {
        const { imagesURL, id } = req.body;


        try {
            await connectMongo();
            // const product = await SoftoneProduct.findOne({ _id: id }, 'images'); // Fetch the document
            //     const existingImages = product.images || [];
            //     const removeduplicateImages = imagesURL.filter(url => existingImages.includes(url));


            const updatedProduct = await SoftoneProduct.findOneAndUpdate(
                { _id: id }, // Using the passed 'id' variable
                {
                    $set: { hasImage: true },
                    $addToSet: { images: { $each: imagesURL } } // Push only the new URLs
                },
                { new: true } // To return the updated document
            );
            console.log(updatedProduct)
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ success: false, result: null });
        }



    }

    if (action === 'getImages') {
        const { id } = req.body;

        await connectMongo()
        try {
            let product = await SoftoneProduct.findOne({ _id: id }, { images: 1 });
            console.log(product)
            return res.status(200).json({ message: "success", result: product?.images })
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }

    }
    if (action === "deleteImage") {
        const { id, name } = req.body;
        try {
            await connectMongo();
            const updatedProduct = await SoftoneProduct.findOneAndUpdate(
                { _id: id }, // Using the passed 'id' variable
                {
                    $pull: {
                        images: { name: name }
                    }
                },// Push only the new URLs
                { new: true } // To return the updated document
            );
            console.log(updatedProduct)
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }
}



