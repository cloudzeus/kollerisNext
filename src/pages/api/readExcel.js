import XLSX from 'xlsx'

export default async function handler(req, res) {

    const excelfile = await fetch('/../../_assets/impas.xlsx').then((response) => response.blob())
    console.log(excelfile)
    // const workbook = XLSX.readFile('_assets/impas.xlsx');
    // console.log('workbook')
    // console.log(workbook)
    // const sheetName = workbook.SheetNames[0];
    // const worksheet = workbook.Sheets[sheetName];
    // const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    // console.log(data)
    return res.status(200).json({ response: true })

}