

import axios from 'axios';
const storageZoneName = 'kolleris'
const region = 'storage'
const path = 'images'
const headers = {
  AccessKey: process.env.NEXT_PUBLIC_BUNNY_KEY,
  'Content-Type': 'application/octet-stream',
}



export default async function handler(req, res) {
    const {FINDOCTYPE, FINDOCNUM, PRINTFORM  } = req.body;
    console.log(FINDOCTYPE, FINDOCNUM, PRINTFORM)
        try {
            const URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.parastatika/getSoftOnePrint`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username : "Service",
                    password:"Service",
                    FINDOCTYPE:FINDOCTYPE, ///OI ΕΠΙΛΟΓΕΣ ΕΙΝΑΙ SALDOC (ΠΡΟΣΦΟΡΑ ΣΕ ΠΕΛΑΤΙ)  Ή PURDOC (PICKING)
                    FINDOCNUM:FINDOCNUM, //O ΚΩΔΙΚΌΣ ΤΟΥ ΠΑΡΑΣΤΑΤΙΚΟΥ ΠΟΥ ΔΗΜΙΟΥΡΓΉΤΑΙ ΟΤΑΝ ΚΑΛΕΙΣ ΤΗΝ ΜΕΘΟΔΟ
                    PRINTFORM:PRINTFORM //Ο ΚΩΔΙΚΟΣ ΤΗς ΦΟΡΜΑΣ ΕΚΤΥΠΩΣΗΣ ΓΙΑ ΤΟ PICKING ΕΙΝΑΙ 1012 ΕΝΩ ΓΙΑ ΟΛΑ ΤΑ SALDOC ΠΡΟΣΟΦΡΑ 1112 
                })
            });
            let resJson = await response.json();
            console.log(resJson.result)
            return res.status(200).json({ success: true, message: null, result: resJson.result })
        } catch (e) {
            return res.status(500).json({ success: false, result: null, message: "Προέκυψε σφάλμα κατά την δημιουργία PDF" })
        }
        

    
}