import axios from "axios";
import mongoose from "mongoose";

import { MtrGroup, MtrCategory } from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
import { object } from "yup";
export default async function handler(req, res) {

	
	///handler for softone catergories
	let action = req.body.action;
	
	

	

    if (action === 'findAll') {
        console.log('find all MtrGroup')
		try {
			await connectMongo();
            const mtrgroup = await MtrGroup.find({})
            .populate({
                path: 'category',
            
            })
            .populate({
                path: 'subGroups',
            
            })
           
                
            // console.log('find all groups: ' + JSON.stringify(mtrgroup))
			return res.status(200).json({ success: true, result: mtrgroup });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}
	if (action === 'findCategoriesNames') {

		try {
			await connectMongo();
			let categories = await MtrCategory.find({}, {_id:0, label:"$categoryName", value: {_id: "$_id", mtrcategory: "$softOne.MTRCATEGORY"}})
			// let categories = await MtrCategory.find({}, {_id:0, categoryName:"$categoryName", value: {_id: "$_id", mtrcategory: "$softOne.MTRCATEGORY"}})
			return res.status(200).json({ success: true, result: categories });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}
    if (action === 'create') {
		try {

            let {data} = req.body
            let id = data.categoryid
            console.log('data: ' + JSON.stringify(data))
			await connectMongo();


            //Find the id of the parent in category 
            const category = await MtrCategory.findOne({_id: id}, {softOne: {MTRCATEGORY: 1}})
            let mtrcategory = category.softOne.MTRCATEGORY
          

            //Create the group in softone 
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrGroup/createMtrGroup`;
            let addedSoftone = await axios.post(URL, {
                username:"Service",
                password:"Service",
                name: data.groupName,
                isactive: 0,
                mtrcategory: mtrcategory,
            })
            if(!addedSoftone.data.success) {
                return res.status(500).json({ success: false, error: 'Αποτυχία εισαγωγής στο Softone', markes: null });
            }
            //retreive the id from the new group created in softone:
            const MTRGROUP = addedSoftone.data.kollerisPim.MTRGROUP;
			const group = await MtrGroup.create({
                category: category._id,
                groupName: data.groupName,
                groupImage: data.groupImage,
                groupIcon: data.groupIcon,
                softOne: {
                    MTRGROUP: MTRGROUP,
                    CODE: MTRGROUP.toString(),
                    NAME: data.groupName,
                    ISACTIVE: 1,
                },
                status: true,
                createdFrom: data?.createdFrom
			})
          
            //after creating the group in mongo, update the category with the new group:
            const updateCategories = await MtrCategory.findOneAndUpdate(
                {_id: category._id},
                { $push: { 
                    groups: [group]
                }}
            )
            console.log('updateCategories: ' + JSON.stringify(updateCategories))
            let categoryName = updateCategories.categoryName
            return res.status(200).json({ success: true, result: group, error: null, parent: categoryName });
                

		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', markes: null });
		}
	}
    if (action === 'update') {
		

		let mtrgroup= req.body.mtrgroup;
        let mtrcategory = req.body.mtrcategory;
        let originalCategory = req.body.originalCategory
		let body = req.body.data;

        //id of the group:
        let id = req.body.id

        console.log('group id: ' + id)
	
        let obj = {
            category: body.categoryid,
            groupName: body.groupName,
            groupIcon: body.groupIcon,
            groupImage: body.groupImage,
            softOne: body.softOne,
            status: true,
            localized: body.localized,
            updatedFrom: body?.updatedFrom,

        }

        console.log('obj: ' + JSON.stringify(obj))
        // let sonftoneObj = {
        //     mtrgroup: parseInt(mtrgroup),
        //     username: "Service",
        //     password: "Service",
        //     name: body.groupName,
        //     company: '1001',
        //     mtrcategory:  parseInt(mtrcategory),
        // }
        // console.log('sonftoneObj: ' + JSON.stringify(sonftoneObj))
   
		// if(body?.groupName) {
		// 	let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrGroup/updateMtrGroup`;
		// 	let softoneResponse = await axios.post(URL, {...sonftoneObj})
        //     console.log('softoneResponse: ' + JSON.stringify(softoneResponse.data))
            
		// }
		
       
		try {
			await connectMongo();
            const updatedGroup = await MtrGroup.findOneAndUpdate(
                { _id: id  },
                obj,
                { new: true }
              );

            const updatedCategory = await MtrCategory.updateOne({_id: body.categoryid}, {$push: {groups: id}})
            const pull = await MtrCategory.updateOne({_id: originalCategory}, {$pull: {groups: id}})
            let message;


            if(updatedCategory) {
                message = `Η κατηγορία ${body.category.categoryName} ενημερώθηκε. Μία εγγραφή προστέθηκε στην κατηγορία`
            }
           
            console.log('result: ' + JSON.stringify(updatedGroup ))
			return res.status(200).json({ success: true, result: updatedGroup, message: message });
		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', result: null });
		}
    
	
		
	

	}
   

}



