'use client';
import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import StepHeader from './StepHeader'
import { setPageId, setHolder } from '@/features/impaofferSlice'
import { useSelector, useDispatch } from 'react-redux'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';


const CreateOffer = () => {
    const [data, setData] = useState([])
    const [refetch, setRefetch] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const handleFetch = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/createOffer', { action: 'findHolders' })
        setData(data.result)
        setLoading(false)
    }
     

    const nextPage = () => {

        dispatch(setPageId(2))
    }
    useEffect(() => {
        handleFetch();
    }, [refetch])
    return (
        <div>
            <div>
                <Button icon="pi pi-plus" label="Δημιουργία Προσφοράς" severity='warning' onClick={nextPage} />
            </div>
            <div className='mt-4 ml-1'>
                <StepHeader text={"Tρέχουσες Προσφορές"} />
                {data ? (
                    <CustomDataTable data={data} refetch={refetch} loading={loading}  setRefetch={setRefetch}/>
                ) : (
                    <div className='p-4 bg-white border-round'>
                        <p>Δεν υπάρχουν προσφορές</p>
                    </div>
                )}
            </div>
        </div>
    )
}


const CustomDataTable = ({ data, setRefetch, loading }) => {
    const [expandedRows, setExpandedRows] = useState(null);
    const [statuses] = useState(['pending', 'done', 'rejected']);
    const [status, setStatus] = useState(null);

    const allowExpansion = (rowData) => {
        return rowData
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

    const RowExpansionTemplate = ({ holders }) => {
        return <RowExpansionGrid holders={holders} />
    }
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
        console.log(newData, index)
        let {data} = await axios.post('/api/createOffer', { action: 'updateStatus', status: newData.status, id: newData._id })
        setRefetch(prev => !prev)
    };

    return (
        <DataTable
            loading={loading}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={RowExpansionTemplate}
            value={data}
            editMode="row" 
            onRowEditComplete={onRowEditComplete} 
        >
            <Column expander={allowExpansion} style={{ width: '5rem' }} />
            <Column header="Όνομα Πελάτη" field="clientName"></Column>
            <Column header="Aριθμός Προσφοράς" field="num"></Column>
            <Column header="Status" field="status" body={Status} style={{width: '70px'}} editor={(options) => statusEditor(options)}></Column>
            <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        </DataTable>
    )
}

const RowExpansionGrid = ({ holders }) => {
    const [expandedRows, setExpandedRows] = useState(null);

    const allowExpansion = (rowData) => {
        return rowData
    };

    const RowExpansionTemplate = ({ products }) => {
        return <SubRowExpansionGrid products={products} />
    }

    return (
        <div className="p-2">
            <p className='mb-3 font-bold ml-1'>holders</p>
            <DataTable
             className='border-1 border-300'
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={RowExpansionTemplate}
                value={holders}
            >
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column header="Kωδικός Impa" field="impaCode"></Column>
                {/* <Column header="Σύνολο Προϊόντων" body={TotalProducts}></Column> */}
            </DataTable>
        </div>
    )
};

const SubRowExpansionGrid = ({ products }) => {
    return (
        <div>
            <p className='mb-3 font-bold ml-1'>Προϊόντα</p>
            <DataTable
                 className='border-1 border-400'
                value={products}
                >
                <Column header="Όνομα Προϊόντος" field="NAME"></Column>
                {/* <Column header="Σύνολο Προϊόντων" body={TotalProducts}></Column> */}
            </DataTable>
        </div>
    )
}


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
export default CreateOffer;