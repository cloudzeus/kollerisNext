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
            const subgroup = await SubMtrGroup.find({})
            .populate( 'group', 'groupName')
            
            
            console.log('find all groups: ' + JSON.stringify(subgroup))
			return res.status(200).json({ success: true, result: subgroup });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}

    if (action === 'findGroupNames') {

		try {
			await connectMongo();
			let categories = await MtrGroup.find({}, {_id:0, label:"$groupName", value: {_id: "$_id", mtrgroup: "$softOne.MTRGROUP"}})
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
	
    if (action === 'update') {
      

       
        let {originalGroup, cccSubgroup2} = req.body
        let body = req.body.data;
        let mtrgroupid;
        let subgroupid = req.body.id
        let originalGroupID = originalGroup._id
        let newGroupID = body.groupid || originalGroupID
       
        
        try {
            //find mtrgroup id to update softone
            await connectMongo();
            const softonegroupid = await MtrGroup.findOne({_id: originalGroupID}, {softOne: {MTRGROUP: 1, NAME: 1}})
            console.log(softonegroupid) 
            mtrgroupid = softonegroupid.softOne.MTRGROUP
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
	

        // // console.log('group id: ' + id)
	
        let obj = {
            group: newGroupID,
            subGroupName: body.subGroupName,
            subGroupIcon: body.subGroupIcon,
            subGroupImage: body.subGroupImage,
            softOne: body.softOne,
            status: true,
            localized: body.localized,
            updatedFrom: body?.updatedFrom,

        }

        console.log('obj: ' + JSON.stringify(obj))
        let sonftoneObj = {
            username:"Service",
            password: "Service",
            cccSubgroup2: cccSubgroup2,
            short: cccSubgroup2,
            name: body.subGroupName,
            mtrgroup: mtrgroupid,
        }

		if(body?.subGroupName) {
            console.log('1')
			let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.cccGroup/updateCccGroup`;
			let softoneResponse = await axios.post(URL, {...sonftoneObj})
            console.log('softoneResponse: ' + JSON.stringify(softoneResponse.data))
            if(!softoneResponse.data.success) {
                return res.status(500).json({ success: false, error: 'Αποτυχία εισαγωγής στο Softone' });
            }
		}
		
       
		try {
			await connectMongo();
            const updatedsubGroup = await SubMtrGroup.findOneAndUpdate(
                { _id: subgroupid  },
                obj,
                { new: true }
              );
            console.log('updatedsubGroup: ' + JSON.stringify(updatedsubGroup))
            return res.status(200).json({ success: true, result: updatedsubGroup, error: null });
            // const updatedGroup= await MtrGroup.updateOne({_id: body.groupid}, {$push: {groups: id}})
            // const pull = await MtrGroup.updateOne({_id: originalCategory}, {$pull: {groups: id}})
            // let message;


            // if(updatedCategory) {
            //     message = `Η κατηγορία ${body.category.categoryName} ενημερώθηκε. Μία εγγραφή προστέθηκε στην κατηγορία`
            // }
           console.log('sefsfef')
			// return res.status(200).json({ success: true, result: updatedGroup, message: message });
		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', result: null });
		}
    
	
		
	

	}
	
    if (action === 'delete') {
        try {
            let id = req.body.id;
            const updatedsubGroup = await SubMtrGroup.findOneAndUpdate(
                { _id: id  },
                {status: false},
                { new: true }
              );
            return res.status(200).json({ success: true, result: updatedsubGroup, error: null });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }

    }
}



