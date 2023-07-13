
import connectMongo from "../../../../server/config";
import { MtrGroup, MtrCategory } from "../../../../server/models/categoriesModel";
import translateData from "@/utils/translateDataIconv";
import Vat from "../../../../server/models/vatModel";
import Countries from "../../../../server/models/countriesModel";
export default async function handler(req, res) {

    const { action } = req.body

    if(action === "populateDatabase") {
        console.log('populate countries')
    
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllCountries`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                })
            });

            let buffer = await translateData(response)
           

     
            console.log(buffer)
            // await connectMongo();
            // let insert = await Countries.insertMany(buffer.result)
       
            return res.status(200).json({ result: buffer, success: true, insert: insert })
        } catch (e) {
            return res.status(200).json({ result: e, success: false })
        }   
    }
    if(action === "populateVat") {
        console.log('populate vat')
    
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllVat`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                })
            });

            let buffer = await translateData(response)
            console.log(buffer)
            await connectMongo();
            let insert = await Vat.insertMany(buffer.result)
            return res.status(200).json({ result: buffer.result, success: true, insert: insert })
        } catch (e) {
            return res.status(200).json({ result: e, success: false })
        }   
    }

    if(action === "findCountries") {
        try {
            await connectMongo();
            let countries = await Countries.find({})
            console.log(countries)
            return res.status(200).json({ result: countries, success: true })
        } catch (e) {
            return res.status(200).json({ result: e, success: false })
        }   
    }
    if(action === "findVat") {
        try {
            await connectMongo();
            let result = await Vat.find({})
            console.log(result)
            return res.status(200).json({ result: result, success: true })
        } catch (e) {
            return res.status(200).json({ result: e, success: false })
        }   
    }

 

}