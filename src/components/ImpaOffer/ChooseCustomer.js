
import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SelectImpa from '@/components/ImpaOffer/SelectImpas';
import { InputText } from 'primereact/inputtext';
import { setSelectedImpa, setSelectedProducts } from '@/features/impaofferSlice';
import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedClient } from '@/features/impaofferSlice';


const endContent = (
    <div className='mr-5'>
        <p className='font-bold text-lg'>ΟΝΟΜΑ ΠΕΛΑΤΗ:</p>
        <p>Καραμιτσιος</p>
    </div>
)


const ChooseCustomer = () => {
    const { selectedClient } = useSelector(state => state.impaoffer)
    const [showTable, setShowTable] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });
    const [totalRecords, setTotalRecords] = useState(0);
    const dispatch = useDispatch()

    const fetchClients = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/createOffer', {
            action: 'findClients',
            skip: lazyState.first,
            limit: lazyState.rows,
        })
        console.log(data.result)
        setData(data.result)
        setTotalRecords(data.totalRecords)
        setLoading(false)

    }
    
    useEffect(() => {
        fetchClients();
    }, [lazyState.rows, lazyState.first])

    const startContent = (
        <div className='w-full flex justify-content-between '>
            <Button label="Επιλογή Πελάτη" onClick={() => setShowTable(prev => !prev)} />
        </div>
    );
    const onSelectionChange = (e) => {
        dispatch(setSelectedClient(e.value))
    }

    const onPage = (event) => {
        setlazyState(event);
    };

    return (
        <>
            <Toolbar start={startContent} end={endContent} />
            {showTable ? (
                <DataTable
                paginator
                rows={lazyState.rows}
                rowsPerPageOptions={[5, 10, 20 ,50, 100, 200]}
                first={lazyState.first}
                lazy
                totalRecords={totalRecords}
                onPage={onPage}
                selectionMode={'radio'} 
                selection={selectedClient} 
                onSelectionChange={onSelectionChange}
                value={data} 
                className='border-1 border-round-sm	border-50' 
                size="small" 
                >
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="NAME" header="Όνομα Πελάτη"></Column>
                </DataTable>
            ) : null}

        </>
    )
}

export default ChooseCustomer