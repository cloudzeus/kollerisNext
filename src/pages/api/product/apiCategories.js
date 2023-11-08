import axios from "axios";

import { MtrGroup, MtrCategory, SubMtrGroup } from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";

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
		const { data, updatedFrom } = req.body;

		let {id} = req.body
	

		let softoneobj = {
			mtrcategory : data.softOne.MTRCATEGORY,
			username:"Service",
			password:"Service",
			name:data.categoryName,
			company:1001
		}

		try {

			let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrCategory/updateMtrCategory`;
			let  softone = await axios.post(URL, softoneobj)
			// if(!softone.data.success) {
			// 	return res.status(500).json({ success: false, error: 'Αποτυχία update στο Softone' })
			// }
			await connectMongo();
			const updatecategory = await MtrCategory.findOneAndUpdate(
                { _id: id  },
               {
				...data, updatedFrom: updatedFrom,
			   },
                { new: true }
              );
			return res.status(200).json({ success: true, result: updatecategory });
		} catch(e) {
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
	// if (action === 'updateImages') {
		
	// 	const {images, updatedFrom, id } = req.body

	// 	console.log(images, updatedFrom, id)
	// 	const filter = { _id: id };
	// 	const update = { $set:  { photosPromoList: images,  updatedFrom: updatedFrom}  };
	// 	try {
	// 		await connectMongo();
	// 		const result = await MtrCategory.updateOne(filter, update);
	// 		console.log(result)
			
	// 		return res.status(200).json({ success: true, result: result });
	// 	} catch (error) {
	// 		return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', markes: null });
	// 	}
    

	// }


	if(action === "getImages") {
		const {id, createNew} = req.body;
		console.log(id)
		try {
			await connectMongo();
			const category = await MtrCategory.findOne({_id: id}, {categoryImage: 1, categoryIcon: 1, _id: 0});
			console.log(category)
			return res.status(200).json({ success: true, result: category });
		} catch (e) {

		}
	}
	if(action === "addImage") {
		const { imageName, id} = req.body;
		try {
			await connectMongo();
			let add = await MtrCategory.findOneAndUpdate(
				{_id: id},
				{$set : {
					categoryImage: imageName
				}}	
			  	);
				console.log('add')
			console.log(add)
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
			let deleted = await MtrCategory.findOneAndUpdate(
				{_id: id},
				{$set : {
					categoryImage: ''
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
			let add = await MtrCategory.findOneAndUpdate(
				{_id: id},
				{$set : {
					categoryIcon: imageName
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
			let deleted = await MtrCategory.findOneAndUpdate(
				{_id: id},
				{$set : {
					categoryIcon: ''
				}}	
			  	);

			console.log(deleted)
			return res.status(200).json({ success: true, result: deleted  });
		} catch (e) {	
			return res.status(400).json({ success: false, result: null });
		}
	} 


	
	
}




