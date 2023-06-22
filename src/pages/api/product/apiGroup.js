import axios from "axios";
import mongoose from "mongoose";

import { MtrGroup, MtrCategory } from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
export default async function handler(req, res) {

	
	///handler for softone catergories
	let action = req.body.action;
	
	

	if (action === 'create') {
		try {
			await connectMongo();
            //find category to retreive id:
            const category = await MtrCategory.findOne({categoryName: req.body.categoryName})
            if(!category) {
                return res.status(500).json({ success: false, error: 'Δεν βρέθηκε κατηγορία εισαγωγής', markes: null });
            }

            console.log('category' + JSON.stringify(category))
            
			const group = await MtrGroup.create({
                category: category._id,
                ...req.body.data,
                
			})
            console.log('group: ' +  JSON.stringify(group))
            
            const updateCategories = await MtrCategory.findOneAndUpdate(
                {_id: category._id},
                { $push: { 
                    groups: [group]
                }}
            )
            
            console.log('updateCategories: ' +  JSON.stringify(updateCategories))
           
        
            return res.status(200).json({ success: true, result: group, error: null });
          

		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', markes: null });
		}
	}
	


	

}



