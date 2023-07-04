import axios from "axios";
import mongoose from "mongoose";

import { MtrGroup, MtrCategory } from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
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
    
    if (action === 'deleteLogo') {
        let {id} = req.body;
		try {
			await connectMongo();
			let resp = await Markes.updateOne({ _id: id }, 
			{ $set: { groupIcon: ''} }
			);
			console.log(resp)
			return res.status(200).json({ success: true, message:'Έγινε update στο λογότυπο', error: null, result: resp });
		} catch (e) {
			return res.status(500).json({ success: false, error:'Δεν έγινε update στο λογότυπο', message: null, result: null });
		}
	}
    if (action === 'deleteImage') {
        let {id} = req.body;
		try {
			await connectMongo();
			let resp = await Markes.updateOne({ _id: id }, 
			{ $set: { groupImage: ''} }
			);
			console.log(resp)
			return res.status(200).json({ success: true, message:'Έγινε update στο λογότυπο', error: null, result: resp });
		} catch (e) {
			return res.status(500).json({ success: false, error:'Δεν έγινε update στο λογότυπο', message: null, result: null });
		}
	}

}



