

import axios from "axios";
import format from "date-fns/format";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import SoftoneProduct from "../../../../server/models/newProductModel"
import { Product } from "../../../../server/models/newProductModel";



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
        console.log('create data')
        console.log(data)
        try {
            await connectMongo();
            let product = await SoftoneProduct.create({
                ...data,
                SOFTONESTATUS: false,
                ISACTIVE: true,
                isSkroutz: false,
                hasImage: false,
                availability: {
                    DIATHESIMA: '0',
                    SEPARAGELIA: '0',
                    DESVMEVMENA: '0',
                }
            });

            return res.status(200).json({ success: true, result: product });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }

    if (action === 'update') {
        let { data } = req.body;

        let systemMessage = '';
        let softoneMessage = '';
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrl`;
        let obj = {
            MTRL: data.MTRL,
            NAME: data.NAME,
            CODE: data.CODE,
            CODE1: data.CODE1,
            CODE2: data.CODE2,
            ISACTIVE: data.ISACTIVE ? "1" : "0",
            MTRCATEGORY: data.category.softOne.MTRCATEGORY.toString(),
            MTRGROUP: data.group.softOne.MTRGROUP.toString(),
            CCCSUBGOUP2: data.subgroup.softOne.cccSubgroup2.toString(),
            MTRMANFCTR: data.MTRMANFCTR,
            MTRMARK: data.MTRMARK && data.MTRMARK.toString(),
            VAT: data.vat.VAT,
            COUNTRY: data.MTRMANFCTR,
            WIDTH: data.WIDTH || '0',
            HEIGHT: data.HEIGHT || '0',
            LENGTH: data.LENGTH || '0',
            GWEIGHT: data.GWEIGHT || '0',
            VOLUME: data.VOLUME || '0',
            STOCK: data.STOCK || '0',
            PRICER: data.PRICER.toString(),
            PRICER01: data.PRICER01.toString() || '0',
            PRICER02: data?.PRICER02 || '0',
            PRICER03: data?.PRICER03 || '0',
            PRICER04: data?.PRICER04 || '0',
            PRICER05: data?.PRICER05 || '0',
            PRICEW01: data?.PRICEW01 || '0',
            PRICEW02: data?.PRICEW02 || '0',
            PRICEW03: data?.PRICEW03 || '0',
            PRICEW04: data?.PRICEW04 || '0',
            PRICEW05: data?.PRICEW05 || '0',
            PRICEW: data?.PRICEW.toString(),

        }


        if (data.MTRL) {
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
                softoneMessage = 'Δεν έγινε ενημέρωση στο softone'
            }
            if (responseJSON.success) {
                softoneMessage = 'Εγινε ενημέρωση στο softone'
            }

        }
        try {
            let updateSoftoneProduct = await SoftoneProduct.updateOne({ _id: data._id }, {
                $set: {
                    COST: data.COST,
                    NAME: data.NAME,
                    CODE: data.CODE,
                    CODE1: data.CODE1,
                    CODE2: data.CODE2,
                    // MTRCATEGORY: parseInt(data.category.softOne.MTRCATEGORY),
                    // MTRGROUP: parseInt(data.group.softOne.MTRGROUP),
                    // CCCSUBGROUP2: parseInt(data.subgroup.softOne.cccSubgroup2),
                    MTRMANFCTR: data.MTRMANFCTR && data.MTRMANFCTR.toString(),
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
                    COST: data?.COST,
                }
            })
            console.log(updateSoftoneProduct);
            systemMessage = 'Εγινε ενημέρωση στο σύστημα'
            return res.status(200).json({ success: true, systemMessage: systemMessage, softoneMessage: softoneMessage });

        } catch (e) {
            systemMessage = 'Δεν έγινε ενημέρωση στο σύστημα'
            return res.status(400).json({ success: false, systemMessage: systemMessage, softoneMessage: softoneMessage });
        }


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
            CCCSUBGROUP2: subgroupid,
            SUBGROUP_NAME: subGroupName,
            CCCSUBGROUP3: ""
        }
        console.log('obj')
        console.log(OBJ)
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
                })
            });

            let respJSON = await response.json()
            console.log('softone update')
            console.log(respJSON)
            return respJSON;
        }

        try {
            let results = [];
            if (gridData) {

                for (let item of gridData) {
                    console.log(item)
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

    if (action === "updateActiveMtrl") {
        const { ISACTIVE, MTRL, id } = req.body;
        console.log(MTRL, ISACTIVE)
        let _ISACTIVE = ISACTIVE ? 1 : 0;
        // const mtrl = 94273

        let message;
        try {
            await connectMongo();
            let update = await SoftoneProduct.findOneAndUpdate({
                MTRL: MTRL,
                _id: id
            }, {
                $set: {
                    ISACTIVE: !ISACTIVE
                }
            })
            message = 'System update success.'
        } catch (e) {
            return res.status(200).json({ success: false, result: null, error: 'System update error' });
        }
        try {
            async function updateSoftone() {
                if (!MTRL) return;
                let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrlActive`;
                const response = await fetch(URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                        MTRL: MTRL,
                        ISACTIVE: _ISACTIVE
                    })
                });

                let buffer = await translateData(response)
                return message += ` ${buffer.result}`
            }
            let message = await updateSoftone();

        } catch (e) {
            return res.status(200).json({ success: false, result: null, error: 'Softone update error' });
        }

        return res.status(200).json({ success: true, message: message });
    }

    if (action === "updateSkroutz") {
        const { isSkroutz, MTRL, id } = req.body;
        //Softone accepts 1 or 0
        let _isSkroutz = isSkroutz ? 1 : 0;
        let message;

        try {
            async function updateSoftone() {
                if (!MTRL) return;
                let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateSkroutz`;
                const response = await fetch(URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                        STATUS: _isSkroutz,
                        MTRL: MTRL,
                    })
                });
                let buffer = await translateData(response)
                console.log('response buffer')
                console.log(buffer)
                return buffer.result
            }
            message = await updateSoftone();


        } catch (e) {
            return res.status(200).json({ success: false, result: null, error: 'Softone update error' });
        }

        try {
            await connectMongo();
            let update = await SoftoneProduct.findOneAndUpdate({
                MTRL: MTRL,
                _id: id
            }, {
                $set: {
                    isSkroutz: !isSkroutz
                }
            }, { new: true })
            message += ' System skroutz update success.'
        } catch (e) {
            return res.status(200).json({ success: false, result: null, error: 'System update error' });
        }


        return res.status(200).json({ success: true, message: message });
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

        try {
            const filteredObject = {};

            for (const key in data) {
                if (data[key] !== '') {
                    filteredObject[key] = data[key];
                }
            }
            console.log('filtered object')
            console.log(filteredObject)
            await connectMongo();

            async function createSoftone() {
                let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/addNewMtrl`;
                const response = await fetch(URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                        ...data
                    })
                });
                let buffer = await translateData(response)

                // console.log(responseJSON)
                console.log(buffer)
                return buffer;
            }
            let response = await createSoftone();
            if (response.success == false) {
                return res.status(200).json({ success: false, error: 'Δεν προστέθηκε στο softOne' });
            }
            if (response.success) {
                let update = await SoftoneProduct.findOneAndUpdate({ _id: id },
                    {
                        $set: {
                            SOFTONESTATUS: true,
                            MTRL: response.MTRL,
                            ...mongoData
                        }
                    },
                    { new: true }
                )
                console.log('update')
                console.log(update)
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
        const { parentId, imageId, name } = req.body;
        try {
            await connectMongo();
            const updatedProduct = await SoftoneProduct.findOneAndUpdate(
                { _id: parentId }, // Using the passed 'id' variable
                {
                    $pull: {
                        images: {
                            _id: imageId,
                            name: name
                        }
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

    if (action === "csvImages") {
        const { data, index, total } = req.body;


        let erp = data['Erp Code'];
        let image = data['Image Name'];

        try {
            const updatedDocument = await SoftoneProduct.findOneAndUpdate(
                { CODE: `${erp}` },
                {
                    $push: {
                        images: [{ name: image }]
                    },
                    $set: {
                        hasImage: true
                    }
                },
                { new: true, projection: { _id: 0, NAME: 1, CODE: 1, updatedAt: 1, images: { $slice: -1 } } }
            );
            console.log('updated')
            console.log(updatedDocument.NAME)
            let _newdoc = {
                NAME: updatedDocument.NAME,
                CODE: updatedDocument.CODE,
                updatedAt: updatedDocument.updatedAt,
                images: updatedDocument.images,
                updatedToTotal: `${index}/${total}`
            }

            console.log(_newdoc)
            return res.status(200).json({ success: true, result: _newdoc });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ success: false, result: null });
        }
    }

    if (action === "update_service") {
        const { data } = req.body;
        console.log(data)

        try {
            await connectMongo();
            const errors = [];
            const result = [];
            for (let item of data) {
                const now = new Date();
                const formattedDateTime = format(now, 'yyyy-MM-dd HH:mm:ss');

                let res = await updateSystem(item, formattedDateTime)
               
                if(!res) {
                    errors.push({
                        MTRL: item.MTRL,
                        error: 'Δεν βρέθηκε το προϊόν'
                    })
                }
                if(res) {
                    result.push({
                        success: 'Επιτυχής ενημέρωση',
                        MTRL: res._doc.MTRL,
                        PRICER: res._doc.PRICER,
                        PRICER01: res._doc.PRICER01,
                        PRICEW: res._doc.PRICEW,
                        COST: res._doc.COST,
                        isSkroutz: res._doc.isSkroutz,
                        availability: {
                            DIATHESIMA: res._doc.availability.DIATHESIMA,
                            SEPARAGELIA: res._doc.availability.SEPARAGELIA,
                            DESVMEVMENA: res._doc.availability.DESVMEVMENA,
                            date: res._doc.availability.date
                        }
                    })
                }
            }
           
            async function updateSystem(data, date) {
                let update = await SoftoneProduct.findOneAndUpdate({
                    MTRL: data.MTRL.toString()
                }, {
                    $set: {
                        PRICER: data.PRICER,
                        PRICER01: data.PRICER01,
                        PRICEW: data.PRICEW,
                        COST: data.COST,
                        isSkroutz: parseInt(data.isSkroutz) === 1 ? true : false,
                        availability: {
                            DIATHESIMA: data.DIATHESIMA.toString(),
                            SEPARAGELIA: data.SEPARAGELIA.toString(),
                            DESVMEVMENA: data.DESVMEVMENA.toString(),
                            date: date.toString()
                        }
                    }
                }, {new: true})
                return update;
            }
          
          
            return res.status(200).json({ success: true, errors: errors, result: result });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }

    if(action === 'update_service_cost') {
            const  {data} = req.body;
            await connectMongo();
            const errors = [];
            const result = [];
          
            try {
                for (let item of data) {
                    let res = await updateSystem(item)
                    if(!res) {
                        errors.push({
                            MTRL: item.MTRL,
                            error: 'Δεν βρέθηκε το προϊόν'
                        })
                    }
                    if(res) {
                        result.push({
                            success: 'Επιτυχής ενημέρωση',
                            COST: res._doc.COST,
                        })
                    }
                }
                async function updateSystem(data) {
                    let update = await SoftoneProduct.findOneAndUpdate({
                        MTRL: data.MTRL.toString()
                    }, {
                        $set: {
                            COST: data.COST,
                        }
                    }, {new: true})
                    console.log('update')
                    console.log(update)
                    return update;
                }
                return res.status(200).json({ success: true, errors: errors, result: result });
            } catch (e) {
                return res.status(400).json({ success: false, result: null });
            }
           

          
    }
}



