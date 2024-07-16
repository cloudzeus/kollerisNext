import format from "date-fns/format";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import SoftoneProduct from "../../../../server/models/newProductModel";
import {removeEmptyObjectFields} from "@/utils/removeEmptyObjectFields";

// eslint-disable-next-line import/no-anonymous-default-export
export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "s-maxage=10");
    const action = req.body.action;
    await connectMongo();


    if (action === "create") {
        const {data} = req.body;
        const transformData = (data) => {
            const {
                MTRCATEGORY,
                MTRGROUP,
                CCCSUBGROUP2,
                MTRMARK,
                MTRMANFCTR,
                INTRASTAT,
                VAT,
                COUNTRY,
                PRICER,
                WIDTH,
                LENGTH,
                HEIGHT,
                GWEIGHT,
                VOLUME,
                DIATHESIMA,
                SEPARAGELIA,
                DESVMEVMENA,
            } = data;

            console.log(req.body)
            return {
                ...data,
                // CATEGORY
                MTRCATEGORY: MTRCATEGORY?.softOne?.MTRCATEGORY,
                CATEGORY_NAME: MTRCATEGORY?.categoryName,
                // GROUP
                MTRGROUP: MTRGROUP?.softOne?.MTRGROUP,
                GROUP_NAME: MTRGROUP?.groupName,
                // SUBGROUP
                CCCSUBGROUP2: CCCSUBGROUP2?.softOne?.cccSubgroup2,
                SUBGROUP_NAME: CCCSUBGROUP2?.subGroupName,
                // BRAND
                MTRMARK: MTRMARK?.softOne?.MTRMARK,
                MTRMARK_NAME: MTRMARK?.softOne?.NAME,
                // MANUFACTURER
                MTRMANFCTR: MTRMANFCTR?.MTRMANFCTR?.toString(),
                MMTRMANFCTR_NAME: MTRMANFCTR?.NAME,
                // REST
                INTRASTAT: INTRASTAT?.INTRASTAT,
                VAT: VAT?.VAT,
                COUNTRY: COUNTRY?.COUNTRY,
                PRICER: PRICER,
                // TURN TO STRING
                WIDTH: WIDTH?.toString(),
                LENGTH: LENGTH?.toString(),
                HEIGHT: HEIGHT?.toString(),
                GWEIGHT: GWEIGHT?.toString(),
                VOLUME: VOLUME?.toString(),
                availability: {
                    DIATHESIMA: DIATHESIMA?.toString() || "0",
                    SEPARAGELIA: SEPARAGELIA?.toString() || "0",
                    DESVMEVMENA: DESVMEVMENA?.toString() || "0",
                    date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                },
                ISACTIVE: true,
            };
        };
        const filterNull = (obj) => {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                if (
                    value !== null &&
                    value !== undefined &&
                    value !== "" &&
                    key !== "DIATHESIMA" &&
                    key !== "SEPARAGELIA" &&
                    key !== "DESVMEVMENA"
                ) {
                    acc[key] = value;
                }
                return acc;
            }, {});
        };

        const newData = transformData(data);
        const filteredData = filterNull(newData);

        try {
            await connectMongo();
            let product = await SoftoneProduct.create(filteredData);
            if (!product) throw new Error("Δεν δημιουργήθηκε στο σύστημα");
            return res.status(200).json({
                success: true,
                message: "Επιτυχής δημιουργία πρoϊόντος",
            })

        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    if (action === "update") {
        const {data} = req.body;
        try {
            //IF THERE IS MTRL UDPATE SOFTONE:
            if (data.MTRL) {
                let softone = await putSoftone(data);
                if (!softone.success)
                    throw new Error(softone.error || "Δεν ενημερώθηκε στο Softone");
            }

            //Due to the format of the data from the dropdowns if the data change when the user edits we will receive and object.
            //If the data remains unchanged during edit it will evaluate to the right of the ternary operator
            const systemData = {
                NAME: data?.NAME,
                NAME_ENG: data?.NAME_ENG,
                DESCRIPTION: data?.DESCRIPTION,
                DESCRIPTION_ENG: data?.DESCRIPTION_ENG,
                //CATEGORIZATION:
                MTRCATEGORY: data?.MTRCATEGORY?.softOne?.MTRCATEGORY,
                CATEGORY_NAME: data?.MTRCATEGORY?.categoryName,
                MTRGROUP: data?.MTRGROUP?.softOne?.MTRGROUP,
                GROUP_NAME: data?.MTRGROUP?.groupName,
                CCCSUBGROUP2: data?.CCCSUBGROUP2?.softOne?.cccSubgroup2,
                SUBGROUP_NAME: data?.CCCSUBGROUP2?.subGroupName,
                MTRMARK: data?.MTRMARK?.softOne?.MTRMARK,
                MTRMARK_NAME: data?.MTRMARK?.softOne?.NAME,
                MTRMANFCTR: data?.MTRMANFCTR?.MTRMANFCTR?.toString(),
                MMTRMANFCTR_NAME: data?.MTRMANFCTR?.NAME,
                //PRICES:
                PRICER: data?.PRICER,
                PRICEW: data?.PRICEW,
                PRICER01: data?.PRICER01,
                //CODES:
                CODE: data?.CODE,
                CODE1: data?.CODE1,
                CODE2: data?.CODE2,
                //DETAILS:
                INTRASTAT: data?.INTRASTAT?.INTRASTAT,
                VAT: data?.VAT?.VAT?.toString(),
                COUNTRY: data?.COUNTRY?.COUNTRY?.toString(),
                //REST:
                WIDTH: data?.WIDTH?.toString(),
                LENGTH: data?.LENGTH?.toString(),
                HEIGHT: data?.HEIGHT?.toString(),
                GWEIGHT: data?.GWEIGHT?.toString(),
                VOLUME: data?.VOLUME?.toString(),
                ISACTIVE: data?.ISACTIVE,
                ATTRIBUTES: data?.ATTRIBUTES,
                isSkroutz: data?.isSkroutz,
            };

            let update = await SoftoneProduct.findOneAndUpdate(
                {
                    _id: data._id,
                },
                {
                    $set: systemData,
                },
                {new: true}
            );
            if (!update) throw new Error("Δεν ενημερώθηκε στο σύστημα");
            return res.status(200).json({
                success: true,
                message: "Επιτυχής Eνημέρωση Συστήματος",
            });
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: e.response?.data?.error || e.message,
            });
        }

        async function putSoftone(data) {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/putMtrl`;
            let softoneData = {
                username: "Service",
                password: "Service",
                MTRL: parseInt(data.MTRL),
                COMPANY: 1001,
                NAME: data?.NAME,
                CODE: data?.CODE,
                CODE1: data?.CODE1,
                CODE2: data?.CODE2,
                MTRCATEGORY: data?.MTRCATEGORY?.softOne?.MTRCATEGORY?.toString(),
                MTRGROUP: data?.MTRGROUP?.softOne?.MTRGROUP?.toString(),
                CCCSUBGOUP2: data?.CCCSUBGROUP2?.softOne?.cccSubgroup2?.toString(),
                MTRMARK: data?.MTRMARK?.softOne?.MTRMARK?.toString(),
                MTRMANFCTR: data?.MTRMANFCTR?.MTRMANFCTR?.toString(),
                INTRASTAT: data?.INTRASTAT?.INTRASTAT?.toString(),
                VAT: data?.VAT?.VAT?.toString(),
                COUNTRY: data?.COUNTRY?.COUNTRY?.toString(),
                //PRICES:
                PRICER: data?.PRICER?.toString(),
                PRICEW: data?.PRICEW?.toString(),
                PRICER01: data?.PRICER01?.toString(),
                //REST:
                ISACTIVE: data?.ISACTIVE ? "1" : "0",
                VOLUME: data?.VOLUME?.toString(),
                GWEIGHT: data?.GWEIGHT?.toString(),
            };
            let _softoneData = removeEmptyObjectFields(softoneData);
            try {
                const response = await fetch(URL, {
                    method: "POST",
                    body: JSON.stringify(_softoneData),
                });
                return await translateData(response);
            } catch (e) {
                return null;
            }
        }
    }

    if (action === "updateClass") {
        await connectMongo();
        const {
            id,
            products,
            MTRCATEGORY,
            CATEGORY_NAME,
            MTRGROUP,
            GROUP_NAME,
            CCCSUBGROUP2,
            SUBGROUP_NAME
        } = req.body;

        for (let product of products) {
            console.log({product})
            if (product.MTRL) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrlCat`, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                        MTRL: parseInt(product.MTRL),
                        MTRCATEGORY: MTRCATEGORY?.toString(),
                        MTRGROUP: MTRGROUP?.toString(),
                        CCCSUBGROUP2: CCCSUBGROUP2?.toString()
                    })
                });

                let buffer = await translateData(response);
                console.log({buffer})
                if (!buffer.success) throw new Error(buffer.error);
            }
            let update = await SoftoneProduct.findOneAndUpdate({_id: product._id,}, {
                $set: {
                    MTRCATEGORY: MTRCATEGORY,
                    CATEGORY_NAME: CATEGORY_NAME,
                    MTRGROUP: MTRGROUP,
                    GROUP_NAME: GROUP_NAME,
                    CCCSUBGROUP2: CCCSUBGROUP2,
                    SUBGROUP_NAME: SUBGROUP_NAME
                }
            });
            console.log({update})
            if (!update) throw new Error("Δεν ενημερώθηκε στο σύστημα");
        }


        try {
            return res.status(200).json({success: true, message: "Επιτυχής ενημέρωση"});
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: e.message
            });
        }
    }

    if (action === "warehouse") {
        const {exportWarehouse, importWarehouse, diathesimotita} = req.body;
        console.log(diathesimotita);
        // return res.status(200).json({ success: true, message: "Επιτυχής ενημέρωση" })
        const now = new Date();
        const formattedDateTime = format(now, "yyyy-MM-dd HH:mm:ss");

        const updates = diathesimotita.map((item) => ({
            updateOne: {
                filter: {MTRL: item.MTRL},
                update: {
                    $set: {
                        "availability.DIATHESIMA": item.available,
                        "availability.date": formattedDateTime.toString(),
                    },
                },
            },
        }));
        SoftoneProduct.bulkWrite(updates)
            .then((result) => {
            })
            .catch((err) => {
                console.error(err);
            });

        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getItemDoc`;

        async function modifySoftonePost(SERIES, data) {
            const response = await fetch(URL, {
                method: "POST",
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    COMPANY: 1001,
                    WHOUSE: 1000,
                    SERIES: SERIES,
                    WHOUSESEC: 1000,
                    MTRLINES: data,
                }),
            });
            let resJSON = await response.json();
            return resJSON;
        }

        try {
            let importRes;
            let exportRes;
            if (exportWarehouse && exportWarehouse.length > 0) {
                importRes = await modifySoftonePost(1011, exportWarehouse);
            }
            if (importWarehouse && importWarehouse.length > 0) {
                exportRes = await modifySoftonePost(1010, importWarehouse);
            }

            return res
                .status(200)
                .json({
                    success: true,
                    resultImport: importRes,
                    resultExport: exportRes,
                });
        } catch (e) {
            return res.status(400).json({success: false, result: null});
        }
    }

    if (action === "updateActiveMtrl") {
        const {ISACTIVE, MTRL, id} = req.body;

        try {
            await connectMongo();
            if (MTRL) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl2/update`, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                        data: [
                            {
                                MTRL: MTRL,
                                ISACTIVE: !ISACTIVE
                            }
                        ]
                    })
                });
                let buffer = await translateData(response);
                if (!buffer.success) throw new Error(buffer.error);
            }
            let update = await SoftoneProduct.findOneAndUpdate({_id: id,},
                {
                    $set: {ISACTIVE: !ISACTIVE},
                }
            );
            if (!update) throw new Error("Δεν ενημερώθηκε στο σύστημα");
            return res.status(200).json({
                success: true,
                message: "Επιτυχής ενημέρωση",
            })
        } catch (e) {
            return res.status(400).json({
                success: false, error: e.message
            });
        }
    }

    if (action === "updateSkroutz") {
        const {isSkroutz, MTRL, id} = req.body;
        //Softone accepts 1 or 0
        let _isSkroutz = isSkroutz ? 1 : 0;
        let message;

        try {
            async function updateSoftone() {
                if (!MTRL) return;
                let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateSkroutz`;
                const response = await fetch(URL, {
                    method: "POST",
                    body: JSON.stringify({
                        username: "Service",
                        password: "Service",
                        STATUS: _isSkroutz,
                        MTRL: MTRL,
                    }),
                });
                let buffer = await translateData(response);
                return buffer.result;
            }

            message = await updateSoftone();
        } catch (e) {
            return res
                .status(200)
                .json({success: false, result: null, error: "Softone update error"});
        }

        try {
            await connectMongo();
            let update = await SoftoneProduct.findOneAndUpdate(
                {
                    MTRL: MTRL,
                    _id: id,
                },
                {
                    $set: {
                        isSkroutz: !isSkroutz,
                    },
                },
                {new: true}
            );
            message += " System skroutz update success.";
        } catch (e) {
            return res
                .status(200)
                .json({success: false, result: null, error: "System update error"});
        }

        return res.status(200).json({success: true, message: message});
    }


    //IMAGES
    if (action === "addImages") {
        const {imagesURL, id} = req.body;

        try {
            await connectMongo();
            const updatedProduct = await SoftoneProduct.findOneAndUpdate(
                {_id: id}, // Using the passed 'id' variable
                {
                    $set: {hasImage: true},
                    $addToSet: {images: {$each: imagesURL}}, // Push only the new URLs
                },
                {new: true} // To return the updated document
            );
            return res.status(200).json({success: true, message: "Επιτυχής ενημέρωση"});
        } catch (error) {
            console.error(error);
            return res.status(400).json({success: false, result: null});
        }
    }

    if (action === "getImages") {
        const {id} = req.body;

        await connectMongo();
        try {
            let product = await SoftoneProduct.findOne({_id: id}, {images: 1});
            return res
                .status(200)
                .json({message: "success", result: product?.images});
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: e.message
            });
        }
    }
    if (action === "deleteImage") {
        const {parentId, imageId, name} = req.body;
        try {
            await connectMongo();
            await SoftoneProduct.findOneAndUpdate(
                {_id: parentId}, // Using the passed 'id' variable
                {
                    $pull: {
                        images: {
                            _id: imageId,
                            name: name,
                        },
                    },
                }, // Push only the new URLs
                {new: true} // To return the updated document
            );
            return res.status(200).json({success: true, message: "Η φωτογραφία διαγράφηκε επιτυχώς"});
        } catch (e) {
            return res.status(400).json({success: false, error: e.message});
        }
    }

    if (action === "csvImages") {
        const {data, index, total} = req.body;

        let erp = data["Erp Code"];
        let image = data["Image Name"];

        try {
            const updatedDocument = await SoftoneProduct.findOneAndUpdate(
                {CODE: `${erp}`},
                {
                    $push: {
                        images: [{name: image}],
                    },
                    $set: {
                        hasImage: true,
                    },
                },
                {
                    new: true,
                    projection: {
                        _id: 0,
                        NAME: 1,
                        CODE: 1,
                        updatedAt: 1,
                        images: {$slice: -1},
                    },
                }
            );

            let _newdoc = {
                NAME: updatedDocument.NAME,
                CODE: updatedDocument.CODE,
                updatedAt: updatedDocument.updatedAt,
                images: updatedDocument.images,
                updatedToTotal: `${index}/${total}`,
            };

            return res.status(200).json({success: true, result: _newdoc});
        } catch (error) {
            console.error(error);
            return res.status(400).json({success: false, result: null});
        }
    }

    // used by Kozyris:
    if (action === "update_service") {
        const {data} = req.body;

        try {
            await connectMongo();
            const errors = [];
            const result = [];
            for (let item of data) {
                const now = new Date();
                const formattedDateTime = format(now, "yyyy-MM-dd HH:mm:ss");

                let res = await updateSystem(item, formattedDateTime);

                if (!res) {
                    errors.push({
                        MTRL: item.MTRL,
                        error: "Δεν βρέθηκε το προϊόν",
                    });
                }
                if (res) {
                    result.push({
                        success: "Επιτυχής ενημέρωση",
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
                            date: res._doc.availability.date,
                        },
                    });
                }
            }

            async function updateSystem(data, date) {
                let update = await SoftoneProduct.findOneAndUpdate(
                    {
                        MTRL: data.MTRL.toString(),
                    },
                    {
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
                                date: date.toString(),
                            },
                        },
                    },
                    {new: true}
                );
                return update;
            }

            return res
                .status(200)
                .json({success: true, errors: errors, result: result});
        } catch (e) {
            return res.status(400).json({success: false, result: null});
        }
    }

    if (action === "update_service_cost") {
        const {data} = req.body;
        await connectMongo();
        const errors = [];
        const result = [];

        try {
            for (let item of data) {
                let res = await updateSystem(item);
                if (!res) {
                    errors.push({
                        MTRL: item.MTRL,
                        error: "Δεν βρέθηκε το προϊόν",
                    });
                }
                if (res) {
                    result.push({
                        success: "Επιτυχής ενημέρωση",
                        COST: res._doc.COST,
                    });
                }
            }

            async function updateSystem(data) {
                let update = await SoftoneProduct.findOneAndUpdate(
                    {
                        MTRL: data.MTRL.toString(),
                    },
                    {
                        $set: {
                            COST: data.COST,
                        },
                    },
                    {new: true}
                );

                return update;
            }

            return res
                .status(200)
                .json({success: true, errors: errors, result: result});
        } catch (e) {
            return res.status(400).json({success: false, result: null});
        }
    }
}
