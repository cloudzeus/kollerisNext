import axios from "axios";
import mongoose from "mongoose";
import translateData from "@/utils/translateDataIconv";
import { MtrCategory, MtrGroup, SubMtrGroup } from "../../../server/models/categoriesModel";
import connectMongo from "../../../server/config";
export default async function handler(req, res) {
    let action = req.body.action;
    if (action === 'category') {
        try {

            await connectMongo();
            const category = await MtrCategory.create({ ...req.body })
            console.log(category)
            res.status(200).json({ success: true, result: category.data });

        } catch (e) {
            console.log('error: ' + e)
            return res.status(400).json({ success: false, result: null });
        }
    }
    if (action === 'group') {
        console.log('create group')
        try {
            await connectMongo();
            const group = await MtrGroup.create({ ...req.body })

            const updateCategories = await MtrCategory.findOneAndUpdate(
                {_id: req.body.category},
                { $push: { 
                    groups: [group]
                }}
            )
            
            res.status(200).json({ success: true, result: group.data });

        } catch (e) {
            console.log('error: ' + e)
            return res.status(400).json({ success: false, result: null });
        }
    }
    if (action === 'subgroup') {
        console.log('create sub group')
        try {
            await connectMongo();
            const subgroup = await SubMtrGroup.create({ ...req.body })
            const updateGroups = await MtrGroup.findOneAndUpdate(
                {_id: req.body.group},
                { $push: { 
                    subGroups: [subgroup]
                }}
            )
            console.log('updateGroups: ' + JSON.stringify(updateGroups))
            res.status(200).json({ success: true, result: subgroup.data });

        } catch (e) {
            console.log('error: ' + e)
            return res.status(400).json({ success: false, result: null });
        }
    }
    

    if(action === "createCategories") {
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
            let insert = await MtrCategory.insertMany(newArray, {upsert: true})
            console.log(insert)


        } catch (e) {
            console.log(e)
        }


    }
    if(action === "createGroups") {
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrGroup/getMtrGroup`
        console.log('createCategories')
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
        console.log(buffer);

        await connectMongo();
        let newArray = [];
        buffer.result.map((item) => {
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
           newArray.push(obj)
        })
        let insert = await MtrGroup.insertMany(newArray, {upsert: true})
        console.log(insert)

    }

    if(action === "createSubGroups") {
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
        
        let newArray = [];
        buffer.result.map((item) => {
              let obj = {
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
              newArray.push(obj)

        })
        let insert = await SubMtrGroup.insertMany(newArray, {upsert: true})
        console.log(insert)
        return res.status(200).json({ success: true});
    }

    if(action === "createRelationships") {
        await connectMongo();
       
        // let findGroups = await MtrGroup.find({})
        // for(let item of findGroups) {
        //     let id = item.softOne.MTRCATEGORY;
        //     let findCategory = await MtrCategory.findOne({'softOne.MTRCATEGORY': id})
        //     console.log(findCategory)
        //     const updateCategories = await MtrCategory.findOneAndUpdate(
        //         {_id: findCategory._id},
        //         { $push: { 
        //             groups: [item._id]
        //         }}
        //     )
        // }
        let findGroups = await SubMtrGroup.find({})
        for(let item of findGroups) {
            let id = item.softOne.MTRGROUP;
            let findCategory = await MtrGroup.findOne({'softOne.MTRGROUP': id})
         
            const updateCategories = await MtrGroup.findOneAndUpdate(
                {_id: findCategory._id},
                { $push: { 
                    subGroups : [item._id]
                }}
            )
        }
        console.log(updateCategories)
        
        return res.status(200).json({ success: true});
        
    
    
    }

}   

