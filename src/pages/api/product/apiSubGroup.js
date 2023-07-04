import axios from "axios";
import mongoose from "mongoose";

import { MtrGroup, MtrCategory, SubMtrGroup } from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
export default async function handler(req, res) {

	
	///handler for softone catergories
	let action = req.body.action;
	
    if (action === 'findAll') {
        console.log('find all SubGroups')
		try {
			await connectMongo();
            const mtrgroup = await SubMtrGroup.find({})
            // console.log('find all groups: ' + JSON.stringify(mtrgroup))
			return res.status(200).json({ success: true, result: mtrgroup });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}

    if (action === 'findGroupNames') {

		try {
			await connectMongo();
			let categories = await MtrGroup.find({}, {_id:0, label:"$groupName", value: {_id: "$_id", mtrgroup: "$softOne.MTRGROUP"}})
            console.log(categories)
			return res.status(200).json({ success: true, result: categories });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}

    if (action === 'create') {
		try {

            let {data} = req.body
            let groupid = data.groupid
          
			await connectMongo();

            //Find the id of the parent 
            const group = await  MtrGroup.findOne({_id: groupid}, {softOne: {MTRGROUP: 1, NAME: 1}})
            //id used to create the subgroup in softone
            let mtrgroup = group.softOne.MTRGROUP
            let groupName = group.softOne.NAME
            console.log('mtrgroup: ' + JSON.stringify(mtrgroup))
            console.log('groupName: ' + JSON.stringify(groupName))
          

            // Create the subgroup in softone 
            // let softoneObj = {
            //     username:"Service",
            //     password:"Service",
            //     name: data.subGroupName,
            //     mtrgroup:  mtrgroup,
            // }
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.cccGroup/createCccGroup`;
            let addedSoftone = await axios.post(URL, {
                username:"Service",
                password:"Service",
                name: data.subGroupName,
                mtrgroup:  mtrgroup,
            })

            console.log(addedSoftone.data)

            if(!addedSoftone.data.success) {
                return res.status(500).json({ success: false, error: 'Αποτυχία εισαγωγής στο Softone' });
            }
            // //retreive the id from the new group created in softone:
            const cccSubgroup2 = addedSoftone.data.kollerisPim.cccSubgroup2;
			const subgroup = await SubMtrGroup.create({
                group: groupid,
                subGroupName: data.subGroupName,
                subGroupIcon: data.subGroupIcon,
                subGroupImage: data.subGroupImage,
                softOne: {
                    cccSubgroup2: cccSubgroup2,
                    short: cccSubgroup2.toString(),
                    name: data.subGroupName,
                  
                },
                status: true,
                createdFrom: data?.createdFrom
			})
            // //after creating the group in mongo, update the category with the new group:
            const updateGroups = await MtrGroup.findOneAndUpdate(
                {_id: groupid},
                { $push: { 
                    subGroups: [subgroup ]
                }}
            )
            console.log(updateGroups)
            let parentName = updateGroups.groupName
            return res.status(200).json({ success: true, result: group, error: null, parent: parentName  });
                

		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', markes: null });
		}
	}
	

	

}



