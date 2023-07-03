import connectMongo from "../../../../server/config";
import axios from "axios";
import Markes from "../../../../server/models/markesModel";

export default async function handler(req, res) {


	
	let action = req.body.action;
	if(!action) return res.status(400).json({ success: false, error: 'no action specified' });
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
			console.log('fin all markes')
			await connectMongo();
			const markes = await Markes.find({})
			.populate({
					populate: { path: 'subGroups' }
				});
			if (markes) {
				// console.log(markes)
				const arrayImages = []
				for(let item of markes) {
					for(let image of item?.photosPromoList ?? []) {
						if(image?.photosPromoUrl) {
							arrayImages.push(image?.photosPromoUrl)
						}
						
						
					}
				}
				
				return res.status(200).json({ success: true, markes: markes, images: arrayImages});

			}
			else {
				return res.status(200).json({ success: false, markes: null });
			}


		} catch (error) {
			return res.status(400).json({ success: false, error: 'failed to fetch user' });
		}

	}

	if (action === 'create') {
		let { data } = req.body
		let {createdFrom} = req.body
		console.log('data: ' + JSON.stringify(data))
		try {
			let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/createMtrMark`;
			console.log(URL)
			let softoneResponse = await axios.post(URL, {
				username: 'Service',
				password: 'Service',
				company: '1001',
				sodtype: '51',
				name: data.name
			})
			console.log('softone response data')
			console.log(softoneResponse.data)
			if (!softoneResponse.data.success) {
				return res.status(200).json({ success: false, markes: null, error: 'Αποτυχία εισαγωγής στο softone', softoneError: softoneResponse.data.error });
			}
			
			const SOFTONE_MTRMARK = softoneResponse.data.kollerisPim.MTRMARK
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
				},
				createdFrom: createdFrom,
				status: true,
			}
			console.log('object');
			console.log(object);
			await connectMongo();
			const newMarkes = await Markes.create({...object});

			if (!newMarkes) return res.status(200).json({ success: false, markes: null, error: 'Αποτυχία εισαγωγής στη βάση δεδομένων' });
			return res.status(200).json({ success: true, markes: newMarkes, error: null });


		} catch (e) {
			return res.status(400).json({ success: false, error: 'Aποτυχία εισαγωγής', markes: null });
		}
			
			
		
	}
	if (action === 'createMany') {
		let { data } = req.body
		let {createdFrom} = req.body
		let newArray = [];
		for (let item of data) {
			console.log(item)
			const object = {
				name: item.NAME,
				description: '',
				logo: '',
				videoPromoList: [
					{
						name: '',
						videoPromoUrl: ''
					}
				],
				photoPromoList: [{
					name: '',
					photosPromoUrl: ''
				}],
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
				status: true,
				createdFrom: createdFrom
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
		

		let mtrmark = req.body.mtrmark;
		let body = req.body.data;
		console.log('update brand body')
		console.log(body)
		let id = req.body.id

		if(req.body.data?.name) {
			let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/updateMtrMark`;
			let softoneResponse = await axios.post(URL, {
				username: 'Service',
				password: 'Service',
				company: '1001',
				sodtype: '51',
				mtrmark: mtrmark,
				name: body.name
			})
		}
		
		const filter = { _id: id };
		const update = { $set: body };
		try {
			await connectMongo();
			const result = await Markes.updateOne(filter, update);
		
			return res.status(200).json({ success: true, result: result });
		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', markes: null });
		}
    
	
		
	

	}

	if (action === 'delete') {
		await connectMongo();

		let id = req.body.id;
		console.log('backend id')
		console.log(id)
		const filter = { _id: id };
		const update = { $set: {
			status: false
		} };
		try {
			await connectMongo();
			const result = await Markes.updateOne(filter, update);
			console.log(result)
			return res.status(200).json({ success: true, result: result });
		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', result: null});
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
	let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/getMtrMark`;
	let { data } = await axios.post(URL)
	return data;
}