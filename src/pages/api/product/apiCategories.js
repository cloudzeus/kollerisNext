import axios from "axios";
import mongoose from "mongoose";

import { MtrGroup, MtrCategory, SubMtrGroup } from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
import GridIconTemplate from "@/components/grid/gridIconTemplate";
export default async function handler(req, res) {


	///handler for softone catergories
	let action = req.body.action;

	if (action === 'create') {
		console.log('create')
		let { data } = req.body;
		console.log(data)
		try {

			let softoneobj = {
				username:"Service",
				password:"Service",
				name: data.categoryName,
				isactive:1
			}
			let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrCategory/createMtrCategory`;
            let addedSoftone = await axios.post(URL, softoneobj)
            if(!addedSoftone.data.success) {return res.status(500).json({ success: false, error: 'Αποτυχία εισαγωγής στο Softone' })}

			let createobj ={
				...data,
				softOne: {
					MTRCATEGORY: addedSoftone.data.kollerisPim.MTRCATEGORY,
					CODE: addedSoftone.data.kollerisPim.CODE,
					NAME: data.categoryName,
					ISACTIVE: 1,
				},
				status: true,
			}
			await connectMongo();
			const category = await MtrCategory.create({ ...createobj})

			if (category) {
				return res.status(200).json({ success: true, result: category });
			} else {
				return res.status(200).json({ success: false, result: null });
			}

		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', result: null });
		}
	}

	if (action === 'findAll') {
        console.log('find all')

		try {
			await connectMongo();
			let categories = await MtrCategory.find({})
				.populate({
					path: 'groups',
					populate: { path: 'subGroups' }
				});
            // console.log('categories 2 ' + JSON.stringify(categories))
			return res.status(200).json({ success: true, result: categories });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}
	if(action === 'update') {
		console.log('update')
		let { data } = req.body;
		let {id} = req.body
		// let {softoneID} = req.body
		// console.log(data)
		console.log(id)
		// console.log(softoneID)

		let softoneobj = {
			mtrcategory : data.softOne.MTRCATEGORY,
			username:"Service",
			password:"Service",
			name:data.categoryName,
			company:1001
		}

		try {

			console.log(softoneobj)
			let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrCategory/updateMtrCategory`;
			let  softone = await axios.post(URL, softoneobj)
			console.log(softone.data)
			// if(!softone.data.success) {
			// 	return res.status(500).json({ success: false, error: 'Αποτυχία update στο Softone' })
			// }
			await connectMongo();
			const updatecategory = await MtrCategory.findOneAndUpdate(
                { _id: id  },
                data,
                { new: true }
              );
			return res.status(200).json({ success: true, result: updatecategory });
		} catch(e) {
			return res.status(400).json({ success: false, result: null });
		}
	}
	if (action === 'syncCategories') {
		try {
			await connectMongo();
			let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrCategory/getMtrCategory`;
			console.log(URL)
			let { data } = await axios.get(URL)
			let array = []
			for (let category of data.result) {
				let object = {
					categoryName: '',
					categoryIcon: '',
					categoryImage: '',
					softOne: {
						MTRCATEGORY: category.MTRCATEGORY,
						CODE: category.CODE,
						NAME: category.NAME,
						ISACTIVE: category.ISACTIVE
					},
					localized: [{
							locale: 'en-US',
							name: 'English',
							description: 'English',
					}],
				}
				array.push(object)

			}
			let res = await MtrCategory.insertMany(array)
			console.log('res ' + res)
			// return res.status(200).json({ success: true, result: res });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}

	if(action === "translate") {
		let data = req.body.data;
		console.log('------------------------------------------------')

		let {id, fieldName, index} = req.body
		

		try {
			await connectMongo();


			const category = await MtrCategory.findOne({ _id: id  });
			if(category.localized.length == 0) {
				category.localized.push({
					fieldName: fieldName,
					translations: data
				})

				

			} 

			if(category.localized.length > 0) {
				category.localized.map((item) => {
					if(item.fieldName == fieldName) {
						item.translations = data;
					}
					return item;
				})
			
				
			}
			const categoryUpdate = await MtrCategory.updateOne(
				{_id: id},
				{$set: {localized: category.localized}}
			  	);

			return res.status(200).json({ success: true, result: categoryUpdate  });
		} catch(e) {
			return res.status(400).json({ success: false, result: null });
		}
	}

	
}




