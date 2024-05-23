import connectMongo from "../../../../server/config";
import axios from "axios";
import Markes from "../../../../server/models/markesModel";
export default async function handler(req, res) {

	let action = req.body.action;
	if(!action) return res.status(400).json({ success: false, error: 'no action specified' });
	
	
	if(action === 'deleteImages') {
		let id = req.body.id;
		let image = req.body.image;
		try {
			await connectMongo();
		let resp = await Markes.updateOne({ _id: id }, 
			{ $pull: { photosPromoList: {
				name: image,
				photosPromoUrl: image
			 }}}
			);
			return res.status(200).json({ success: true, message:'Έγινε update', error: null, result: resp });
		} catch (e) {
			return res.status(500).json({ success: false, error:'Δεν έγινε update', message: null, result: null });
		}
	}

	if(action == 'addImages') {
		let id = req.body.id;
		let images = req.body.images;
		let newArray = [];
		//construc images object
		for(let image of images) {
			let obj = {
				name: image,
				photosPromoUrl: image
			}
			newArray.push(obj)
		}
		// Images must be and array
		try {
			await connectMongo();
			let response = await Markes.updateOne({ _id: id }, 
				{ $push: { photosPromoList: { $each: [... newArray] } } }
			);
			return res.status(200).json({ success: true, message:'Έγινε update', error: null });
		} catch (e) {
			return res.status(500).json({ success: false, error:'Δεν έγινε update', message: null });
		}
	}
}



