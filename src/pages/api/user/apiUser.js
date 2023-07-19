import axios from "axios";

import User from "../../../../server/models/userModel"
import connectMongo from "../../../../server/config";
import bcrypt from 'bcrypt';


export default async function handler(req, res) {



	let action = req.body.action;
	if(!action) return res.status(400).json({ success: false, error: 'no action specified' });


	if (action === 'findAll') {
		try {
			await connectMongo();
		
			const users = await User.find({});
		
            // console.log('users: ' + JSON.stringify(users))
			return res.status(200).json({ success: true, result: users});

		} catch (error) {
			return res.status(400).json({ success: false, error: 'failed to fetch user', result: null });
		}

	}

	if (action === 'create') {
		let { data } = req.body
		let _data = data

		const password = data.password;
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		_data.password = hashPassword;
		_data.status = true;

		try {
			await connectMongo();
			const alreadyEmailCheck = await User.findOne({ email: data.email })
			if(alreadyEmailCheck) {
				return res.status(200).json({success: false,  error: 'Το email είναι ήδη εγγεγραμένο', result: null})
			}

			const user = await User.create(_data)
			if (!user) return res.status(200).json({ success: false, result: null, error: 'Αποτυχία εισαγωγής στη βάση δεδομένων' });
			return res.status(200).json({ success: true, result: user, error: null });

		} catch (e) {
			return res.status(400).json({ success: false, error: 'Aποτυχία εισαγωγής', result: null });
		}



	}

	if (action === 'update') {

		let data= req.body.data;
		let id = req.body.id
			
		const filter = { _id: id };
		const update = { $set: {...data} };
		console.log('update data:')
		console.log(update)
		try {
			await connectMongo();
			const result = await User.updateOne(filter, update);
			console.log('result')
			console.log(result)
			return res.status(200).json({ success: true, result: result });
		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', markes: null });
		}





	}

	if (action === 'delete') {
		await connectMongo();

		let id = req.body.id;
		try {
			await connectMongo();
			const result = await User.deleteOne({_id: id});
			console.log('resutl')
			console.log(result)
			return res.status(200).json({ success: true, result: result });
		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', result: null});
		}
	}


}





