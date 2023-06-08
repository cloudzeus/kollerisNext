import Markes from "../../../../../server/models/markesModel";
import connectMongo from "../../../../../server/config";
import { rewrites } from "../../../../../next.config";
import axios from "axios";
import { CollectionsBookmarkOutlined } from "@mui/icons-material";
export default async function handler(req, res) {
	// await connectMongo();
	// const newMarkes1 = await Markes.create({
	// 	name: 'product1',
	// 	description: 'description of product 1',
	// 	logo: '1685705325908_mountain.jpg',
	// 	videoPromoList: [
	// 		{
	// 			name: 'video1',
	// 			videoUrl: 'videoURL'
	// 		}
	// 	],
	// 	photosPromoList: [
	// 		{
	// 			name: 'sefsefsef',
	// 			photosPromoUrl: 'sesefsefs'
	// 		}
	// 	],
	// 	pimAccess: {
	// 		pimUrl: 'https://pimurl',
	// 		pimUserName: 'pimUserName',
	// 		pimPassword: '1234567'
	// 	},
	// 	webSiteUrl: 'website url',
	// 	officialCatalogueUrl: 'catalogues url',
	// 	facebookUrl: 'facebook url',
	// 	instagramUrl: 'instagram url',
	// 	softOne: {
	// 		COMPANY: '1001',
	// 		SODTYPE: '51',
	// 		MTRMARK: 1001,
	// 		CODE: '1001',
	// 		NAME: 'Addidas',
	// 		ISACTIVE: 1
	// 	}
	// }); 
	


	let action = req.body.action;

	if (action === 'findAll') {
		try {
			await connectMongo();
			const markes = await Markes.find({});
			if (markes) {
				// console.log(markes)
				return res.status(200).json({ success: true, markes: markes });

			}
			else {
				return res.status(200).json({ success: false, markes: null });
			}


		} catch (error) {
			return res.status(400).json({ success: false, error: 'failed to fetch user' });
		}

	}

	if (action === 'create') {

		let videoArray = req.body.data.videoPromoList;
		// Create a new document
		let { data } = req.body
		let createBody = {
			name: data.name,
			description: data.description,
			facebookUrl: data.facebookUrl,
			instagramUrl: data.instagramUrl,
			officialCatalogueUrl: data.officialCatalogueUrl,
			softOneMTRMARK: data.softOneMTRMARK,
			softOneName: data.softOneName,
			softOneCode: data.softOneCode,
			softOneSODCODE: data.softOneSODCODE,
			softOneISACTIVE: data.softOneISACTIVE,
			pimAccess: {
				pimUrl: data.pimUrl,
				pimUserName: data.pimUserName,
				pimPassword: data.pimPassword,
			},
			videoPromoList: [{
				name: 'se',
				videoUrl: 'sefsefefsf'
			}],
			photosPromoList: [{
				name: 'sefsef',
				photosPromoUrl: 'sefsef'
			}],
			logo: 'sefsefseffesef'
		}
		try {
			await connectMongo();
			// let data = req.body.data


			console.log(data)
			const newMarkes = await Markes.create({
				...createBody
			})

			if (newMarkes) {
				console.log('new markes')
				console.log(newMarkes)
				return res.status(200).json({ success: true, markes: newMarkes });

			} else {
				return res.status(200).json({ success: false, markes: null });
			}


		} catch (error) {
			return res.status(400).json({ success: false, error: error.message });
		}
	}

	// if (action === 'update') {
	// 	await connectMongo();
	// 	let body = req.body.data;
	// 	try {
	// 		await connectMongo();
	// 		await Markes.updateOne(
	// 			{ _id: body._id },
	// 			{
	// 				name: 'product1',
	// 				description: 'description of product 1',
	// 				logo: '1685705325908_mountain.jpg',
	// 				videoPromoList: [
	// 					{
	// 						name: 'video1',
	// 						videoUrl: 'https://localohost:3000/assets/imgs/luffy.png'
	// 					}
	// 				],
	// 				photosPromoList: [
	// 					{
	// 						name: 'sefsefsef',
	// 						photosPromoUrl: 'sesefsefs'
	// 					}
	// 				],
	// 				pimAccess: {
	// 					pimUrl: 'https://pimurl',
	// 					pimUserName: 'pimUserName',
	// 					pimPassword: '1234567'
	// 				},
	// 				webSiteUrl: 'website url',
	// 				officialCatalogueUrl: 'catalogues url',
	// 				facebookUrl: 'facebook url',
	// 				instagramUrl: 'instagram url',
	// 				softOne: {
	// 					COMPANY: '1001',
	// 					SODTYPE: '200',
	// 					MTRMARK: 1001,
	// 					CODE: '200',
	// 					NAME: 'Addidas',
	// 					ISACTIVE: 1
	// 				}
	// 			});

	// 		const user = await User.findOne({ _id: body._id });
	// 		res.status(200).json({ success: true, user });


	// 	} catch (error) {
	// 		res.status(400).json({ success: false });

	// 	}

	// }

	if (action === 'delete') {
		await connectMongo();

		let id = req.body.id;
		console.log('backend id')
		console.log(id)
		try {
			let deletedOne = await Markes.findByIdAndDelete(id);
			return res.status(200).json({ success: true, markes: deletedOne });
		}
		catch (error) {
			console.log(error)
			return res.status(400).json({ success: false, error: 'Αποτυχία διαγραφής' });
		}
	}

	if (action === 'sync') {
		try {
			let URL = `https://${process.env.SERIAL_NO}.${process.env.DOMAIN}/s1services/JS/mbmv.mtrMark/getMtrMark`;
			let { data } = await axios.post(URL)
			//SOFTONE ARRAY:
			let softOneArray = data.result
			//MONGO ARRAY:
			await connectMongo();
			const mongoArray = await Markes.find({}, { softOne: 1 });


			function compareArrays(arr1, arr2) {
				const newArray = [];
				for (let i = 0; i < arr1.length; i++) {
					//SERVER ARRAY:
					const object1 = arr1[i].softOne;
					//SOSFTONE:
					for (let j = 0; j < arr2.length; j++) {
						const object2 = arr2[j];
						if (compareObjects(object1, object2)) {
							newArray.push({
								ourObject: object1,
								softoneObject: object2
							})
						}
					}

				}
				return newArray;
			}



			function compareObjects(object1, object2) {


				const id1 = object1?.MTRMARK.toString(); // Retrieve ID from :OUR OBJECT
				const id2 = object2?.MTRMARK.toString(); // Retrieve ID from: SOFTONE OBJECT
				// console.log(object2)
				if (id1 == id2) { // Check if IDs are the same
					const keys = Object.keys(object1);
					for (const key of keys) {
						// console.log(key)
						if (object1[key].toString() !== object2[key].toString()) {
							console.log('--------------------------- NOT THE SAME -----------------------------------')
							console.log(key, object1[key])
							return true; // Values are not the same
						}
					}
					return false; // All values are the same
				}

				return false; // IDs are different
			}

			// Example usage:
			//   const object1 = { id: 123, name: 'Object A', value: 10, color: 'blue', size: 'small' };
			//   const object2 = { id: 123, name: 'Object A', value: 10, color: 'red', size: 'big' };

			//   console.log(compareObjects(object1, object2));

			let newArray = compareArrays(mongoArray, softOneArray)
			console.log('--------------------------- NEW ARRAY -----------------------------------')
			console.log(newArray)
			if (newArray) {
				return res.status(200).json({ success: true, markes: newArray });
			}
			else {
				return res.status(200).json({ success: false, markes: null });
			}

		}
		catch (error) {
			return res.status(400).json({ success: false, error: 'Aδυναμία Εύρεσης Στοιχείων Συγχρονισμού' });
		}
	}

	if (action === 'syncAndUpdate') {

		let data = req.body.data;
		let syncTo = req.body.syncTo;
		console.log(data)
		console.log('syncTo')
		console.log(syncTo)
		try {
			await connectMongo();
			if (req.body.syncTo == 'Εμάς') {
				let updated = await Markes.updateOne(
					{ "softOne.MTRMARK": data.MTRMARK },
					{ $set: { "softOne.NAME": data.NAME } });
				console.log('------------------ updated ---------------------------')
				console.log(updated)
				if (!updated) {
					return res.status(200).json({ success: false });
				}

				return res.status(200).json({ success: true, updated: true });
			}

			if (req.body.syncTo == 'Softone') {
				return res.status(200).json({ success: true });
			}

			// console.log('200')
			// return res.status(200).json({ success: true, markes: null });
		} catch (e) {
			return res.status(500).json({ success: false, error: error.message });
		}

	}



}



