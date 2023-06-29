import axios from "axios";
import User from "../../../../server/models/contactInfoModel";
import connectMongo from "../../../../server/config";



export default async function handler(req, res) {


	
	let action = req.body.action;
	if(!action) return res.status(400).json({ success: false, error: 'no action specified' });
	

	if (action === 'findAll') {
		try {
			await connectMongo();
			const users = await User.find({});
            console.log('users: ' + JSON.stringify(users))
			return res.status(200).json({ success: true, result: users});

		} catch (error) {
			return res.status(400).json({ success: false, error: 'failed to fetch user', result: null });
		}

	}

	if (action === 'create') {
		let { data } = req.body
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
			console.log(softoneResponse)
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
	
	
}



const fetchSoftoneMarkes = async () => {
	let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/getMtrMark`;
	let { data } = await axios.post(URL)
	return data;
}


