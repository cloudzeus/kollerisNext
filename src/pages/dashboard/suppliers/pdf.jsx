
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import Barcode from 'react-barcode';
import { InputNumber } from 'primereact/inputnumber';
import { usePDF } from 'react-to-pdf';
import Image from 'next/image'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FaFilePdf } from "react-icons/fa6";
import { Toolbar } from 'primereact/toolbar';

const Page = () => {
    const { printState } = useSelector(state => state.pdf)

    return (
        <AdminLayout>
            <MyDocument data={printState} />
        </AdminLayout>
    )
}

// const dataArray = [
//     {
//       NAME: "Product 1",
//       ERPCODE: "ABC123",
//       BARCODE: "123456789012",
//       QTY: 10,
//       PRICE: 49.99,
//       LINEVAL: 499.90,
//     },
//     {
//       NAME: "Product 2",
//       ERPCODE: "DEF456",
//       BARCODE: "234567890123",
//       QTY: 5,
//       PRICE: 29.99,
//       LINEVAL: 149.95,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 20,
//       PRICE: 19.99,
//       LINEVAL: 399.80,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 20,
//       PRICE: 19.99,
//       LINEVAL: 399.80,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 20,
//       PRICE: 19.99,
//       LINEVAL: 399.80,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 20,
//       PRICE: 19.99,
//       LINEVAL: 399.80,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 20,
//       PRICE: 19.99,
//       LINEVAL: 399.80,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 20,
//       PRICE: 19.99,
//       LINEVAL: 399.80,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 20,
//       PRICE: 19.99,
//       LINEVAL: 399.80,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 20,
//       PRICE: 19.99,
//       LINEVAL: 399.80,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 20,
//       PRICE: 19.99,
//       LINEVAL: 399.80,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     {
//       NAME: "Product 3",
//       ERPCODE: "GHI789",
//       BARCODE: "345678901234",
//       QTY: 10000000,
//       PRICE: 10000000,
//       LINEVAL: 10000000,
//     },
//     // Add similar objects for the remaining 4 items
//   ];
  


function MyDocument({ data }) {
    const [fontSize, setFontSize] = useState(16);
    const [sum, setSum] = useState(0);
    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
    let styleTop = {
        fontSize: `11px`,
        lineHeight: `1.2`,
    }
   

    
    const Start = () => {
    
        return (
            <div className="flex-auto">
            <label htmlFor="stacked-buttons" className="font-bold block mb-2">Font Size</label>
            <InputNumber inputId="stacked-buttons" value={fontSize} onValueChange={(e) => setFontSize(e.value)} showButtons  />
        </div>
        )
    }
    return (
        <div className=''>
            <Button severity='danger' className="mb-3" icon="pi pi-download" onClick={() => toPDF()}>Download PDF</Button>

            <Toolbar start={Start} />
            <div className=' bg-white p-4 border-round' ref={targetRef}>
                <div className='mt-2 flex justify-content-between '>
                    <div style={{fontSize: fontSize}}>
                        <p className='font-bold'>ΑΦΟΙ ΚΟΛΛΕΡΗ ΙΚΕ</p>
                        <p className='font-bold' >ΕΙΣΑΓΩΓΕΣ & ΕΜΠΟΡΙΟ ΕΡΓΑΛΕΙΩΝ & ΒΙΟΜΗΧΑΝΙΚΩΝ ΕΙΔΩΝ</p>
                        <p className='font-bold' >ΑΦΜ: 099095556 - ΔΟΥ: Ε' ΠΕΙΡΑΙΑ</p>
                        <p className='font-bold' >Αρ. Γ.Ε.ΜΗ: 044598907000</p>
                        <p className='font-bold'>Κ. ΜΑΥΡΟΜΙΧΑΛΗ 4 - ΠΕΙΡΑΙΑΣ 185 45</p>
                        <p className='font-bold' >ΤΗΛΕΦΩΝΑ: +30 210 4111 355 - +30 210 4113 754 - FAX: +30 210 4125 851</p>
                        <p className='font-bold'>ΤΗΛΕΦΩΝΑ: +30 210 4111 355 - +30 210 4113 754 - FAX: +30 210 4125 851</p>
                        <p className='font-bold' >WEB: https://kolleris.com - EMAIL: info@kolleris.com - accounts@kolleris.com - warehouse@kolleris.comΤ</p>
                    </div>
                    <div>
                        <img src="/uploads/logoPlain.png" style={{ width: '300px' }} />
                    </div>
                </div>
                {/* CONTACT INFO */}
                <div className='mt-4 border-1 border-200' style={{fontSize: fontSize}}>
                    <div className='surface-100 p-2' >
                        <span className='text-sm'>ΣΤΟΙΧΕΙΑ ΣΥΝΑΛΛΑΣΣΟΜΕΝΟΥ</span>
                    </div>
                    <div className='grid'>
                        <div className='col-6'>
                            <div className='p-2 border-bottom-1 border-300' style={{fontSize: fontSize}}>
                                <span className='font-bold'>ONOMA: </span>
                                <span className=''>{data.NAME} </span>
                            </div>
                            <div className='p-2 border-bottom-1 border-300'>
                                <span className=' font-bold'>EΠΩΝΥΜΙΑ: </span>
                                <span className=''>{data.NAME} </span>
                            </div>
                            <div className='p-2 border-bottom-1 border-300'>
                                <span className=' font-bold '>ΑΦΜ / ΔΟΥ: </span>
                                <span className=''>{data.NAME} </span>
                            </div>
                            <div className='p-2'>
                                <span className=' font-bold'>ΔΙΕΥΘΥΝΣΗ: </span>
                                <span className=''>{data.ADDRESS} </span>
                            </div>

                        </div>
                        <div className='col-6' style={{fontSize: fontSize}}>
                            <div className='p-2 border-bottom-1 border-300'>
                                <span className='font-bold'>EMAIL: </span>
                                <span className=''>{data.EMAIL} </span>
                            </div>
                            <div className='p-2 border-bottom-1 border-300'>
                                <span className=' font-bold'>ΤΗΛΕΦΩΝΟ: </span>
                                <span className=''>{data.PHONE01} </span>
                            </div>
                        </div>
                    </div>


                </div>
                
                <DataTable
                    style={{fontSize: fontSize}}
                    className='p-datatable-sm mt-4'
                    value={data.MTRLINES}>
                    <Column field="ΝΑΜΕ" header="ΕΙΔΟΣ" style={{ maxWidth: '400px' }}></Column>
                    <Column field="ERPCODE" header="ΚΩΔΙΚΟΣ"></Column>
                    <Column field="BARCODE" header="BARCODE" body={CreateBarcode}></Column>
                    <Column field="QTY" header="ΠΟΣΟΤΗΤΑ"></Column>
                    <Column field="PRICE" header="TIMH"></Column>
                    <Column field="LINEVAL" header="ΣΥΝΟΛΟ"></Column>
                </DataTable>
            </div>

        </div>
    )
}


const Footer = (props) => {
   
    let sum = 0;
    // MTRLINES.forEach(element => {
    //     sum += element.LINEVAL
    // });
    return (
        <div>
            <span className='font-light'>ΣΥΝΟΛΟ:</span>
            <span>{sum}</span>
        </div>
    )

}
const CreateBarcode = ({ BARCODE }) => {
    return (
        <Barcode value={BARCODE} width={1.4} height={50} fontSize={12} />
    )
}


export default Page;