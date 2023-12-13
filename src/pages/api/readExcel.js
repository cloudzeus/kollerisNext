import XLSX from 'xlsx'

export default async function handler(req, res) {

    const excelfile = await fetch('/../../_assets/impas.xlsx').then((response) => response.blob())
    console.log(excelfile)
    
    return res.status(200).json({ response: true })

}