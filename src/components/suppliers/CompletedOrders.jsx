import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown'
import StepHeader from '../multiOffer/StepHeader';
import { Tag } from 'primereact/tag'
import CreatedAt from '@/components/grid/CreatedAt'
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button'
import SendOrderEmail from '../emails/SendOrderEmail'

const CompletedOrders = ({ id }) => {
    const [data, setData] = useState(false)
    const [loading, setLoading] = useState(false)
    const [refetch, setRefetch] = useState(false) 
    const [expandedRows, setExpandedRows] = useState(null);
    const {orderReady} = useSelector(state => state.supplierOrder)
    const handleFetch = async () => {
            const {data} = await axios.post('/api/createOrder', {action: "findCompleted", TRDR: id})
            setData(data.result)
    }
    const allowExpansion = (rowData) => {
        return rowData
    };
    const RowExpansionTemplate = ({ products, NAME, supplierEmail }) => {
        return <RowExpansionGrid products={products} NAME={NAME} supplierEmail={supplierEmail} />
    }
    useEffect(() => {
        handleFetch();
    }, [refetch, id, orderReady])

   
    
    const onRowEditComplete = async (e) => {
        let { newData, index } = e;
        let { data } = await axios.post('/api/createOrder', { action: 'updateStatus', status: newData.status, id: newData._id })
        setRefetch(prev => !prev)
    };


    
    
  
    const Actions = ({TRDR, supplierName, supplierEmail, products, _id }) => {
        const op = useRef(null);
        const onBulletsClick = (e) => {
            op.current.toggle(e)
        }

      
        const handleDelete = async (e) => {
             const {data} = await axios.post('/api/createOrder', {action: 'deleteCompletedOrder', id: _id, TRDR: TRDR})
            setRefetch(prev => !prev)
        }
        return (
            <div>
                <i className="pi pi-ellipsis-v pointer" style={{ fontSize: '1.1rem', color: 'blue' }} onClick={onBulletsClick}></i>
                <OverlayPanel className='w-15rem' ref={op}>
                    <SendOrderEmail
                        mt={2}
                        email={supplierEmail}
                        products={products}
                        name={supplierName}
                        id={_id}
                        TRDR={id}
                        setRefetch={setRefetch}
                        op={op}
                    />
                    <Button onClick={handleDelete} className='mt-2 w-full' severity='danger' label="Διαγραφή" icon="pi pi-trash" />
                </OverlayPanel>

            </div>
        )
    }

    return (
        <div>
               <div className='mt-4 mb-5'>
            <StepHeader text="Προς Αποστολή" />
            {data && data.length ? (
                 <DataTable
                 loading={loading}
                 expandedRows={expandedRows}
                 onRowToggle={(e) => setExpandedRows(e.data)}
                 rowExpansionTemplate={RowExpansionTemplate}
                 onRowEditComplete={onRowEditComplete}
                 value={data}
                 editMode="row"
                 showGridlines
             >
                 <Column expander={allowExpansion} style={{ width: '5rem' }} />
                 <Column header="Κωδ. Παραστατικού" style={{ width: '120px' }} field="PURDOCNUM"></Column>
                 <Column header="Όνομα προμηθευτή" field="supplierName"></Column>
                 <Column header="Ημερομηνία" body={CreatedAt} field="createdAt"></Column>
                 <Column header="Status" style={{ width: '120px' }} field="status"></Column>
                 <Column  body={Actions} style={{ width: "90px" }}></Column>

             </DataTable>
            ) : (
                <div className='p-4 bg-white border-round'>
                    <p>Δεν υπάρχουν ολοκληρωμένες παραγγελίες</p>
                </div>
            )}
        </div>
        </div>
    )

}

const RowExpansionGrid = ({ products }) => {

    return (
        <div className="p-2">
            <p className='mb-3 font-bold ml-1'>Προϊόντα Παραγγελίας</p>
            <DataTable
                className='border-1 border-300'
                value={products}
            >
                <Column header="Όνομα" field="NAME"></Column>
                <Column header="PR" style={{ width: '60px' }} field="PRICE"></Column>
                <Column header="QT" style={{ width: '60px' }} field="QTY1"></Column>
            </DataTable>
        </div>
    )
};

const Status = ({ status }) => {
    let color;
    if(status === 'pending') color = "bg-green-500"
    if(status === 'done') color = "bg-orange-500"
    if(status === 'rejected') color = "bg-red-500"
  
    return (
        <div className='flex align-items-center '>
            
            <span  className={`mt-1 ${color} border-circle`} style={{width: '5px', height: '5px'}}>
            </span >
            <span className='ml-2 text-600'>{status.toUpperCase()}</span>
        </div>
    )
}


export default CompletedOrders;