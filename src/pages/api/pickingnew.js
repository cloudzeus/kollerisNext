
import Pickingnew from "../../../server/models/pickingnewModel";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../server/config";
export default async function handler(req, res) {
    const { action } = req.body;
    if (action === "createPurDoc") {
        const { mtrLines, TRDR, WHOUSE, supplier, remarks  } = req.body;

        //ALTER THE PRODUCTS ARRAY TO MATCH THE FORMAT OF THE API:
        let _newLines = mtrLines.map(item => {
            return {
                MTRL: item.MTRL,
                QTY1: item.QTY1,
            }
        })
        console.log('--------------- NEW LINES -----------------')
        console.log(_newLines)
        let purdoc = await createPurDoc(WHOUSE, TRDR, _newLines,  remarks  );
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
        const MTRLINES = result.NUMBEROFITEMS.MTRLINES;
        const INVOICE = result.NUMBEROFITEMS.INVOICE[0];
        
        console.log('--------------- INVOICE ID -----------------')
        console.log(result.NUMBEROFITEMS);
        
        const _MTRLINES = MTRLINES.map(item => {
            return {
                LINENUM: item.LINENUM,
                MTRL: item.MTRL,
                ERPCODE: item.KODIKOSERP,
                BARCODE: item.BARCODE,
                KODERGOSTASIOU: item.KODERGOSTASIOU,
                QTY: item.QTY,
                PRICE: item.PRICE,
                PRICE1: item.PRICE1,
                LINEVAL: item.LINEVAL,
                VATAMNT: item.VATAMNT,
                SALESCVAL: item.SALESCVAL,
                TRNLINEVAL: item.TRNLINEVAL,
                LTRNLINEVAL: item.LTRNLINEVAL,
                SXPERC: item.SXPERC,
            }
        })

        console.log('--------------- _____________MTRLINES -----------------')
        console.log(_MTRLINES)
        if(!result.success) {
            return res.status(200).json({ success: false, message: "Προέκυψε σφάλμα κατά την δημιουργία του παραστατικού. ERROR: INVOICE DETAILS " })
        }

        //CREATE PICKINGNEW DOCUMENT:

        await connectMongo();
        let createOBJ = {
            SALDOCNUM: saldocnum,
            REMARKS: remarks,
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
            MTRLINES: _MTRLINES,
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




    async function createPurDoc(whouse, trdr, mtrLines, remarks){
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/createPurDoc`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                SERIES: 2025,
                WHOUSE: whouse,
                REMARKS: remarks,
                TRDR: parseInt(trdr),
                MTRLINES: mtrLines
            })
        });
        let buffer = await translateData(response);

        return buffer;
    }

    async function getInvoiceId(saldoc) {
        console.log('saldoc ')
        console.log(saldoc)
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
        console.log('buffer invoices saldoc')
        console.log(buffer)
        return buffer;
    }

}