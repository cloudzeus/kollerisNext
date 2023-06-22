import axios from "axios";
import mongoose from "mongoose";

import { MtrGroup, MtrCategory, SubMtrGroup } from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
export default async function handler(req, res) {


	///handler for softone catergories
	let action = req.body.action;

	if (action === 'create') {
		let { data } = req.body;
		try {
			await connectMongo();
			const category = await MtrCategory.create({
				...data
			})

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
            console.log('categories 2 ' + JSON.stringify(categories))
			return res.status(200).json({ success: true, result: categories });
		} catch (e) {
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

}



