
import Pickingnew from "../../../server/models/pickingnewModel";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../server/config";
export default async function handler(req, res) {
    const { action } = req.body;
    if (action === "createPurDoc") {
        const { mtrLines, TRDR, WHOUSE, supplier,  } = req.body;

        let _newLines = mtrLines.map(item => {
            return {
                MTRL: item.MTRL,
                QTY1: item.QTY1,
            }
        })

        console.log(_newLines , TRDR, WHOUSE, supplier)
      
        let purdoc = await createPurDoc(WHOUSE, TRDR, _newLines );
        console.log('--------------- PURDOC -----------------')
        console.log(purdoc)
        if(!purdoc.success) {
            return res.status(200).json({ success: false, message: "Προέκυψε σφάλμα κατά την δημιουργία του παραστατικού" })
        }
       
        const saldocnum = purdoc.SALDOCNUM;
        console.log('--------------- SALDOCNUM -----------------')
        console.log(saldocnum)
        //GET INVOICE DETAILS FROM SOFTONE:
        let result = await getInvoiceId(saldocnum);
        console.log('--------------- INVOICE ID -----------------')
        console.log(result.NUMBEROFITEMS);
        

        if(!result.success) {
            return res.status(200).json({ success: false, message: "Προέκυψε σφάλμα κατά την δημιουργία του παραστατικού. ERROR: INVOICE DETAILS " })
        }

        //CREATE PICKINGNEW DOCUMENT:
        await connectMongo();
        let createNewPicking = await Pickingnew.create({
                TRDR: TRDR,
                SUPPLIER: supplier,
                PRODUCTS: mtrLines,
                SALDOCNUM: saldocnum,
                WHOUSE: WHOUSE,
                INVOICE_STATUS: true,
            })
        console.log(createNewPicking);
        return res.status(200).json({ success: true, message: "Το παραστατικό δημιουργήθηκε με επιτυχία" })
    }


    if(action === "getPickingnew") {
        const {skip, limit} = req.body;
        await connectMongo();
        try {
            let pickingnew = await Pickingnew.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
            let totalRecords = await Pickingnew.countDocuments();
            return res.status(200).json({ success: true, message: null, result: pickingnew, totalRecords: totalRecords })
        } catch(e) {
            return res.status(500).json({ success: false, result: null, message: "Προέκυψε σφάλμα κατά την ανάκτηση των παραστατικών" })
        }
    }
    async function createPurDoc(whouse, trdr, mtrLines){
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/createPurDoc`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                SERIES: 2025,
                WHOUSE: whouse,
                TRDR: parseInt(trdr),
                MTRLINES: mtrLines
            })
        });
        let buffer = await translateData(response);
        console.log('buffer')
        console.log(buffer)
        return buffer;
    }

    async function getInvoiceId(saldoc) {
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/invoiceDetailsa`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                COMPANY: 1001,
                INVOICEID: saldoc
            })
        });
        let buffer = await translateData(response)
        console.log('buffer')
        return buffer;
    }

}