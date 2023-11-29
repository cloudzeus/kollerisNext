
import Pickingnew from "../../../server/models/pickingnewModel";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../server/config";
export default async function handler(req, res) {
    const { action } = req.body;
    if (action === "createPurDoc") {
        const { mtrLines, TRDR, WHOUSE, supplier,  } = req.body;

        //ALTER THE PRODUCTS ARRAY TO MATCH THE FORMAT OF THE API:
        let _newLines = mtrLines.map(item => {
            return {
                MTRL: item.MTRL,
                QTY1: item.QTY1,
            }
        })
        console.log('--------------- NEW LINES -----------------')
        console.log(_newLines)
        let purdoc = await createPurDoc(WHOUSE, TRDR, _newLines );
        console.log('--------------- PURDOC -----------------')
        console.log(purdoc)
        if(!purdoc.success) {
            return res.status(200).json({ success: false, message: "Προέκυψε σφάλμα κατά την δημιουργία του παραστατικού" })
        }
        //GET THE SALDOCNUM FROM THE FIRST API CALL:
        const saldocnum = purdoc.SALDOCNUM;
        //GET INVOICE DETAILS FROM SOFTONE:
        let result = await getInvoiceId(saldocnum);
        //GET THE TRDR AND MTRLINES FROM THE RESULT:
        const RESULT_TRDR = result.NUMBEROFITEMS.TRDR[0];
        const MTRLINES = result.NUMBEROFITEMS.MTRLINES[0];
        const INVOICE = result.NUMBEROFITEMS.INVOICE[0];
        
        console.log('--------------- INVOICE ID -----------------')
        console.log(result.NUMBEROFITEMS);
        

        if(!result.success) {
            return res.status(200).json({ success: false, message: "Προέκυψε σφάλμα κατά την δημιουργία του παραστατικού. ERROR: INVOICE DETAILS " })
        }

        //CREATE PICKINGNEW DOCUMENT:
        await connectMongo();
        let createOBJ = {
            SALDOCNUM: saldocnum,
            TRDR: INVOICE.TRDR,
            NAME: RESULT_TRDR.NAME,
            JOBTYPETRD: RESULT_TRDR.JOBTYPETRD,
            AFM: RESULT_TRDR.AFM,
            IRSDATA: RESULT_TRDR.IRSDATA,
            ZIP: RESULT_TRDR.ZIP,
            CITY: RESULT_TRDR.CITY,
            ADDRESS: RESULT_TRDR.ADDRESS,
            PHONE01: RESULT_TRDR.PHONE01,
            EMAIL:RESULT_TRDR.EMAIL,
            // --------------------------
            MTRLINES: {
                LINENUM: parseInt(MTRLINES.LINENUM),
                MTRL: parseInt(MTRLINES.MTRL),
                ERPCODE: MTRLINES.KODIKOSERP,
                BARCODE: MTRLINES.BARCODE,
                KODERGOSTASIOU: MTRLINES.KODERGOSTASIOU,
                QTY: parseInt(MTRLINES.QTY),
                PRICE: parseInt(MTRLINES.PRICE),
                PRICE1: parseInt(MTRLINES.PRICE),
                LINEVAL: parseInt(MTRLINES.LINEVAL),
                VATAMNT: parseInt(MTRLINES.VATAMNT),
                SALESCVAL: parseInt(MTRLINES.SALESCVAL),
                TRNLINEVAL: parseInt(MTRLINES.TRNLINEVAL),
                LTRNLINEVAL: parseInt(MTRLINES.LTRNLINEVAL),
                SXPERC: parseInt(MTRLINES.SXPERC),
            },
            INVOICE: {
                FINDOC: INVOICE.FINDOC,
                TRNDATE: INVOICE.TRNDATE,
                TAXSERIES: INVOICE.TAXSERIES,
                TAXSERIESNUM: INVOICE.TAXSERIESNUM,
                TURNOVER: INVOICE.TURNOVER,
                SHIPKIND: INVOICE.SHIPKIND,
                PAYMENT: INVOICE.PAYMENT,
            },
        }
        let createNewPicking = await Pickingnew.create(createOBJ);
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