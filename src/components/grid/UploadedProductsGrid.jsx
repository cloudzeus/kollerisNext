import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { useRouter } from 'next/router';



const UploadedProductsGrid = () => {
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 5,
        page: 1,
    });

    const handleFetch = async () => {
        let { data } = await axios.post('/api/uploadedProducts', { action: "fetchAll", skip: lazyState.first, limit: lazyState.rows })
        setData(data.result)
        setTotalRecords(data.totalRecords)

    }

    useEffect(() => {
        handleFetch()
    }, [])

    const onPage = (event) => {
        setlazyState(event);
    };
    return (
        <div className="col p-2 bg-white border-round">
            <div className=' p-1 mb-4 font-medium'>
                <span className='text-lg font-bold letter-spacing-1 '>ΠΡΟΙΟΝΤΑ ΑΠΟ ΚΑΤΑΛΟΓΟ</span>
                <div>
                    <span className='text-sm font-light'>Ο τελευταίος κατάλογος ανέβηκε </span>
                    <span className='text-sm font-bold '>{ data.length && data[0].createdAt.split('T')[0]} </span>
                    <span className='text-sm font-light'>στον προμηθευτή </span>
                    <span className='text-sm font-bold '>{data.length && data[0].SUPPLIER_NAME} </span>
                </div>

            </div>
            <DataTable
                value={data}
                tableStyle={{ minWidth: '50rem' }}
                first={lazyState.first}
                lazy
                rows={lazyState.rows}
                totalRecords={totalRecords}
                onPage={onPage}
                showGridlines
                paginator
                paginatorRight

                className='p-datatable-sm p-datatable-round'
            >
                <Column field="NAME" header="Όνομα"></Column>
                <Column field="SUPPLIER_NAME" header="Προμηθευτής"></Column>
                <Column field="STATUS" header="Status" body={Status}></Column>

            </DataTable>
        </div>

    )
}

const Status = ({STATUS}) => {
    let color;
    
    if(STATUS === 'created') {
        color = 'bg-green-500'
    } else if(STATUS === 'updated') {
        color = 'bg-orange-500'
    } else {
        color = 'bg-red-500'
    }

    return (
        <div className='p-2 border-circle flex align-items-center '>
                <div className={`mt-1 mr-1 border-circle ${color}`} style={{width: '4px', height: '4px'}}></div>
                <div>
                    <span>{STATUS === 'created' ? 'new' : STATUS}</span>
                </div>
        </div>
    )
}



export default UploadedProductsGrid