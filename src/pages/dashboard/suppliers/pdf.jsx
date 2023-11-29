
import { useSelector } from 'react-redux';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import Barcode from 'react-barcode';

import { usePDF } from 'react-to-pdf';
import Image from 'next/image'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const Page = () => {
    const { printState } = useSelector(state => state.pdf)
    console.log('printState')
    console.log(printState)
    return (
        <AdminLayout>
            
            <MyDocument data={printState} />
        </AdminLayout>
    )
}



function MyDocument({ data }) {
    console.log('data')
    console.log(data)
    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
    let styleTop = {
        fontSize: `11px`,
        lineHeight: `1.2`,
    }
    return (
        <div className=''>
            <Button severity='danger' className="mb-2"  icon="pi pi-download" onClick={() => toPDF()}>Download PDF</Button>
            <div className=' bg-white p-4 border-round' ref={targetRef}>
                <div className='mt-2 flex justify-content-between '>
                    <div>
                        <p className='font-bold' style={styleTop}>ΑΦΟΙ ΚΟΛΛΕΡΗ ΙΚΕ</p>
                        <p className='font-bold' style={styleTop}>ΕΙΣΑΓΩΓΕΣ & ΕΜΠΟΡΙΟ ΕΡΓΑΛΕΙΩΝ & ΒΙΟΜΗΧΑΝΙΚΩΝ ΕΙΔΩΝ</p>
                        <p className='font-bold' style={styleTop}>ΑΦΜ: 099095556 - ΔΟΥ: Ε' ΠΕΙΡΑΙΑ</p>
                        <p className='font-bold' style={styleTop}>Αρ. Γ.Ε.ΜΗ: 044598907000</p>
                        <p className='font-bold' style={styleTop}>Κ. ΜΑΥΡΟΜΙΧΑΛΗ 4 - ΠΕΙΡΑΙΑΣ 185 45</p>
                        <p className='font-bold' style={styleTop}>ΤΗΛΕΦΩΝΑ: +30 210 4111 355 - +30 210 4113 754 - FAX: +30 210 4125 851</p>
                        <p className='font-bold' style={styleTop}>ΤΗΛΕΦΩΝΑ: +30 210 4111 355 - +30 210 4113 754 - FAX: +30 210 4125 851</p>
                        <p className='font-bold' style={styleTop}>WEB: https://kolleris.com - EMAIL: info@kolleris.com - accounts@kolleris.com - warehouse@kolleris.comΤ</p>
                    </div>
                    <div>
                        <img src="/uploads/logoPlain.png" style={{ width: '200px' }} />
                    </div>
                </div>
                {/* CONTACT INFO */}
                <div className='mt-3 border-1 border-200'>
                    <div className='surface-100 p-2' >
                        <span className='text-sm'>ΣΤΟΙΧΕΙΑ ΣΥΝΑΛΛΑΣΣΟΜΕΝΟΥ</span>
                    </div>
                    <div className='grid'>
                        <div className='col-6'>
                            <div className='p-2 border-bottom-1 border-300'>
                                <span className='text-sm font-bold'>ONOMA: </span>
                                <span className='text-sm'>{data.NAME} </span>
                            </div>
                            <div className='p-2 border-bottom-1 border-300'>
                                <span className='text-sm font-bold'>EΠΩΝΥΜΙΑ: </span>
                                <span className='text-sm'>{data.NAME} </span>
                            </div>
                            <div className='p-2 border-bottom-1 border-300'>
                                <span className='text-sm font-bold '>ΑΦΜ / ΔΟΥ: </span>
                                <span className='text-sm'>{data.NAME} </span>
                            </div>
                            <div className='p-2'>
                                <span className='text-sm font-bold'>ΔΙΕΥΘΥΝΣΗ: </span>
                                <span className='text-sm'>{data.ADDRESS} </span>
                            </div>
                         
                        </div>
                        <div className='col-6'>
                            <div className='p-2 border-bottom-1 border-300'>
                                <span className='text-sm font-bold'>EMAIL: </span>
                                <span className='text-sm'>{data.EMAIL} </span>
                            </div>
                            <div className='p-2 border-bottom-1 border-300'>
                                <span className='text-sm font-bold'>ΤΗΛΕΦΩΝΟ: </span>
                                <span className='text-sm'>{data.PHONE01} </span>
                            </div>
                        </div>
                    </div>


                </div>
                {/* PRODUCTS */}
                <DataTable  
                    footer={Footer}
                    className='p-datatable-sm mt-4'
                    value={data.MTRLINES}>
                    <Column field="ΝΑΜΕ" header="ΕΙΔΟΣ" style={{maxWidth: '400px'}}></Column>
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
    console.log('footer props')
    console.log(props)
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
const CreateBarcode = ({BARCODE}) => {
    return (
        <Barcode value={BARCODE} width={1} height={30} fontSize={12}/>
    )
}


export default Page;