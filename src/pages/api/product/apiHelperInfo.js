
import connectMongo from "../../../../server/config";
import { MtrGroup, MtrCategory } from "../../../../server/models/categoriesModel";
import translateData from "@/utils/translateDataIconv";
import Vat from "../../../../server/models/vatModel";
import Countries from "../../../../server/models/countriesModel";
import Intrastat from "../../../../server/models/intrastatMode";
import Currency from "../../../../server/models/currencyModel";
import Unit from "../../../../server/models/unitsModel";

export default async function handler(req, res) {

    const { action } = req.body



    if(action === "findCountries") {
        try {
            await connectMongo();
            let countries = await Countries.find({})
            return res.status(200).json({ result: countries, success: true })
        } catch (e) {
            return res.status(200).json({ result: e, success: false })
        }   
    }
    if(action === "findVat") {
        try {
            await connectMongo();
            let result = await Vat.find({}, { _id: 0, PERCNT: 1, NAME: 1, VAT: 1 })
            return res.status(200).json({ result: result, success: true })
        } catch (e) {
            return res.status(200).json({ result: e, success: false })
        }   
    }
    if(action === "findIntrastats") {
        try {
            await connectMongo();
            let result = await Intrastat.find({})
            return res.status(200).json({ result: result, success: true })
        } catch (e) {
            return res.status(200).json({ result: e, success: false })
        }   
    }
    if(action === "findCurrencies") {
        try {
            await connectMongo();
            let result = await Currency.find({})
            return res.status(200).json({ result: result, success: true })
        } catch (e) {
            return res.status(200).json({ result: e, success: false })
        }   
    }
    if(action === "findUnits") {
        try {
            await connectMongo();
            let result = await Unit.find({})
            return res.status(200).json({ result: result, success: true })
        } catch (e) {
            return res.status(200).json({ result: e, success: false })
        }   
    }

 

}