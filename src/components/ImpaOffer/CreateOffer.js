import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import StepHeader from './StepHeader'
import { setPageId, setHolder } from '@/features/impaofferSlice'
import { useSelector, useDispatch } from 'react-redux'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { DataView } from 'primereact/dataview';



const CreateOffer = () => {
    const [data, setData] = useState([])
    const dispatch = useDispatch()
    const handleFetch = async () => {
        let { data } = await axios.post('/api/createOffer', { action: 'findHolders' })
        setData(data.result)
    }


    const nextPage = () => {

        dispatch(setPageId(2))
    }
    useEffect(() => {
        handleFetch();
    }, [])
    return (
        <div>
            <div>
                <Button icon="pi pi-plus" label="Δημιουργία Προσφοράς" severity='warning' onClick={nextPage} />
            </div>
            <div className='mt-4 ml-1'>
                <StepHeader text={"Tρέχουσες Προσφορές"} />
                {data ? (
                    <CustomDataTable data={data} />
                ) : (
                    <div className='p-4 bg-white border-round'>
                        <p>Δεν υπάρχουν προσφορές</p>
                    </div>
                )}
            </div>
        </div>
    )
}


const CustomDataTable = ({ data }) => {
    const [expandedRows, setExpandedRows] = useState(null);

    const allowExpansion = (rowData) => {
        return rowData
    };

    return (
        <DataTable
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={RowExpansionTemplate}
            value={data}
        >
            <Column expander={allowExpansion} style={{ width: '5rem' }} />
            <Column header="Όνομα Πελάτη" field="clientName"></Column>
            <Column header="Status" field="status"></Column>
        </DataTable>
    )
}

const RowExpansionTemplate = ({ holders }) => {
    const [expandedRows2, setExpandedRows2] = useState(null);
    const TotalProducts = () => {
        return (
            <div className='flex align-items-center justify-content-between'>
                <p>{holders.products?.length}</p>
            </div>
        )
    }


    return (
        <div className="p-2">
            <p className='mb-3 font-bold ml-1'>holders</p>
            <DataTable
                expandedRows={expandedRows2}
                onRowToggle={(e) => setExpandedRows2(e.data)}
                rowExpansionTemplate={rowExpansionTemplate2}
                value={holders}
            >
                {/* <Column expander={allowExpansion} style={{ width: '5rem' }} /> */}
                <Column header="Kωδικός Impa" field="impaCode"></Column>
                {/* <Column header="Σύνολο Προϊόντων" body={TotalProducts}></Column> */}
            </DataTable>
        </div>
    )
};

const rowExpansionTemplate2 = ({ products }) => {
    return (
        <div>

        </div>
    )
}



export default CreateOffer;