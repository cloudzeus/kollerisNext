import { ImpaCodes } from "../../../../server/models/impaSchema"
import SoftoneProduct, { Product } from "../../../../server/models/newProductModel"
import connectMongo from "../../../../server/config"
export default async function handler(req, res) {
    const action = req.body.action 
    // if(action === 'insert') {
    //     let {data} = req.body
    //     let newArray = []
    //     for(let item of data) {
    //         newArray.push({
    //             code: item.Code,
    //             englishDescription: item["English Description"],
    //             greekDescription: item["Ελληνική Περιγραφή"],
    //             unit: item.Unit
    //         })
    //     }
       
    //     try {
    //         await connectMongo();
    //         const impas = await ImpaCodes.insertMany(newArray)
    //         console.log(impas)
    //         res.status(200).json({success: true, data: impas})
    //     } catch (e) {
    //         console.log(e)
    //     }
        
    // }
    if(action === 'createImpa') {
        const {data} = req.body;
        try {
            await connectMongo();
            const impa = await ImpaCodes.create(data);
            return res.status(200).json({success: true, result: impa})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

    if(action === 'deleteOne') {
        const {id} = req.body;
        try {
            await connectMongo();
            const impa = await ImpaCodes.deleteOne({_id: id});
            return res.status(200).json({success: true, result: impa})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }
    // if(action === 'findAllWithProducts') {
    //     const {skip, limit} = req.body;
    //     console.log('find all impas with products')
    //     try {
    //         await connectMongo();
    //         const totalRecords = await ImpaCodes.countDocuments();
    //         console.log(totalRecords)
    //         const impas = await ImpaCodes.find({}).skip(skip).limit(limit).populate('products', 'NAME');
          
    //         return res.status(200).json({success: true, result: impas, totalRecords: totalRecords})
    //     } catch (e) {
    //         return res.status(500).json({success: false, result: null})
    //     }
    // }
    // if(action === 'find') {
    //     try {
    //         await connectMongo();
    //         const impas = await ImpaCodes.find({}, {code: 1,  englishDescription: 1})
    //         console.log(impas)
    //         res.status(200).json({success: true, data: impas})
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    if(action === 'findAll') {
        let {skip, limit, searchTerm} = req.body;
        console.log(searchTerm)
        let totalRecords;
        let impas;
        let filterConditions = {};
        try {
            await connectMongo();
            if (searchTerm.code) {
                filterConditions.code= new RegExp(searchTerm.code, 'i');
            }   
            if (searchTerm.greek) {
                filterConditions.greekDescription = new RegExp(searchTerm.greek, 'i');
            }   
            if (searchTerm.english) {
                filterConditions.englishDescription = new RegExp(searchTerm.english, 'i');
            }   

            //IF filter conditions object is empty
            if (Object.keys(filterConditions).length === 0) {
                totalRecords = await ImpaCodes.countDocuments();
            } else {
                totalRecords = await ImpaCodes.countDocuments(filterConditions);
            }
            
            impas = await ImpaCodes.find(filterConditions).skip(skip).limit(limit);
            return res.status(200).json({success: true, result: impas, totalRecords: totalRecords})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

    if(action === 'findImpaProducts') {
        const {id} = req.body;
        console.log(id)
        try {
            await connectMongo();
            const impa = await ImpaCodes.findOne({_id: id}).populate('products', 'NAME');
            let products = impa.products
            return res.status(200).json({success: true, result: products})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

    if(action === "updateImpa") {
        const {data, id} = req.body;
        try {
            await connectMongo();
            let update = await ImpaCodes.updateOne({_id: id}, {
                $set: {
                    code: data.code, 
                    englishDescription: data.englishDescription, 
                    greekDescription: data.greekDescription,
                    updatedFrom: data.user,
                }})
            return res.status(200).json({success: true, result: update})
        } catch (e) {
            return res.status(500).json({success: false, result: null})
        }
    }

    //Action that happens in product basket:
    if(action === 'correlateImpa') {
        let {dataToUpdate, id} = req.body
        
        console.log(dataToUpdate)
        console.log(id)
        try {
        await connectMongo();
            let arrayProductID = [];
            let count = 0;
            let errorArray = [];
            for(let item of dataToUpdate) {
                let response = await SoftoneProduct.updateOne({_id: item._id}, {$set: {impas: id}}, {upsert: true})
                console.log('response impa')
                console.log(response)
                if(response.modifiedCount == 1) {
                    count++;
                } else {
                    errorArray.push(item?.name)
                }
                arrayProductID.push(item._id)
              
            }  

            let updateImpa = await ImpaCodes.updateOne({_id: id}, {$push: {products: {$each: arrayProductID}}})
            console.log('updateImpa')
            console.log(updateImpa)
            
            if(count === dataToUpdate.length && updateImpa) {
                return res.status(200).json({success: true, message: 'Update Impa ολοκληρώθηκε'})
            } else {
                return res.status(200).json({success: true, message: 'Δεν ολοκληρώθηκε το update', result: errorArray})
            }
            
           
        }catch (e) {
          return res.status(400).json({success: false, result: null, error: "Προέκυψε κάποιο σφάλμα στην Εμημέρωση Impa και Προϊόντων"})
        }
    }

    if(action === 'deleteImpaProduct') {
        const {id, impaId} = req.body;
        console.log(id)
        console.log(impaId)
        await connectMongo();
        try {
            let deleteproduct= await ImpaCodes.updateOne({_id: impaId}, {$pull: {products: id}})
            console.log(deleteproduct.modifiedCount)
            let updatesoftone = await SoftoneProduct.updateOne({_id: id}, {$unset: {impas: 1}})
            console.log('update softone')
            console.log(updatesoftone)
            return res.status(200).json({success: true})
        } catch (e) {
            return res.status(500).json({success: false})
        }
    }

    if(action === "deactivate") {
        const {selected} = req.body;
        console.log(selected)
     
        let ids = selected.map(item => item._id)
        try {
            await connectMongo();
            let update = await ImpaCodes.updateMany(
                {_id: {$in: ids}}, 
                {$set: {isActive: false},
            }
            )
            console.log(update)
            return res.status(200).json({success: true})
        } catch (e) {
            return res.status(500).json({success: false})
        }
    }
    if(action === "activate") {
        const {selected} = req.body;
        console.log(selected)
     
        let ids = selected.map(item => item._id)
        try {
            await connectMongo();
            let update = await ImpaCodes.updateMany(
                {_id: {$in: ids}}, 
                {$set: {isActive: true},
            }
            )
            console.log(update)
            return res.status(200).json({success: true})
        } catch (e) {
            return res.status(500).json({success: false})
        }
    }
}