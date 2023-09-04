import { ImpaCodes } from "../../../../server/models/impaSchema"
import connectMongo from "../../../../server/config"
export default async function handler(req, res) {
    const action = req.body.action 
    if(action === 'insert') {
        let {data} = req.body
        let newArray = []
        for(let item of data) {
            newArray.push({
                code: item.Code,
                englishDescription: item["English Description"],
                greekDescription: item["Ελληνική Περιγραφή"],
                unit: item.Unit
            })
        }
        console.log('new array')
        console.log(newArray)
        // try {
        //     await connectMongo();
        //     const impas = await ImpaCodes.insertMany(newArray)
        //     res.status(200).json({success: true, data: impas})
        // } catch (e) {
        //     console.log(e)
        // }
        
    }

    if(action === 'findAll') {
        try {
            await connectMongo();
            const impas = await ImpaCodes.find({})
            console.log(impas)
            res.status(200).json({success: true, data: impas})
        } catch (e) {
            console.log(e)
        }
    }
    if(action === 'find') {
        try {
            await connectMongo();
            const impas = await ImpaCodes.find({}, {code: 1,  englishDescription: 1})
            console.log(impas)
            res.status(200).json({success: true, data: impas})
        } catch (e) {
            console.log(e)
        }
    }
}