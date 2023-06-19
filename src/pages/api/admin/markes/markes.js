import Markes from "../../../../../server/models/markesModel";
import connectMongo from "../../../../../server/config";
import axios from "axios";
import compareArrays from "@/utils/compareArrays";
import { columnSelectionComplete } from "@syncfusion/ej2-react-grids";



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
	if (action === 'findOne') {
		console.log('findOne')
		console.log(req.body.id)
		try {
			await connectMongo();
			const markes = await Markes.find({ _id: req.body.id });
			if (markes) {
				return res.status(200).json({ success: true, markes: markes });
			}
			else {
				return res.status(200).json({ success: false, markes: null });
			}


		} catch (error) {
			return res.status(400).json({ success: false, error: 'failed to fetch Markes', markes: null });
		}
	}

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
		console.log('create')
		let { data } = req.body
		try {
			let URL = `https://${process.env.SERIAL_NO}.${process.env.DOMAIN}/s1services/JS/mbmv.mtrMark/createMtrMark`;
			let softoneResponse = await axios.post(URL, {
				username: 'Service',
				password: 'Service',
				company: '1001',
				sodtype: '51',
				name: data.name
			})

			if (!softoneResponse.data.success) {
				return res.status(200).json({ success: false, markes: null, error: 'Αποτυχία εισαγωγής στο softone' });
			}

			console.log('softone response data')
			console.log(softoneResponse.data)
			let SOFTONE_MTRMARK = softoneResponse.data.kollerisPim.mtrcode
			console.log(SOFTONE_MTRMARK)


			const object = {
				name: data.name,
				description: data.description,
				logo: data.logo,
				videoPromoList: data.videoPromoList,
				photosPromoList: data.photosPromoList,
				pimAccess: {
					pimUrl: data.pimUrl,
					pimUserName: data.pimUserName,
					pimPassword: data.pimPassword
				},
				webSiteUrl: data.webSiteUrl,
				officialCatalogueUrl: data.officialCatalogueUrl,
				facebookUrl: data.facebookUrl,
				instagramUrl: data.instagramUrl,
				softOne: {
					COMPANY: '1001',
					SODTYPE: '51',
					MTRMARK: parseInt(SOFTONE_MTRMARK),
					CODE: SOFTONE_MTRMARK.toString(),
					NAME: data.name,
					ISACTIVE: 1
				}
			}

			console.log('object')
			console.log(object)
			if (softoneResponse.data.success) {
				await connectMongo();
				const newMarkes = await Markes.create({
					...object,
				});


				if (newMarkes) {
					return res.status(200).json({ success: true, markes: newMarkes, error: null });

				} else {
					return res.status(200).json({ success: false, markes: null, error: 'Αποτυχία εισαγωγής στη βάση δεδομένων' });
				}
			}



		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', markes: null });
		}
	}
	if (action === 'createMany') {
		let { data } = req.body
		// console.log('data')
		// console.log(data)


		let newArray = [];
		for (let item of data) {
			console.log(item)
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
			const newMarkes = await Markes.insertMany(newArray);

			console.log('Softone Markes Inserted Successfully', JSON.stringify(newMarkes))
			if (newMarkes) {
				return res.status(200).json({ success: true, result: newMarkes });

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
		let updateBody = {
			name: body.name,
			description: body.description,
			logo: body.logo,
			videoPromoList: body.videoPromoList,
			photosPromoList: {
				name: 'name',
				photosPromoUrl: body.photosPromoUrl
			},
			pimAccess: {
				pimUrl: body.pimUrl,
				pimUserName: body.pimUserName,
				pimPassword: body.pimPassword
			},
			webSiteUrl: body.webSiteUrl,
			officialCatalogueUrl: body.officialCatalogueUrl,
			facebookUrl: body.facebookUrl,
			instagramUrl: body.instagramUrl,
			softOne: {
				COMPANY: '1001',
				SODTYPE: '200',
				MTRMARK: body.softOneMTRMARK,
				CODE: '51',
				NAME: body.softOneName,
				ISACTIVE: 1
			}
		}

		console.log(updateBody)
		try {
			await connectMongo();
			await Markes.updateOne({ _id: body._id }, { ...updateBody });
			const markes = await Markes.findOne({ _id: body._id });
			if (markes) {
				return res.status(200).json({ success: true, result: markes });
			} else {
				res.status(200).json({ success: false, result: null });
			}


		} catch (error) {
			res.status(400).json({ success: false, result: null });

		}

	}

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
		console.log('sync')
		try {
			let URL = `${process.env.URL}/JS/mbmv.mtrMark/getMtrMark`;
			let { data } = await axios.post(URL)
			let softOneArray = data.result;
			await connectMongo();
			const mongoArray = await Markes.find({}, { softOne: 1 });
			let newArray = compareArrays(mongoArray, softOneArray, ['NAME'], 'MTRMARK')
			if (newArray) {
				return res.status(200).json({ success: true, markes: newArray });
			}
			else {
				return res.status(200).json({ success: false, markes: [] });
			}

		}
		catch (error) {
			return res.status(400).json({ success: false, error: 'Aδυναμία Εύρεσης Στοιχείων Συγχρονισμού', markes: [] });
		}
	}

	if (action === 'syncAndUpdate') {

		let data = req.body.data;

		try {
			await connectMongo();
			if (req.body.syncTo == 'Εμάς') {
				let updated = await Markes.updateOne(
					{ "softOne.MTRMARK": parseInt(data.MTRMARK) },
					{ $set: { "softOne.NAME": data.NAME } }
				);

				if (updated.modifiedCount === 0) {
					return res.status(200).json({ success: false, updated: false });
				}

				return res.status(200).json({ success: true, updated: true });
			}

			if (req.body.syncTo == 'Softone') {
				return res.status(200).json({ success: false, updated: false });
			}

			// console.log('200')
			// return res.status(200).json({ success: true, markes: null });
		} catch (e) {
			return res.status(500).json({ success: false, error: error.message });
		}

	}

	if (action === 'findExtraSoftone') {
		await connectMongo();
		const mongoArray = await Markes.find();

		let resp = await fetchSoftoneMarkes();
		let notFoundAriadne = resp.result.filter(o1 => {
			return !mongoArray.some((o2) => {
				// console.log(o2.softOne.MTRMARK)
				return o1.MTRMARK == o2.softOne.MTRMARK; // return the ones with equal id
			});
		});


		let notFoundSoftone = mongoArray.filter(o1 => {
			return !resp.result.some((o2) => {
				// console.log(o2.softOne.MTRMARK)
				return o1.softOne.MTRMARK == o2.MTRMARK; // return the ones with equal id
			});
		});
		console.log('return items not found in softone: ' + JSON.stringify(notFoundSoftone.length))

		let itemsInSoftone = resp.result.length;
		console.log('return items not found in ariadne: ' + JSON.stringify(notFoundAriadne.length))
		console.log('total softone: ' + itemsInSoftone)
		let itemInAriadne = mongoArray.length;


		let percentageAriadne = (itemInAriadne / itemsInSoftone) * 100;

		return res.status(200).json({ success: true, notFoundAriadne: notFoundAriadne, notFoundSoftone: notFoundSoftone, percentageAriadne: percentageAriadne });

	}
}



const fetchSoftoneMarkes = async () => {
	let URL = `https://${process.env.SERIAL_NO}.${process.env.DOMAIN}/s1services/JS/mbmv.mtrMark/getMtrMark`;
	let { data } = await axios.post(URL)
	return data;
}