import axios from "axios";
import mongoose from "mongoose";
import connectMongo from "../../../../server/config";
import Manufacturers from "../../../../server/models/manufacturersModel";
export default async function handler(req, res) {

    let action = req.body.action;
    if (action === 'findAll') {
        try {
            await connectMongo();
            const subgroup = await Manufacturers.find({})
            return res.status(200).json({ success: true, result: subgroup });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }

    if (action === 'create') {
        try {
            let { data } = req.body
            console.log(data.NAME)
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrManufacture/createManufacture`;
            let addedSoftone = await axios.post(URL, {
                username: "Service",
                password: "Service",
                name: data.NAME
            })
            console.log(addedSoftone.data)


            if (!addedSoftone.data.success) return res.status(400).json({ success: false, result: null })
            await connectMongo();
            let insert = await Manufacturers.create({
                softOne: {
                    MTRMANFCTR: addedSoftone.data.kollerisPim.mtrmanfctr,
                    CODE: addedSoftone.data.kollerisPim.mtrmanfctr,
                    NAME: data.NAME,
                    ISACTIVE: 1,
                    COMPANY: "1001",
                },
                status: true,
                createdFrom: data.createdFrom
            })
            return res.status(200).json({ success: true, result: insert });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }

    if (action === 'update') {
      
        const {NAME, MTRMANFCTR, id, updatedFrom} = req.body;
     
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrManufacture/updateMtrManufacture`;
            let updateSoftone = await axios.post(URL, {
                username:"Service",
                password:"Service",
                company:1001,
                name:NAME,
                mtrmanfctr: MTRMANFCTR.toString()
            })

            console.log('data:')
            console.log(updateSoftone.data)
            if (!updateSoftone.data.success) return res.status(400).json({ success: false, result: null })
            await connectMongo();

            const obj = {
                softOne: {NAME: NAME},
                updatedFrom: updatedFrom
            }

            console.log(obj)
            const updatedManufacturers = await Manufacturers.findOneAndUpdate(
                { _id: id },
                obj,
                { new: true }
              );
              console.log(updatedManufacturers)
              return res.status(200).json({ success: true, result: updatedManufacturers, error: null });

        } catch (e) {
            return res.status(400).json({ success: false, result: null, error: 'Αποτυχία ενημέρωσης βάσης' });
        }
	
		
	

	}

    if (action === 'delete') {
        try {
            let id = req.body.id;
            const manufacturers = await Manufacturers.findOneAndUpdate(
                { _id: id  },
                {status: false},
                { new: true }
              );
            return res.status(200).json({ success: true, result: manufacturers, error: null });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }

    }

    if (action === 'populateDatabase') {
        try {
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.MtrManufacture/getMtrManufactures`;
            let addedSoftone = await axios.post(URL, {
                username: "Service",
                password: "Service",
            })
            //Add them to the database
            let manufacturers = addedSoftone.data.result
            let newArray = manufacturers.map((manufacturer) => {
                return {
                    softOne: manufacturer,
                    status: true,
                };
            })
            console.log(newArray)
            await connectMongo();
            let insert = await Manufacturers.insertMany(newArray)
            console.log(insert)


            return res.status(200).json({ success: true, result: addedSoftone.data.result });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }



}
