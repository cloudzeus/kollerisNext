import axios from "axios";
import mongoose from "mongoose";

import { MtrGroup, MtrCategory } from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
import { object } from "yup";
import { original } from "@reduxjs/toolkit";
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
        const {originalCategory, newCategory, data, groupid} = req.body;
        console.log(data)
        console.log('GROUP ID')
        console.log(groupid)
        //CONSTRUCT OBJECT TO UPDATE MONGO DB:
        let obj = {
            category: originalCategory,
            groupName:data.groupName,
            softOne: data.softOne,
            updatedFrom: data?.updatedFrom,
            englishName: data.englishName,
        }
        //CONSTRUCT OBJECT TO UPDATE SOFTONE:
        let sonftoneObj = {
            mtrgroup: data.softOne.MTRGROUP,
            username: "Service",
            password: "Service",
            name: data.softOne.NAME,
            company: '1001',
            mtrcategory: data.category.softOne.MTRCATEGORY,
        }
        //UPDATE SOFTONE:
		if(data.softOne.NAME) {
			let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrGroup/updateMtrGroup`;
			let softoneResponse = await axios.post(URL, {...sonftoneObj})
            console.log('softoneResponse: ' + JSON.stringify(softoneResponse.data))
            
		}
		
       
		try {
			await connectMongo();
            const updatedGroup = await MtrGroup.findOneAndUpdate(
                { _id: groupid },
                obj,
                { new: true }
              );
            
            // WHEN we change the category of the grou we need to push it to the new category, and pull it from the old category
            const updatedCategory = await MtrCategory.updateOne({_id: newCategory}, {$push: {groups: groupid}})
            const pull = await MtrCategory.updateOne({_id: originalCategory}, {$pull: {groups: groupid}})
         
            let message;


            if(updatedCategory) {
                message = `Η κατηγορία ενημερώθηκε. Μία εγγραφή προστέθηκε στην νέα κατηγορία`
            }
            if(pull) {
                message += ` Επιτυχής αφαίρεση από την παλιά κατηγορία ${data.category.softOne.NAME} `
            }
           
			return res.status(200).json({ success: true, result: updatedGroup, message: message });
		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', result: null });
		}
    
	
		
	

	}
   
    

    if(action === "getImages") {
		const {id} = req.body;
		console.log(id)
		try {
			await connectMongo();
			const category = await MtrGroup.findOne({_id: id}, {groupImage: 1, groupIcon: 1, _id: 0});
			console.log(category)
			return res.status(200).json({ success: true, result: category });
		} catch (e) {

		}
	}
	if(action === "addImage") {
		const { imageName, id} = req.body;
        console.log('image Name')
        console.log(imageName)
        console.log('id')
        console.log(id)
		try {
			await connectMongo();
			let add = await MtrGroup.findOneAndUpdate(
				{_id: id},
				{$set : {
					groupImage: imageName
				}}	
			  	);
			
			return res.status(200).json({ success: true, result: add  });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}
	if(action === 'deleteImage') {
		const {id} = req.body;
		console.log(id)
		try {
			await connectMongo();
			let deleted = await  MtrGroup.findOneAndUpdate(
				{_id: id},
				{$set : {
					groupImage: ''
				}}	
			  	);
			console.log(deleted)
			return res.status(200).json({ success: true, result: deleted  });
		} catch (e) {	
			return res.status(400).json({ success: false, result: null });
		}
	} 

	if(action === "addLogo") {
		const { imageName, id} = req.body;
		try {
			await connectMongo();
			let add = await MtrGroup.findOneAndUpdate(
				{_id: id},
				{$set : {
					groupIcon: imageName
				}}	
			  	);
			
			return res.status(200).json({ success: true, result: add  });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}
	if(action === 'deleteLogo') {
		const {id} = req.body;
		console.log('delete logo')
		console.log(id)
		try {
			await connectMongo();
			let deleted = await  MtrGroup.findOneAndUpdate(
				{_id: id},
				{$set : {
					groupIcon: ''
				}}	
			  	);

			console.log(deleted)
			return res.status(200).json({ success: true, result: deleted  });
		} catch (e) {	
			return res.status(400).json({ success: false, result: null });
		}
	} 

}



