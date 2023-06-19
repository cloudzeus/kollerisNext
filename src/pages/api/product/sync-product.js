

import axios from "axios";
import Markes from "../../../../server/models/markesModel";
import connectMongo from "../../../../server/config";


export default async function handler(req, res) {
    let { action } = req.body;
    console.log('sync product api')
    if (action === 'notFoundAriadne') {
        try {
        await connectMongo();
        const mongoArray = await Markes.find();
        let resp = await fetchSoftoneMarkes();
        let notFoundAriadne = resp.result.filter(o1 => {
            return !mongoArray.some((o2) => {
                return o1.MTRMARK == o2.softOne.MTRMARK
            });
        });
        if(!notFoundAriadne) return res.status(200).json({ success: false, notFoundAriadne: []});
        return res.status(200).json({ success: true, notFoundAriadne: notFoundAriadne });
        } 
        catch (e) {
            return res.status(400).json({ success: false, notFoundAriadne: [] });
        }

    }
    // console.log('NOT FOUND IN ARIADNE ' + JSON.stringify(notFoundAriadne))
    

    if (action === 'notFoundSoftone') {
        //data 2:
        try {
            await connectMongo();
            const mongoArray = await Markes.find();
            let resp = await fetchSoftoneMarkes();
            let notFoundSoftone = mongoArray.filter(o1 => {
                return !resp.result.some((o2) => {
                    // console.log(o2.softOne.MTRMARK)
                    return o1.softOne.MTRMARK == o2.MTRMARK; // return the ones with equal id
                });
            });
            if(!notFoundSoftone) {
                return res.status(200).json({ success:false, result: [] });

            }
            // console.log(notFoundSoftone)
            return res.status(200).json({ success: true, result: notFoundSoftone });

        } catch (e) {
            return res.status(200).json({ success: false ,result: [] });
        }



    }

}







const fetchSoftoneMarkes = async () => {
    let URL = `https://${process.env.SERIAL_NO}.${process.env.DOMAIN}/s1services/JS/mbmv.mtrMark/getMtrMark`;
    let { data } = await axios.post(URL)
    return data;
}