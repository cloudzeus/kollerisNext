import axios from "axios";
import mongoose from "mongoose";

import { MtrGroup, MtrCategory, SubMtrGroup } from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
export default async function handler(req, res) {

	
	///handler for softone catergories
	let action = req.body.action;
	
	

	if (action === 'create') {
		console.log('create')
		const {groupName} = req.body
		try {
			await connectMongo();
            //find category to retreive id:
            const group = await MtrGroup.findOne({groupName: groupName})
            if(!group) {
                return res.status(500).json({ success: false, error: 'Δεν βρέθηκε κατηγορία εισαγωγής', markes: null });
            }

            console.log('group' + JSON.stringify(group))
            
			const subgroup = await  SubMtrGroup.create({
				group: group._id,
                ...req.body.data,
                
			})
            console.log('subgroup: ' +  JSON.stringify(subgroup))
            
            const updateGroup = await MtrGroup.findOneAndUpdate(
                {_id: group._id},
                { $push: { 
                    subGroups: [subgroup]
                }}
            )
            
            console.log('updateCategories: ' +  JSON.stringify(updateGroup))
           if(!updateGroup) {
			return res.status(200).json({ success: false, result: null, error: 'Αποτυχία update στο MtrGroup', updateResult: null});
		   }
        
            return res.status(200).json({ success: true, result: group, error: null, updateResult: updateGroup  });
          

		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', markes: null });
		}
	}
	

	

}



