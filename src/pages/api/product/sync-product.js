

import axios from "axios";
import Markes from "../../../../server/models/markesModel";
import connectMongo from "../../../../server/config";
import { MtrCategory } from "../../../../server/models/categoriesModel";

export default async function handler(req, res) {
    let { action } = req.body;


    if (action === 'notFoundBrands') {
        try {
            await connectMongo();
            const mongoArray = await Markes.find();
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/getMtrMark`;
            let { data } = await axios.post(URL)
            let notFoundBrands= data .result.filter(o1 => {
                return !mongoArray.some((o2) => {
                    return o1.MTRMARK == o2.softOne.MTRMARK
                });
            });
            if (!notFoundBrands) return res.status(200).json({ success: false, result: [] });
            return res.status(200).json({ success: true, result: notFoundBrands });
        }
        catch (e) {
            return res.status(400).json({ success: false, result: [] });
        }

    }
    // console.log('NOT FOUND IN ARIADNE ' + JSON.stringify(notFoundAriadne))



   

}






