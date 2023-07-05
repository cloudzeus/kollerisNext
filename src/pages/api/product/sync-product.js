

import axios from "axios";
import Markes from "../../../../server/models/markesModel";
import connectMongo from "../../../../server/config";
import { MtrCategory } from "../../../../server/models/categoriesModel";

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
            if (!notFoundAriadne) return res.status(200).json({ success: false, notFoundAriadne: [] });
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
            if (!notFoundSoftone) {
                return res.status(200).json({ success: false, result: [] });

            }
            // console.log(notFoundSoftone)
            return res.status(200).json({ success: true, result: notFoundSoftone });

        } catch (e) {
            return res.status(200).json({ success: false, result: [] });
        }

    }

    if (action === 'syncCategories') {
        console.log('sync categories')
        try {
            //1) find and compared databases
            //2) do they have childs and grandchilds?
            //3) insert them all with the children to mongo:

            await connectMongo();
            //find our database categories:
            const mongoArray = await MtrCategory.find();
            //find softone categories:

            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrCategory/getMtrCategory`;
            axios.defaults.headers.common['accept-encoding'] = null;
            let softone = await axios.get(URL, 
                {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        "Access-Control-Allow-Origin": "null",
                    }
                })
            console.log(softone.data.result)

          

           
          

            res.status(200).json({ success: true, result: softone.data.result });
            // let notFoundAriadne = resp.result.filter(o1 => {
            //     return !mongoArray.some((o2) => {
            //         return o1.MTRMARK == o2.softOne.MTRMARK
            //     });
            // });
            // if(!notFoundAriadne) return res.status(200).json({ success: false, notFoundAriadne: []});
            // return res.status(200).json({ success: true, notFoundAriadne: notFoundAriadne });
        }
        catch (e) {
            return res.status(400).json({ success: false, notFoundAriadne: [] });
        }
    }

}







const fetchSoftoneMarkes = async () => {
    let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/getMtrMark`;
    let { data } = await axios.post(URL)
    return data;
}