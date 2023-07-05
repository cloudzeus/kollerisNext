import axios from "axios";
import mongoose from "mongoose";

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
}



