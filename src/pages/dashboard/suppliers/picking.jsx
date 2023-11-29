'use client'
import React, { useEffect, useState, useRef} from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import StepHeader from '@/components/StepHeader'
import { Toast } from 'primereact/toast'
import CreatedAt from '@/components/grid/CreatedAt'
import axios from 'axios'
import { Button } from 'primereact/button'
import MyDocument from '@/components/pdf/PickingPDF'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { setPrintState } from '@/features/pdfSlice'


const Picking= () => {
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)  
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });

   
    const [totalRecords, setTotalRecords] = useState(0);
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    }
    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    }
    const fetch  = async () => {
        setLoading(true)
        let {data} = await axios.post('/api/pickingnew', {action: "getPickingnew", skip: lazyState.first, limit: lazyState.rows})
        if(!data.success) {
            showError(data?.message)
            return;
        }
        setData(data.result)
        setTotalRecords(data.totalRecords)
        setLoading(false)
    }

    useEffect(() => {
        fetch()
    }, [lazyState])


    const handlePDF = () => {
        // ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);

    }

    const allowExpansion = (rowData) => {
        return rowData;
    };
   
  return (
    <AdminLayout>
        <Toast ref={toast} />
        {/* <MyDocument /> */}
        <StepHeader text="Παραστατικό Picking" />
        {/* <Button onClick={handlePDF} icon="pi pi-pdf" label={'Download Pdf'}/> */}
        <DataTable
                loading={loading}
                editMode="row"
                value={data}
                tableStyle={{ minWidth: '50rem' }}
                showGridlines
                paginator
                rows={10}
                rowsPerPageOptions={[10, 25, 50]}
                className='p-datatable-sm'
                paginatorRight
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
            >   
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column field="SUPPLIER" header="PDF" body={ViewPDF}></Column>
                <Column field="NAME" header="Όνομα"></Column>
                <Column field="AFM" header="ΑΦΜ"></Column>
                <Column field="ZIP" header="ZIP"></Column>
                <Column field="PHONE01" header="PHONE01"></Column>
                <Column field="ADDRESS" header="ADDRESS"></Column>
                <Column field="INVOICE.TAXSERIES" header="TAXSERIES"></Column>
                <Column field="createdAt" body={CreatedAt} header="Ημερομηνία Δημ."></Column>
            
            </DataTable>
    </AdminLayout>
  )
}


const rowExpansionTemplate = ({MTRLINES}) => {
    
    return (
        <div  >
        {/* <span className='font-semibold mb-2 mt-2 block'>Προϊόντα</span> */}
        <DataTable value={MTRLINES} className='w-full'>
            <Column field="LINENUM" header="LINENUM"></Column>
            <Column field="ERPCODE" header="ERP CODE"></Column>
            <Column field="BARCODE" header="Barcode"></Column>
            <Column field="KODERGOSTASIOU" header="Κωδ. Εργοστασίου"></Column>
            <Column field="QTY" header="ΠΟΣΟΤΗΤΑ"></Column>
            <Column field="PRICE" header="ΤΙΜΗ"></Column>
            <Column field="LINEVAL" header="ΣΥΝΟΛΟ ΤΙΜΗ"></Column>
        </DataTable>
    </div>
    );
};






const ViewPDF = (content) => {
    const dispatch = useDispatch()
    const {pdfState} = useSelector(state => state.pdf)
    const router = useRouter()
    const handleClick =() => {
        dispatch(setPrintState(content))
        router.push(`/dashboard/suppliers/pdf`)
    }
    return (
        <div>   
            <i onClick={handleClick} className="pi pi-eye cursor-pointer" style={{ fontSize: '1rem' }}></i>
        </div>
    )
}
export default Picking