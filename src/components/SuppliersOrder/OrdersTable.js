'use client';
import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { useSelector, useDispatch } from 'react-redux'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import StepHeader from '../ImpaOffer/StepHeader';
import { set } from 'mongoose';

const OrdersTable = () => {
    const [data, setData] = useState([])
    const [refetch, setRefetch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [expandedRows, setExpandedRows] = useState(null);
    const [statuses] = useState(['pending', 'done', 'rejected']);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 5,
        page: 1,
    });
  
    const allowExpansion = (rowData) => {
        return rowData
    };

    const handleFetch = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/createOrder', { action: 'findOrders', skip: lazyState.first, limit: lazyState.rows })
        setData(data.result)
        setTotalRecords(data.totalRecords)
        setLoading(false)
    }

    useEffect(() => {
        handleFetch();
    }, [refetch, lazyState.rows, lazyState.first])
    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };
    const getSeverity = (value) => {
        switch (value) {
            case 'pending':
                return 'success';

            case 'done':
                return 'warning';

            case 'rejected':
                return 'danger';

            default:
                return null;
        }
    };

    const onPage = (event) => {
        setlazyState(event);
    };

    const RowExpansionTemplate = ({ products }) => {
        return <RowExpansionGrid products={products} />
    }

    const onRowEditComplete = async (e) => {
        let { newData, index } = e;
        console.log(newData, index)
        let { data } = await axios.post('/api/createOrder', { action: 'updateStatus', status: newData.status, id: newData._id })
        setRefetch(prev => !prev)
    };
    return (
        <div className='mt-6'>
            <StepHeader text="Παραγγελίες σε προμηθευτές" />
            <DataTable
                lazy
                rows={lazyState.rows}
                paginator
                totalRecords={totalRecords}
                onPage={onPage}
                first={lazyState.first}

                loading={loading}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={RowExpansionTemplate}
                value={data}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
            >
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column header="Αρ. παραγγελίας" field="orderNumber"></Column>
                <Column header="PURDOCNUM" field="PURDOCNUM"></Column>
                <Column header="Όνομα προμηθευτή" field="NAME"></Column>
                <Column header="email" body={EmailTemplate} field="supplierEmail"></Column>
                <Column header="Ημερομηνία Προσφοράς" body={DateTemplate} field="createdAt"></Column>
                <Column header="Status" field="status" body={Status} style={{ width: '70px' }} editor={(options) => statusEditor(options)}></Column>
                <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
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
                <Column header="Ποσότητα" field="QUANTITY"></Column>
                <Column header="Συν.Τιμή" field="TOTAL_PRICE"></Column>
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

const DateTemplate = ({createdAt}) => {
    return (
        <div>
            <i className="pi pi-calendar" style={{ color: 'slateblue' }}></i>
            <span className='ml-2'>{createdAt.split('T')}</span>
        </div>
    )
}
const EmailTemplate = ({supplierEmail}) => {
    return (
        <div className='flex align-items-center'>
            <i className="pi pi-envelope mt-1" style={{ color: 'slateblue', fontSize: '15px' }}></i>
            <span className='ml-2'>{supplierEmail}</span>
        </div>
    )
}
export default OrdersTable