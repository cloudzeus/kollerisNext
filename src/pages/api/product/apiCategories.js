import axios from "axios";
import mongoose from "mongoose";

import { MtrGroup, MtrCategory, SubMtrGroup } from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
export default async function handler(req, res) {

	
	///handler for softone catergories
	let action = req.body.action;

	if (action === 'create') {
		let {data} = req.body;
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
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής',  result: null });
		}
	}
	
	if (action === 'findAll') {
		console.log('find all')

		try {

			let categories = await MtrCategory.find({})
			.populate({
				path: 'groups',
				populate: { path: 'subGroups' }
			  });

			return res.status(200).json({ success: true, result: categories });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}

	

}



