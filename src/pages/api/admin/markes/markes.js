import Markes from "../../../../../server/models/markesModel";
import connectMongo from "../../../../../server/config";
import { rewrites } from "../../../../../next.config";
import axios from "axios";
export default async function handler(req, res) {

	try {
	  await connectMongo();
	      let data = req.body.data
	      const newMarkes = await Markes.create({
	          name:'product1',
	          description: 'description of product 1',
	          logo: 'https://localohost:3000/assets/imgs/luffy.png',
	          videoPromoList: [
	            {
	              name: 'video1',
	              videoUrl: 'https://localohost:3000/assets/imgs/luffy.png'
	            }
	          ],
	          photosPromoList: [
	            {
	              name:'sefsefsef',
	              photosPromoUrl: 'sesefsefs'
	            }
	          ],
	          pimAccess: {
	            pimUrl: 'https://pimurl',
	            pimUserName:'pimUserName',
	            pimPassword: '1234567'
	          },
	          webSiteUrl: 'website url',
	          officialCatalogueUrl: 'catalogues url',
	          facebookUrl: 'facebook url',
	          instagramUrl: 'instagram url',
	          softOne: {
				COMPANY: '1001',
				SODCODE: '200',
				MTRMARK: 1001,
				CODE: 200,
				NAME: 'Addidas',
				ISACTIVE: 1
			}
	      })
	      console.log(newMarkes);
	      return res.status(200).json({success: true, markes: newMarkes});
	} catch (error) {
	      console.log(error)
	}

	let action = req.body.action;


	// if (action === 'findAll') {
	// 	try {
	// 		await connectMongo();
	// 		const markes = await Markes.find({});
	// 		if (markes) {
	// 			// console.log(markes)
	// 			return res.status(200).json({ success: true, markes: markes });

	// 		}
	// 		else {
	// 			return res.status(200).json({ success: false, markes: null });
	// 		}


	// 	} catch (error) {
	// 		return res.status(400).json({ success: false, error: 'failed to fetch user' });
	// 	}

	// }
	// if (action === 'create') {

	// 	let videoArray = req.body.data.videoPromoList;
	// 	// Create a new document
	// 	let { data } = req.body
	// 	let createBody = {
	// 		name: data.name,
	// 		description: data.description,
	// 		facebookUrl: data.facebookUrl,
	// 		instagramUrl: data.instagramUrl,
	// 		officialCatalogueUrl: data.officialCatalogueUrl,
	// 		softOneMTRMARK: data.softOneMTRMARK,
	// 		softOneName: data.softOneName,
	// 		softOneCode: data.softOneCode,
	// 		softOneSODCODE: data.softOneSODCODE,
	// 		softOneISACTIVE: data.softOneISACTIVE,
	// 		pimAccess: {
	// 			pimUrl: data.pimUrl,
	// 			pimUserName: data.pimUserName,
	// 			pimPassword: data.pimPassword,
	// 		},
	// 		videoPromoList: [{
	// 			name: 'se',
	// 			videoUrl: 'sefsefefsf'
	// 		}],
	// 		photosPromoList: [{
	// 			name: 'sefsef',
	// 			photosPromoUrl: 'sefsef'
	// 		}],
	// 		logo: 'sefsefseffesef'
	// 	}
	// 	try {
	// 		await connectMongo();
	// 		// let data = req.body.data


	// 		console.log(data)
	// 		const newMarkes = await Markes.create({
	// 			...createBody
	// 		})

	// 		if (newMarkes) {
	// 			console.log('new markes')
	// 			console.log(newMarkes)
	// 			return res.status(200).json({ success: true, markes: newMarkes });

	// 		} else {
	// 			return res.status(200).json({ success: false, markes: null });
	// 		}


	// 	} catch (error) {
	// 		return res.status(400).json({ success: false, error: error.message });
	// 	}
	// }

	// if (action === 'delete') {
	// 	await connectMongo();

	// 	let id = req.body.id;
	// 	console.log('backend id')
	// 	console.log(id)
	// 	try {
	// 		let deletedOne = await Markes.findByIdAndDelete(id);
	// 		return res.status(200).json({ success: true, markes: deletedOne });
	// 	}
	// 	catch (error) {
	// 		console.log(error)
	// 		return res.status(400).json({ success: false, error: 'Αποτυχία διαγραφής' });
	// 	}
	// }

	// if (action === 'sync') {
	// 	let URL = `https://${process.env.SERIAL_NO}.${process.env.DOMAIN}/s1services/JS/mbmv.mtrMark/getMtrMark`;
	// 	console.log(URL);
	// 	let {data} = await axios.post(URL)
	// 	console.log(data)


	// 	const mongoArray = await Markes.find({}, {softOneMTRMARK: 1, softOneName: 1, softOneCode: 1, softOneSODCODE: 1});
	// 	for( let obj of mongoArray) {
	// 		const keys = Object.keys(obj);
	// 	}


	// 	const array1 = [
	// 		{ id: 123, name: 'Object A', value: 10 },
	// 		{ id: 456, name: 'Object B', value: 20 },
	// 		{ id: 457, name: 'Object C', value: 20 },
	// 		{ id: 458, name: 'Object D', value: 20 },
	// 		// ... more objects
	// 	  ];
		  
	// 	  const array2 = [
	// 		{ id: 123, name: 'Object A', value: 10 },
	// 		{ id: 456, name: 'Object B', value: 23 },
	// 		{ id: 457, name: 'Object C', value: 20 },
	// 		{ id: 458, name: 'Object D', value: 26 },
	// 		// ... more objects
	// 	  ];

	// 	function Arrays(arr1, arr2) {
	// 		const newArray = [];
	// 		for(let i = 0; i < arr1.length; i++) {
	// 			const object1 = arr1[i];
    // 			const object2 = arr2[i];
	// 			console.log(object1)
	// 			if(compareObjects(object1, object2)) {
	// 				newArray.push({
	// 					ourObject: object1,
	// 					softoneObject: object2
	// 				})
	// 			}
				
	// 		}
	// 		return newArray;
	// 	}



	// 	function compareObjects(object1, object2) {

			
	// 		const id1 = object1.id; // Retrieve ID from :OUR OBJECT
	// 		const id2 = object2.id; // Retrieve ID from object2
	// 		if (id1 === id2) { // Check if IDs are the same
	// 		  const keys = Object.keys(object1);
	// 		  for (const key of keys) {
				
	// 			if (object1[key] !== object2[key]) { 
	// 			  return true; // Values are not the same
	// 			}
	// 		  }
	// 		  return false; // All values are the same
	// 		}
		  
	// 		return false; // IDs are different
	// 	  }
		  
	// 	  // Example usage:
	// 	//   const object1 = { id: 123, name: 'Object A', value: 10, color: 'blue', size: 'small' };
	// 	//   const object2 = { id: 123, name: 'Object A', value: 10, color: 'red', size: 'big' };
		
	// 	//   console.log(compareObjects(object1, object2));
	// 	  console.log(Arrays(array1, array2))


	// }
}


  // let data = {
  //   name: '4',
  //   description: 'sefsefesfsefsefse',
  //   facebookUrl: 'fsefsefsefse',
  //   instagramUrl: 'fsefsefsefsef',
  //   officialCatalogueUrl: 'sefsefsefsefse',
  //   softOneMTRMARK: 1001,
  //   softOneName: 'sefsefes',
  //   softOneCode: 'fsefsefsefse',
  //   softOneSODCODE: 'fsefesfsefse',
  //   softOneISACTIVE: 1,
  //   pimAccess: {
  //     pimUrl: 'sefsefsefse',
  //     pimUserName: '',
  //     pimPassword: 'sefsfeefseffesf',
  //   },
  //   videoPromoList: [{
  //     name: 'sfef',
  //     videoUrl: 'sefsefefsf'
  //   }],
  //   photosPromoList: [{
  //     name: 'sefsef',
  //     photosPromoUrl: 'sefsef'
  //   }],
  //   logo: 'sefsefseffesef'
  // }