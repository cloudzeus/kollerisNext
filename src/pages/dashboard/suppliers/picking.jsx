'use client'
import React, { useEffect, useState, useRef} from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import StepHeader from '@/components/StepHeader'
import { Toast } from 'primereact/toast'
import CreatedAt from '@/components/grid/CreatedAt'
import axios from 'axios'

const Picking= () => {
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
  return (
    <AdminLayout>
        <Toast ref={toast} />
        <StepHeader text="Παραστατικό Picking" />
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
            >
                <Column field="SUPPLIER" header="Όνομα"></Column>
                <Column field="SALDOCNUM" header="SALDOCNUM"></Column>
                <Column field="createdAt" body={CreatedAt} header="Ημερομηνία Δημ."></Column>
                <Column header="INVOICE_STATUS" field="INVOICE_STATUS"  style={{ width: '160px' }}></Column>
            
            </DataTable>
    </AdminLayout>
  )
}

export default Picking