import axios from "axios";
import mongoose from "mongoose";
import translateData from "@/utils/translateDataIconv";
import { MtrCategory, MtrGroup, SubMtrGroup } from "../../../server/models/categoriesModel";
import connectMongo from "../../../server/config";
import Categories from "../dashboard/product/mtrcategories";
import Markes from "../../../server/models/markesModel";
import Vat from "../../../server/models/vatModel";
import Intrastat from "../../../server/models/intrastatMode";
import Countries from "../../../server/models/countriesModel";
import Currency from "../../../server/models/currencyModel";
import SoftoneProduct from "../../../server/models/newProductModel";
import { Product } from "../../../server/models/newProductModel";
import Supplier from "../../../server/models/suppliersSchema";
import Clients from "../../../server/models/modelClients";
import Holders from "../../../server/models/holderModel";
import SingleOffer from "../../../server/models/singleOfferModel";
import { ImpaCodes } from "../../../server/models/impaSchema";
export default async function handler(req, res) {
    let action = req.body.action;


    if (action === "createSuppliers") {
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/getCustomers`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    sodtype: 12,

                })
            });

            let buffer = await translateData(response)
            console.log(buffer.result)
            await connectMongo();
            let insert = await Supplier.insertMany(buffer.result)
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }


    if (action === "createBrands") {
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/getMtrMark`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    sodtype: 12,
                })
            });

            let buffer = await translateData(response)

            await connectMongo();
            for (let item of buffer.result) {
                let obj = {
                    minItemsOrder: 0,
                    minValueOrder: 0,
                    minYearPurchases: 0,
                    softOne: {
                        COMPANY: item.COMPANY,
                        SODTYPE: item.SODTYPE,
                        MTRMARK: item.MTRMARK,
                        CODE: item.CODE,
                        NAME: item.NAME,
                        ISACTIVE: item.ISACTIVE,
                    }
                }
                await Markes.create(obj)
            }

            return res.status(200).json({ success: true, result: insert });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }


    if (action === "createCategories") {
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrCategory/getMtrCategory`;
        console.log('createCategories')

        try {
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    company: 1001,
                    sodtype: 51,

                })
            });
            let buffer = await translateData(response)
            await connectMongo();
            let newArray = [];
            buffer.result.map((item) => {
                let obj = {
                    categoryName: item.NAME,
                    categoryIcon: "",
                    categoryImage: "",
                    status: true,
                    softOne: {
                        MTRCATEGORY: item.MTRCATEGORY,
                        CODE: item.CODE,
                        NAME: item.NAME,
                        ISACTIVE: item.ISACTIVE,
                    }
                }
                newArray.push(obj)
            })
            console.log(newArray)
            let insert = await MtrCategory.insertMany(newArray, { upsert: true })
            console.log(insert)


        } catch (e) {
            console.log(e)
        }


    }
    if (action === "createGroups") {
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrGroup/getMtrGroup`

            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    company: 1001,
                    sodtype: 51,

                })
            });
            let buffer = await translateData(response)

            await connectMongo();

            for (let item of buffer.result) {
                // console.log(item)
                let relationship = await MtrCategory.findOne({ 'softOne.MTRCATEGORY': item.cccMTRCATEGORY })


                let obj = {
                    category: relationship._id,
                    groupName: item.NAME,
                    groupIcon: "",
                    groupImage: "",
                    status: true,
                    softOne: {
                        MTRGROUP: item.MTRGROUP,
                        CODE: item.CODE,
                        NAME: item.NAME,
                        ISACTIVE: item.ISACTIVE,
                        MTRCATEGORY: item.cccMTRCATEGORY,
                    }
                }
                let insert = await MtrGroup.create(obj)
            }

            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(400).json({ success: false });
        }
    }
    if (action === "createSubGroups") {
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.cccGroup/getCccGroup`
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                company: 1001,
                sodtype: 51,

            })
        });
        let buffer = await translateData(response)
        await connectMongo();

        for (let item of buffer.result) {
            let groupFind = await MtrGroup.findOne({ 'softOne.MTRGROUP': item.MTRGROUP })
            let obj = {
                group: groupFind._id,
                subGroupName: item.name,
                subGroupIcon: "",
                subGroupImage: "",
                status: true,
                softOne: {
                    cccSubgroup2: item.cccSubgroup2,
                    short: item.short,
                    name: item.name,
                    MTRGROUP: item.MTRGROUP,
                }
            }
            await SubMtrGroup.create(obj)

        }

        return res.status(200).json({ success: true });
    }



    if (action === "groupsToCategories") {
        await connectMongo();


        let find = await MtrGroup.find({})

        for (let item of find) {
            let id = item.softOne.MTRCATEGORY;
            const updates = await MtrCategory.findOneAndUpdate(
                { 'softOne.MTRCATEGORY': id },
                {
                    $push: {
                        groups: [item._id]
                    }
                }
            )
        }

        return res.status(200).json({ success: true });
    }
    if (action === "subgroupsToGroups") {
        await connectMongo();


        let find = await SubMtrGroup.find({})

        for (let item of find) {
            let id = item.softOne.MTRGROUP;
            const updates = await MtrGroup.findOneAndUpdate(
                { 'softOne.MTRGROUP': parseInt(id) },
                {
                    $push: {
                        subGroups: [item._id]
                    }
                }
            )
            console.log(updates)
        }

        return res.status(200).json({ success: true });
    }

    if (action === "createVat") {
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllVat`
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                })
            });
            let buffer = await translateData(response)
            await connectMongo();

            let result = await Vat.insertMany(buffer.result)
            console.log(result)
            return res.status(200).json({ success: true, result: result });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }
    if (action === "createIntrastat") {
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllIntrastat`
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                })
            });
            let buffer = await translateData(response)
            await connectMongo();

            let result = await Intrastat.insertMany(buffer.result)
            console.log(result)
            return res.status(200).json({ success: true, result: result });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }

    if (action === "createCountries") {
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllCountries`
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                })
            });
            let buffer = await translateData(response)
            await connectMongo();
            let result = await Countries.insertMany(buffer.result)

            return res.status(200).json({ success: true, result: result });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }
    if (action === "createCurrency") {
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllCurrencies`
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                })
            });
            let buffer = await translateData(response)
            await connectMongo();
            let result = await Currency.insertMany(buffer.result)

            return res.status(200).json({ success: true, result: result });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }



    if (action === 'insertproducts') {
        console.log('we are here')
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
        console.log('BUFFER')
        console.log(buffer.result)

        await connectMongo();
        let insert1 = await SoftoneProduct.insertMany(buffer.result)

    }

    if (action === 'alterProducts') {
        try {
            await connectMongo();
            let categories = await MtrCategory.find({}, { softOne: { MTRCATEGORY: 1 }, categoryName: 1 })
            let groups = await MtrGroup.find({}, { softOne: { MTRGROUP: 1 }, groupName: 1 })
            let subgroups = await SubMtrGroup.find({}, { softOne: { cccSubgroup2: 1 }, subGroupName: 1 })
            let softoneProducts = await SoftoneProduct.find({}, { MTRCATEGORY: 1, MTRGROUP: 1, CCCSUBGOUP2: 1 })
            for (let item of softoneProducts) {
                let category = categories.find(cat => cat.softOne.MTRCATEGORY === item.MTRCATEGORY)
                let group = groups.find(gr => gr.softOne.MTRGROUP === item.MTRGROUP)
                let subgroup = subgroups.find(sub => sub.softOne.cccSubgroup2 === item.CCCSUBGOUP2)

                let update = await SoftoneProduct.findOneAndUpdate(
                    {
                        _id: item._id

                    },
                    {
                        $set: {
                            CATEGORY_NAME: category?.categoryName,
                            GROUP_NAME: group?.groupName,
                            SUBGROUP_NAME: subgroup?.subGroupName,
                        }
                    }
                )
                console.log(update)

            }
            return res.status(400).json({ success: false });

        } catch (e) {
            return res.status(400).json({ success: false });
        }

    }


    if (action === "productBrands") {
        try {
            await connectMongo();
            console.log('here')
            // let group = await SoftoneProduct.find({}, {MTRMARK: 1, _id: 1, NAME: 1})

            // for(let item of group) {
            //     let groupName = await Markes.findOne(
            //         { "softOne.MTRMARK": item.MTRMARK },
            //         { "softOne.NAME": 1, _id: 0 }
            //       );

            //     let updateField = groupName?.softOne.NAME
            //     console.log(item)
            //     if(updateField)  {
            //         let updated = await SoftoneProduct.findOneAndUpdate(
            //             { _id: item._id },
            //             { $set: { MTRMARK_NAME: groupName.softOne.NAME } }
            //           );
            //           console.log('updated')
            //           console.log(updated);
            //     }
            // }

            // for(let i of group) {
            //     await SoftoneProduct.findOneAndUpdate({
            //         _id: i._id
            //     }, {
            //         $set: {
            //             MTRMARK: 1029,
            //             MTRMARK_NAME: 'BOSCH' 
            //         }
            //     })
            // }

            let update = await SoftoneProduct.updateMany({}, {
                $set: {
                    SOFTONESTATUS: true
                }
            })
            console.log('update')
            console.log(update)

            return res.status(200).json({ success: true });

        } catch (e) {
            return res.status(400).json({ success: false });
        }
    }

    if (action === "createVat") {
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllVat`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                })
            });

            let buffer = await translateData(response)
            await connectMongo();
            let insert = await Vat.insertMany(buffer.result)
            return res.status(200).json({ success: true, result: insert });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }

    }
    if (action === "offerstatus") {
        await connectMongo();
        // let updateCliesnt = await Clients.updateMany({}, {
        //     $set: {
        //         OFFERSTATUS: false
        //     }
        // })
        let clientName = await Clients.find({}, { NAME: 1, _id: 0 })
        for (let name of clientName) {
            let holders = await Holders.find({ NAME: name.NAME })
            if (holders.length > 0) {
                let update = await Clients.findOneAndUpdate({
                    NAME: name.NAME
                }, {
                    $set: {
                        OFFERSTATUS: true
                    }
                })
            }
            let singleoffer = await SingleOffer.find({ NAME: name.NAME })
            if (singleoffer.length > 0) {
                let update = await Clients.findOneAndUpdate({
                    NAME: name.NAME
                }, {
                    $set: {
                        OFFERSTATUS: true
                    }
                })
            }
        }
        return res.status(200).json({ success: true });
    }

   
    if (action === "activeImpas") {
        await connectMongo();
        try {
            let update = await ImpaCodes.updateMany({}, {
                $set: {
                    isActive: true,
                }
            })
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(400).json({ success: false });
        }
    }

    if (action === "populateSuppliers") {
        await connectMongo();
        try {
            let suppliers = await Supplier.updateMany({}, {
                $set: {
                    minOrderValue: 1000,
                    orderCompletionValue: 0,
                },
    
            })
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(400).json({ success: false });
        }
       
    }

    if(action === "updateProduct") {
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/getMtrl`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
            })
        });

        let buffer = await translateData(response)
        await connectMongo();
        try {

            for(let item of buffer.result) {
                   let obj = {
                    MTRMARK: item.MTRMARK ? parseInt(item.MTRMARK) : 0,
                    MTRCATEGORY: item.MTRCATEGORY ? parseInt(item.MTRCATEGORY) : 0,
                    MTRGROUP: item.MTRGROUP ? parseInt(item.MTRGROUP) : 0,
                    CCCSUBGOUP2: item.CCCSUBGOUP2 ? parseInt(item.CCCSUBGOUP2) : 0,
                    MTRMARK_NAME: item.MTRMARK_NAME || '',
                    GROUP_NAME: item.MTRGROUP_NAME || '',
                    MMTRMANFCTR_NAME: item.MMTRMANFCTR_NAME || '',
                    SUBGROUP_NAME: item.CCCSUBGOUP2_NAME || '',
                    CATEGORY_NAME: item.MTRCATEGORY_NAME || '',
                    isSkroutz: item.SKROUTZ == 0 ? false : true,
                    PRICER: item.PRICER ? parseInt(item.PRICER) : 0,
                    PRICEW: item.PRICEW ? parseInt(item.PRICEW) : 0,
                    PRICER02: item.PRICE02 ? parseInt(item.PRICE02) : 0,
                    PRICE05: item.PRICE05 ? parseInt(item.PRICE05) : 0,
                    COST: 0,
                    VAT: item.VAT || '',
                    NAME: item.NAME,
                    MTRMANFCTR: item.MTRMANFCTR,
                    WIDTH: item.WIDTH || "0",
                    HEIGHT: item.HEIGHT || "0",
                    LENGTH: item.LENGTH || "0",
                    GWEIGHT: item.GWEIGHT || "0",
                    VOLUME: item.VOLUME || "0",
                    STOCK: item.STOCK || "0",
                    SOFTONESTATUS: true,
                    ISACTIVE: item.ISACTIVE,
                    CODE: item.CODE || '',
                    CODE1: item.CODE1 || '',
                    CODE2: item.CODE2 || '',
                    MTRUNIT1: item.MTRUNIT1 || '',
                    MTRUNIT3: item.MTRUNIT3 || '',
                    MTRUNIT4: item.MTRUNIT4 || '',
                    DIM1: item.DIM1 || '',
                    DIM2: item.DIM2 || '',
                    DIM3: item.DIM3 || '',
                    MU31: item.MU31 || '',
                    MU41: item.MU41 || '',
                    UPDDATE: item.UPDDATE || '',
                    SOCURRENCY: item.SOCURRENCY || '',
                }

                let find = await SoftoneProduct.findOne({MTRL: item.MTRL})
                if(!find) {
                    let create = await SoftoneProduct.create(obj)
                    console.log('new')
                    console.log(create)
                }
                // let obj = {
                //     MTRMARK: item.MTRMARK ? parseInt(item.MTRMARK) : 0,
                //     MTRCATEGORY: item.MTRCATEGORY ? parseInt(item.MTRCATEGORY) : 0,
                //     MTRGROUP: item.MTRGROUP ? parseInt(item.MTRGROUP) : 0,
                //     CCCSUBGOUP2: item.CCCSUBGOUP2 ? parseInt(item.CCCSUBGOUP2) : 0,
                //     MTRMARK_NAME: item.MTRMARK_NAME || '',
                //     GROUP_NAME: item.MTRGROUP_NAME || '',
                //     MMTRMANFCTR_NAME: item.MMTRMANFCTR_NAME || '',
                //     SUBGROUP_NAME: item.CCCSUBGOUP2_NAME || '',
                //     CATEGORY_NAME: item.MTRCATEGORY_NAME || '',
                //     isSkroutz: item.SKROUTZ == 0 ? false : true,
                // }
                
                // let update = await SoftoneProduct.findOneAndUpdate({MTRL:  item.MTRL}, 
                //     {$set: obj}
                //     )
                // console.log(update)
            }
          
            
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(400).json({ success: false });
        }
    }
    if(action === 'updateProduct2') {
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/getMtrl`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
            })
        });

        let buffer = await translateData(response)
        await connectMongo();
        try {

            for(let item of buffer.result) {
                console.log(item.CCCSUBGOUP2)
                console.log(item.CCCCSUBGOUP2_NAME)
                let obj = {
                    SUBGROUP_NAME: item.CCCCSUBGOUP2_NAME || '',
                }
                
                let update = await SoftoneProduct.findOneAndUpdate({MTRL:  item.MTRL}, 
                    {$set: obj}
                    )
                console.log(update)
            }
          
            
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(400).json({ success: false });
        }
    }

    if(action === 'deleteImages') {
        await connectMongo();
        try {
            let update = await SoftoneProduct.updateMany({}, {
                $set: {
                    images: [],
                    hasImage: false
                }
            })
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(400).json({ success: false });
        }
    }

    if(action === 'fixGroups') {
     
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrGroup/getMtrGroup`
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                company: 1001,
                sodtype: 51,

            })
        });
        let buffer = await translateData(response)
        for(let item of buffer.result) {
            let group = await MtrGroup.findOne({'softOne.MTRGROUP': item.MTRGROUP})
            if(!group) {
                // console.log('groups that doesnt exist')
                // console.log(item)
                let category = await MtrCategory.findOne({'softOne.MTRCATEGORY': item.cccMTRCATEGORY})
                // console.log('category')
                // console.log(category)
                let id = category?._id;
                console.log('id')
                console.log(id)
            
                let obj = {
                    groupName: item.NAME,
                    groupIcon: "",
                    groupImage: "",
                    status: true,
                    softOne: {
                        MTRGROUP: item.MTRGROUP,
                        CODE: item.CODE,
                        NAME: item.NAME,
                        ISACTIVE: item.ISACTIVE,
                        MTRCATEGORY: item.cccMTRCATEGORY,
                    }
                }
                
                let insert = await MtrGroup.create(obj)
                let push = await MtrCategory.findOneAndUpdate({
                    _id: id
                }, {
                    $addToSet: {
                        groups: insert._id
                    }
                }, {
                    new: true
                })
                console.log('push to categories')
                console.log(push)
            }
        }
      
        return res.status(200).json({ success: true });
    }

    if(action === "fixSubgroups") {
        //   add subgroups
        let URL2 = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.cccGroup/getCccGroup`
        const responseSub = await fetch(URL2, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                company: 1001,
                sodtype: 51,

            })
        });
        let buffer2 = await translateData(responseSub)
        for(let item of buffer2.result) {
            let subgroup = await SubMtrGroup.findOne({'softOne.cccSubgroup2': item.cccSubgroup2})
            if(!subgroup) {

                let group = await MtrGroup.findOne({'softOne.MTRGROUP': parseInt(item.MTRGROUP)})
                let id = group?._id;
                let create = await SubMtrGroup.create({
                    group: id,
                    subGroupName: item.name,
                    subGroupIcon: "",
                    subGroupImage: "",
                    softOne: {
                        cccSubgroup2: item.cccSubgroup2,
                        short: item.short,
                        name: item.name,
                        MTRGROUP: item.MTRGROUP,
                    }
                })
                console.log('created sub group')
                console.log(create)

                let push = await MtrGroup.findOneAndUpdate({
                    _id: id
                }, {
                    $addToSet: {
                        subGroups: create._id
                    }
                }, {
                    new: true
                })
                console.log('pushed to groups ')
                console.log(push)
            }
        }
    }

    if(action === "noGroups") {
        let noGroups = []
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/getMtrl`
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                company: 1001,
                sodtype: 51,

            })
        });
        let buffer = await translateData(response)
        for(let item of buffer.result) {
            if(item?.MTRCATEGORY) {
                if(!item?.MTRGROUP) {
                    noGroups.push({
                        name: item.NAME,
                        MTRL: item.MTRL,
                        MTRCATEGORY: item.MTRCATEGORY,
                        group: 'no group'
                    })
                }
            }
        }
        console.log(noGroups)
        return res.status(200).json({ success: true, total: noGroups.length, result: noGroups,});
    }
}






