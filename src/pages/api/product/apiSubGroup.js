import axios from "axios";

import { MtrGroup, MtrCategory, SubMtrGroup } from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
export default async function handler(req, res) {

	
	///handler for softone catergories
	let action = req.body.action;
	
    if (action === 'findAll') {
		try {
			await connectMongo();
            const subgroup = await SubMtrGroup.find({})
            .populate( 'group', 'groupName')
            
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
       
          

         
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.cccGroup/createCccGroup`;
            let addedSoftone = await axios.post(URL, {
                username:"Service",
                password:"Service",
                name: data.subGroupName,
                mtrgroup:  mtrgroup,
            })


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
            let parentName = updateGroups.groupName
            return res.status(200).json({ success: true, result: group, error: null, parent: parentName  });
                

		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', markes: null });
		}
	}
	
    if (action === 'update') {
      

       
        const {originalGroup, cccSubgroup2, data, originalSubGroupName, id} = req.body
        // let body = req.body.data;
        let mtrgroupid;
        let subgroupid = id
        let originalGroupID = originalGroup._id
        let newGroupID = data.groupid || originalGroupID
        
    
        try {
            //find mtrgroup id to update softone
            await connectMongo();
            const softonegroupid = await MtrGroup.findOne({_id: originalGroupID}, {softOne: {MTRGROUP: 1, NAME: 1}})
            mtrgroupid = softonegroupid.softOne.MTRGROUP
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
	

	
        let obj = {
            group: newGroupID,
            subGroupName: data.subGroupName,
            softOne: data.softOne,
            status: true,
            updatedFrom: data.updatedFrom,
            englishName: data.englishName,
        }

        let sonftoneObj = {
            username:"Service",
            password: "Service",
            cccSubgroup2: cccSubgroup2,
            short: cccSubgroup2,
            name: data.subGroupName,
            mtrgroup: mtrgroupid,
          
        }

		if(data?.subGroupName !== originalSubGroupName) {
			let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.cccGroup/updateCccGroup`;
			let softoneResponse = await axios.post(URL, {...sonftoneObj})
            if(!softoneResponse.data.success) {
                return res.status(500).json({ success: false, error: 'Αποτυχία εισαγωγής στο Softone' });
            }
		}
		
       
		try {
			await connectMongo();
            const updatedsubGroup = await SubMtrGroup.updateOne(
                { _id: subgroupid  },
                obj,
              );
            const updatedGroup = await MtrGroup.findOneAndUpdate({_id: newGroupID}, {$push: {subGroups: subgroupid}})
            const pull = await MtrGroup.findOneAndUpdate({_id: originalGroupID}, {$pull: {subGroups:subgroupid}})

            let message;


            if(updatedGroup) {
                message = `Μία εγγραφή προστέθηκε στην κατηγορία ${pull.groupName}.
                Μια εγγραφή αφαιρέθηκε από την κατηγορία ${updatedGroup.groupName}`
                
            }
			return res.status(200).json({ success: true, result: updatedsubGroup, message: message});
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

    if(action === "getImages") {
		const {id} = req.body;
		try {
			await connectMongo();
			const result = await SubMtrGroup.findOne({_id: id}, {subGroupImage: 1, subGroupIcon: 1, _id: 0});
			return res.status(200).json({ success: true, result: result });
		} catch (e) {

		}
	}
	if(action === "addImage") {
		const { imageName, id} = req.body;
        
		try {
			await connectMongo();
			let add = await SubMtrGroup.findOneAndUpdate(
				{_id: id},
				{$set : {
					subGroupImage: imageName
				}}	
			  	);
			
			return res.status(200).json({ success: true, result: add  });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}
	if(action === 'deleteImage') {
		const {id} = req.body;
		try {
			await connectMongo();
			let deleted = await  SubMtrGroup.findOneAndUpdate(
				{_id: id},
				{$set : {
					subGroupImage: ''
				}}	
			  	);
			return res.status(200).json({ success: true, result: deleted  });
		} catch (e) {	
			return res.status(400).json({ success: false, result: null });
		}
	} 

    if(action === "addLogo") {
		const { imageName, id} = req.body;
		try {
			await connectMongo();
			let add = await SubMtrGroup.findOneAndUpdate(
				{_id: id},
				{$set : {
					subGroupIcon: imageName
				}}	
			  	);
			
			return res.status(200).json({ success: true, result: add  });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}
	if(action === 'deleteLogo') {
		const {id} = req.body;
	
		try {
			await connectMongo();
			let deleted = await  SubMtrGroup.findOneAndUpdate(
				{_id: id},
				{$set : {
					subGroupIcon: ''
				}}	
			  	);

			return res.status(200).json({ success: true, result: deleted  });
		} catch (e) {	
			return res.status(400).json({ success: false, result: null });
		}
	} 


   
}



