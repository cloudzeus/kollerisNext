import React, { useEffect, useState } from 'react'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'


const CompletedOrder = ({ mtrmark }) => {
    const [data, setData] = useState(false)
    const [statuses] = useState(['pending', 'done', 'rejected']);
    const [loading, setLoading] = useState(false)
    const [refetch, setRefetch] = useState(false) 
    const [expandedRows, setExpandedRows] = useState(null);
    const handleFetch = async () => {
            const {data} = await axios.post('/api/createOrder', {action: "findCompleted", mtrmark: mtrmark})
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
    }, [refetch])

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
    const onRowEditComplete = async (e) => {
        let { newData, index } = e;
        let { data } = await axios.post('/api/createOrder', { action: 'updateStatus', status: newData.status, id: newData._id })
        setRefetch(prev => !prev)
    };
    return (
        <div>
               <div className='mt-4 mb-5'>
               <p className="stepheader">Παραγγελίες σε προμηθευτές</p>

            <DataTable
                loading={loading}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={RowExpansionTemplate}
                onRowEditComplete={onRowEditComplete}
                value={data}
                editMode="row"
            >
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column header="Αρ. παραγγελίας" style={{ width: '120px' }} field="orderNumber"></Column>
                <Column header="Αρ. παραγγελίας" style={{ width: '120px' }} field="PURDOCNUM"></Column>
                <Column header="Όνομα προμηθευτή" field="supplierName"></Column>
                <Column header="Ημερομηνία" body={CreatedAt} field="createdAt"></Column>
                <Column header="Status" style={{ width: '120px' }} field="status" body={Status} editor={(options) => statusEditor(options)}></Column>
                <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>

             
            </DataTable>
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

const CreatedAt = ({ createdAt }) => {
    let splitdate = createdAt.split('T')[0]
    return (
        <div className='flex align-items-center'>
            <i className="pi pi-calendar mr-2"></i>
            <span className='text-600'>{splitdate}</span>
        </div>
    )
}
export default CompletedOrder;