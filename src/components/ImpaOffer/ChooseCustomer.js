
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedClient } from '@/features/impaofferSlice';
import StepHeader from './StepHeader';




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

 
    const onSelectionChange = (e) => {
        dispatch(setSelectedClient(e.value))
        setShowTable(false)
    }

    const onPage = (event) => {
        setlazyState(event);
    };

    return (
        <>  
            <StepHeader  text={"Βήμα 1:"}/>
            <CustomToolbar setShowTable={setShowTable} />
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

const CustomToolbar = ({setShowTable}) => {
    const { selectedClient } = useSelector(state => state.impaoffer)
    const startContent = (
        <div className='w-full flex justify-content-between '>
            <Button severity='secondary' label="Επιλογή Πελάτη" onClick={() => setShowTable(prev => !prev)} />
        </div>
    );

    const endContent = (
        <div className='mr-5 w-15rem'>
              <p className='font-bold text-lg'>ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ:</p>
            <p>{selectedClient?.NAME}</p>
        </div>
    )

    return (
        <>
                    <Toolbar start={startContent} end={endContent} />

        </>
    )
}

export default ChooseCustomer