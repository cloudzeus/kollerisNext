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



    if (action === 'fixGroups') {

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
        for (let item of buffer.result) {
            let group = await MtrGroup.findOne({ 'softOne.MTRGROUP': item.MTRGROUP })
            if (!group) {
                // console.log('groups that doesnt exist')
                // console.log(item)
                let category = await MtrCategory.findOne({ 'softOne.MTRCATEGORY': item.cccMTRCATEGORY })
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

    if (action === "fixSubgroups") {
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
        for (let item of buffer2.result) {
            let subgroup = await SubMtrGroup.findOne({ 'softOne.cccSubgroup2': item.cccSubgroup2 })
            if (!subgroup) {

                let group = await MtrGroup.findOne({ 'softOne.MTRGROUP': parseInt(item.MTRGROUP) })
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

    if (action === "noGroups") {
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
        for (let item of buffer.result) {
            if (item?.MTRCATEGORY) {
                if (!item?.MTRGROUP) {
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
        return res.status(200).json({ success: true, total: noGroups.length, result: noGroups, });
    }

    if (action === 'updateCol') {

        await connectMongo();
        let updateisActive = await SoftoneProduct.updateMany(
            { ISACTIVE: { $exists: true } }, // Filter documents where the field exists
            [
              {
                $set: {
                  ISACTIVE: {
                    $cond: {
                      if: { $eq: ["$ISACTIVE", "1"] }, // Check if the value is "true"
                      then: true,
                      else: false,
                    },
                  },
                },
              },
            ]
        )
        console.log(updateisActive)
        return res.status(200).json({ success: true, result: updateisActive });
    }


}






