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

		console.log(req.body)


		const password = data.password;
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);
		console.log(hashPassword)
		try {
            
			let object = {
				password: hashPassword,
				email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data?.role,
				address: {
					country: data?.country,
					address: data?.address,
					city: data?.city,
					postalcode: data?.postalcode,
				},
				phones: {
					mobile: data?.mobile,
					landline: data?.landline
				},
				status: true,
			
            }

			await connectMongo();
			const alreadyEmailCheck = await User.findOne({ email: data.email })
			if(alreadyEmailCheck) {
				return res.status(200).json({success: false,  error: 'Το email είναι ήδη εγγεγραμένο', result: null})
			}

			const user = await User.create(object)

			if (!user) return res.status(200).json({ success: false, result: null, error: 'Αποτυχία εισαγωγής στη βάση δεδομένων' });
			return res.status(200).json({ success: true, result: user, error: null });

		} catch (e) {
			return res.status(400).json({ success: false, error: 'Aποτυχία εισαγωγής', result: null });
		}



	}

	if (action === 'update') {

		let body = req.body.data;
		console.log('update brand body')
		console.log(body)
		let id = req.body.id
		
	
		function hashPassword(password) {
			const saltRounds = 10;
			const salt = bcrypt.genSaltSync(saltRounds);
			let hassed = bcrypt.hashSync(password, salt);
			return hassed;
		  } 

		  function updateUserPassword(data, newPassword) {
			if (newPassword) {
			  const hashedPassword = hashPassword(newPassword);
			  data.password = hashedPassword;
			}
		  }

		  updateUserPassword(body, body.newpassword);
			
		const filter = { _id: id };
		const update = { $set: {...body} };
		try {
			await connectMongo();
			const result = await User.updateOne(filter, update);
			console.log(result)
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
			const result = await User.updateOne(filter, update);
			console.log(result)
			return res.status(200).json({ success: true, result: result });
		} catch (error) {
			return res.status(500).json({ success: false, error: 'Aποτυχία εισαγωγής', result: null});
		}
	}


}





