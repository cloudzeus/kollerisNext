import axios from "axios";

import connectMongo from "../../../../server/config";
import {MTRCATEGORY} from "../../../../server/models/categoriesModel";
export default async function handler(req, res) {


	///handler for softone catergories
	let action = req.body.action;
	if (action === 'findOne') {
		console.log('findOne in MtrCategorySchema')
		console.log(req.body.id)
		try {
			await connectMongo();
			const category = await MTRCATEGORY.find({ _id: req.body.id });
			if (category) {
				return res.status(200).json({ success: true, result: category });
			}
			else {
				return res.status(200).json({ success: false, result: null });
			}


		} catch (error) {
			return res.status(400).json({ success: false, error: 'failed to fetch MtrCategorySchema ', markes: null });
		}
	}

	if (action === 'findAll') {
		try {
			await connectMongo();
			const category  = await MTRCATEGORY.find({});
			if (category ) {
				// console.log(markes)
				return res.status(200).json({ success: true, result: category  });

			}
			else {
				return res.status(200).json({ success: false, result: null,  error: 'Αποτυχία εύρεση MtrCategory'});
			}


		} catch (error) {
			return res.status(400).json({ success: false, result: null, error: 'failed to fetch user' });
		}

	}

	if (action === 'create') {
		console.log('create')
		console.log(MTRCATEGORY)
		let { data } = req.body
		try {
			//Change url:
			// let URL = `https://${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/createMtrMark`;
			// let softoneResponse = await axios.post(URL, {
			// 	username: 'Service',
			// 	password: 'Service',
			// 	company: '1001',
			// 	sodtype: '51',
			// 	name: data.name
			// })

			// if (!softoneResponse.data.success) {
			// 	return res.status(200).json({ success: false, markes: null, error: 'Αποτυχία εισαγωγής στο softone' });
			// }

			// console.log('softone response data')
			// console.log(softoneResponse.data)
			// let SOFTONE_MTRMARK = softoneResponse.data.kollerisPim.mtrcode
			// console.log(SOFTONE_MTRMARK)


			const object = {
				categoryName: 'Example Category',
				categoryIcon: 'example-icon.png',
				categoryImage: 'example-image.png',
				softOne: {
				  MTRCATEGORY: 123,
				  CODE: 'ABC',
				  NAME: 'SoftOne',
				  ISACTIVE: true
				},
				localized: [
				  {
					locale: 'en',
					name: 'English Name',
					description: 'English Description'
				  },
				  {
					locale: 'fr',
					name: 'French Name',
					description: 'French Description'
				  }
				]
			}

			console.log('object')
			console.log(object)
			const newMtrCategorySchema = await MTRCATEGORY.create({
				...object,
			});
			
			console.log(newMtrCategorySchema)
			if(newMtrCategorySchema) {
				return res.status(200).json({ success: true, result: newMtrCategorySchema , error: null });
			} else {
				return res.status(200).json({ success: false, result: null, error: 'Αποτυχία εισαγωγής στη βάση δεδομένων' });
			}
			
			// if (softoneResponse.data.success) {
			// 	await connectMongo();
			// 	const newMtrCategorySchema  = await MTRCATEGORY.create({
			// 		...object,
			// 	});


			// 	if (newMtrCategorySchema ) {
			// 		return res.status(200).json({ success: true, markes: newMtrCategorySchema , error: null });

			// 	} else {
			// 		return res.status(200).json({ success: false, markes: null, error: 'Αποτυχία εισαγωγής στη βάση δεδομένων' });
			// 	}
			// }



		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', markes: null });
		}
	}
	if (action === 'createMany') {
		let { data } = req.body
	

		let newArray = [];
		for (let item of data) {


			const object = {
				name: '',
				description: '',
				logo: '',
				videoPromoList: [],
				photoPromoList: [],
				pimAccess: {
					pimUrl: '',
					pimUserName: '',
					pimPassword: ''
				},
				webSiteUrl: '',
				officialCatalogueUrl: '',
				facebookUrl: '',
				instagramUrl: '',
				softOne: {
					...item
				},
			}

			newArray.push(object)
		}

		console.log('Array to insert in Mongo')
		console.log(newArray)


		try {
			await connectMongo();
			const newMtrCategorySchema  = await MTRCATEGORY.insertMany(newArray);

			console.log('Softone MtrCategorySchema  Inserted Successfully', JSON.stringify(newMtrCategorySchema ))
			if (newMtrCategorySchema ) {
				return res.status(200).json({ success: true, result: newMtrCategorySchema  });

			} else {
				return res.status(200).json({ success: false, result: null });
			}
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}


	}
	if (action === 'update') {
		// await connectMongo();
		let body = req.body.data;
		console.log('body data')
		const updateBody = {
			categoryName: 'Example Category',
			categoryIcon: 'example-icon.png',
			categoryImage: 'example-image.png',
			softOne: {
			  MTRCATEGORY: 123,
			  CODE: 'ABC',
			  NAME: 'SoftOne',
			  ISACTIVE: true
			},
			localized: [
			  {
				locale: 'en',
				name: 'English Name',
				description: 'English Description'
			  },
			  {
				locale: 'fr',
				name: 'French Name',
				description: 'French Description'
			  }
			]
		  };
		// if(body.softOneName ) {
		// 	let URL = `https://${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/updateMtrMark`;
		// 	let softoneResponse = await axios.post(URL, {
		// 		username: 'Service',
		// 		password: 'Service',
		// 		company: '1001',
		// 		sodtype: '51',
		// 		mtrcode: 1497,
		// 		name: "fixed name"
		// 	})

		// 	if(!softoneResponse.data.success) {
		// 		return res.status(200).json({ success: false, result: softoneResponse.data, error: 'Δεν έγινε update της μάκρας στο softone' });
		// 	}
		// 	console.log('Softone update MtrCategorySchema : ' + JSON.stringify(softoneResponse.data))
		// 	return res.status(200).json({ success: true, result: softoneResponse.data, error: null });

		// }	

		console.log(updateBody)
		try {
			await connectMongo();
			await MtrCategorySchema.updateOne({ _id: body._id }, { ...updateBody });
			const mtrCategory = await MTRCATEGORY.findOne({ _id: body._id });
			if (mtrCategory) {
				return res.status(200).json({ success: true, result: mtrCategory });
			} else {
				res.status(200).json({ success: false, result: null });
			}


		} catch (error) {
			res.status(400).json({ success: false, result: null });

		}

	}


	

}



