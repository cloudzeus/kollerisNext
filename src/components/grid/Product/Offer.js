import React, { useState, useContext, lazy } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { ProductQuantityContext } from '@/_context/ProductGridContext'
import CustomersGrid from '../clientGrid'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedClient } from '@/features/impaofferSlice'
const Offer = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const { selectedClient } = useSelector(state => state.impaoffer)
    const [filteredData, setFilteredData] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 15,
      

    });
    const [rowClick, setRowClick] = useState(true);


    const onSelection = (e) => {
        dispatch(setSelectedClient(e.value))
    }

    const onPage = (event) => {
        setlazyState(event);
    };


    const onSearch = async (event) => {
        const value = event.target.value;
        setSearchTerm(value)

    };

    useEffect(() => {
        let handleSearch = async () => {
            setLoading(true)
            let res = await axios.post('/api/clients/apiClients', { action: 'search', searchTerm: searchTerm, skip: lazyState.first, limit: lazyState.rows })
            console.log(res.data)
            setFilteredData(res.data.result)
            setTotalRecords(res.data.totalRecords)
            setLoading(false)
        }
        handleSearch();
    }, [searchTerm, lazyState.first, lazyState.rows])




    const renderHeader = () => {
        return (
            <div className="flex">
                <div className="">
                    <span className="p-input-icon-left mr-3">
                        <i className="pi pi-search" />
                        <InputText type="search" value={searchTerm} onChange={onSearch} placeholder="Αναζήτηση" />
                    </span>
                </div>
            </div>

        );
    };



    const header = renderHeader();

    return (
        <div>
            <div className='box'>

            </div>
            {!selectedClient ? (
                <CustomersGrid />
            ) : (
                <AfterClientSelection selectedClient={selectedClient} setSelectedClient={setSelectedClient}  />
            )}
        </div>
    )
}


const AfterClientSelection = () => {
    const dispatch = useDispatch();
    const {selectedProducts} = useContext(ProductQuantityContext)
    const { mtrlines } = useContext(ProductQuantityContext);
    const [saldoc, setSaldoc] = useState(null)
    const { selectedClient } = useSelector(state => state.impaoffer)

    const CalculateBasket = () => {
        let total = 0
        selectedProducts && selectedProducts.forEach((item) => {
            total += parseInt(item.PRICER)
        })
        return (
            <p className='mr-3 ml-3'> Σύνολο:<span className='font-bold ml-1'>{`${total},00$`}</span> </p>
        )
    }

    const sendOffer = async () => {
        console.log(selectedClient)
        // const obj = {
        //     TRDR: parseInt(selectedClient.TRDR),
        //     MTRLINES: mtrlines,
        // }

        // let { data } = await axios.post('/api/clients/apiClients', { action: 'sendOffer', data: obj })
        // setSaldoc(data.result)
    }


    return (
        <div>
            <Button label="Eπίλεξε Πελάτη" severity="warning" onClick={() => dispatch(setSelectedClient(null))} />
            <div className='surface-100 p-4 mt-3 mb-2 border-round'>
                <p className='text-lg font-bold '>Λεπτομέριες Πελάτη</p>
                <div className='mt-3'>
                    <span className='font-bold text-sm mr-2'>Κωδικός:</span>
                    <span className='text-sm'>{selectedClient.CODE}</span>
                </div>
                <div className='mt-2'>
                    <span className='font-bold text-sm mr-2'>Όνομα Πελάτη:</span>
                    <span className='text-sm'>{selectedClient.NAME}</span>
                </div>
                <div className='mt-2'>
                    <span className='font-bold text-sm mr-2'>Διεύθυνση:</span>
                    <span className='text-sm'>{selectedClient.ADDRESS}</span>
                </div>
                <div className='border-400 border-top-1  mt-3'>
                    <div className='flex mt-2'>
                        <p>Προϊόντα:</p>
                        <p className='ml-1 font-bold'>{selectedProducts.length}</p>
                        <CalculateBasket />
                    </div>
                    <div className='mt-4'>
                    </div>

                </div>
            </div>
            {saldoc ? (
                <div className='bg-yellow-400 inline-flex p-3'>
                    <p>Αριθμός Προσφοράς:</p>
                    <p className='font-bold ml-2 border-round'>{saldoc && saldoc.SALDOCNUM}</p>
                </div>
            ) :
            (<Button onClick={sendOffer} className='w-full mt-2' label="Aποστολή Προσφοράς" />)}

        </div>
    )
}

export default Offer