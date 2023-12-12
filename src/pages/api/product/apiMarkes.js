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
		console.log('test')
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
				minValueOrder: data.minValueOrder,
				minItemsOrder: data.minItemsOrder,
				minYearPurchases: data.minYearPurchases,
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
		let id = req.body.id

		if(req.body.data?.name) {
			let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/updateMtrMark`;
			let softoneResponse = await axios.post(URL, {
				username: 'Service',
				password: 'Service',
				company: '1001',
				sodtype: '51',
				mtrmark: mtrmark,
				name: body.softOne.NAME
			})
		}
		
		const filter = { _id: id };
		try {
			await connectMongo();
			const result = await Markes.updateOne(
				{_id: id},
				{$set: {
					description: body.description,
					updatedFrom: body.updatedFrom,
					videoPromoList: body.videoPromoList,
					photosPromoList: body.photosPromoList,
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
						SODTYPE: '51',
						MTRMARK: parseInt(body.softOne.MTRMARK),
						CODE: body.softOne.CODE,
						NAME: body.softOne.NAME,
						ISACTIVE: 1
					},	

				}}
			);
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

	if (action === "addImages") {
        const { imagesURL, id } = req.body;


        try {
            await connectMongo();


            const updatedProduct = await Markes.findOneAndUpdate(
                { _id: id }, // Using the passed 'id' variable
                {
                    $addToSet: { images: { $each: imagesURL } } // Push only the new URLs
                },
                { new: true } // To return the updated document
            );
            console.log(updatedProduct)
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ success: false, result: null });
        }



    }

    if (action === 'getImages') {
        const { id } = req.body;

        await connectMongo()
        try {
            let result = await Markes.findOne({ _id: id }, { images: 1 });
            console.log(result)
            return res.status(200).json({ message: "success", result: result?.images })
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }

    }
    if (action === "deleteImage") {
        const {parentId, imageId, name } = req.body;
        try {
            await connectMongo();
            const updatedProduct = await Markes.findOneAndUpdate(
                { _id: parentId }, // Using the passed 'id' variable
                {
                    $pull: {
                        images: { 
                            _id:  imageId,
                            name: name }
                    }
                },// Push only the new URLs
                { new: true } // To return the updated document
            );
            console.log(updatedProduct)
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }
	if(action === "getLogo") {
		const {id} = req.body;
		console.log('id')
		console.log(id)
		try {
			await connectMongo();
			let response =  await Markes.findOne({_id: id}, {logo: 1});
			console.log('result')
			console.log(response)
			return res.status(200).json({success: true, result: response.logo});
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}
	if(action === "addLogo") {
		const {id, logo} = req.body;
		console.log('id')	
		console.log(id)
		console.log('logo')
		console.log(logo)
		try {
			await connectMongo();
			const updatedProduct = await Markes.findOneAndUpdate(
				{ _id: id }, // Using the passed 'id' variable
				{
					$set: { logo: logo } // Push only the new URLs
				},
				{ new: true } // To return the updated document
			);
			console.log(updatedProduct)
			return res.status(200).json({ success: true });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}

	if(action === 'deleteLogo') {
		const {id} = req.body;
		
		try {
			await connectMongo();
			let deleted = await  Markes.findOneAndUpdate(
				{_id: id},
				{$set : {
					logo: ''
				}}	
			  	);

			console.log(deleted)
			return res.status(200).json({ success: true, result: deleted  });
		} catch (e) {	
			return res.status(400).json({ success: false, result: null });
		}
	} 

	if(action === 'saveCatalog') {
        const {catalogName, id} = req.body;
        console.log('catalogName')
        console.log(catalogName)
        try {
            await connectMongo();
            let result = await  Markes.findOneAndUpdate({_id: id}, {
                $set: {
                    catalogName: catalogName
                }   
            })
            return res.status(200).json({ success: true, result: result })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
}



