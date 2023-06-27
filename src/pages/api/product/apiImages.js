import connectMongo from "../../../../server/config";
import axios from "axios";
import Markes from "../../../../server/models/markesModel";

export default async function handler(req, res) {

	let action = req.body.action;
	if(!action) return res.status(400).json({ success: false, error: 'no action specified' });
	
	
	if(action === 'deleteImages') {
		console.log('update Images')
		let id = req.body._id;
		let image = req.body.image;
		try {
			await connectMongo();
			await Markes.updateOne({ _id: id }, 
			{ $pull: { photosPromoList: [{
				name: image,
				photosPromoUrl: image
			 }]}}
			);
			return res.status(200).json({ success: true, message:'Έγινε update', error: null });
		} catch (e) {
			return res.status(500).json({ success: false, error:'Δεν έγινε update', message: null });
		}
	}

	if(action == 'addMoreImages') {
		console.log('add new Images to the database')
		let id = req.body._id;
		//Images must be and array
		let images = req.body.images;
		try {
			await connectMongo();
			await Markes.updateOne({ _id: id }, 
				{ $push: { images: { $each: [...images] } } }
			);
			return res.status(200).json({ success: true, message:'Έγινε update', error: null });
		} catch (e) {
			return res.status(500).json({ success: false, error:'Δεν έγινε update', message: null });
		}
	}
}



const fetchSoftoneMarkes = async () => {
	let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/getMtrMark`;
	let { data } = await axios.post(URL)
	return data;
}