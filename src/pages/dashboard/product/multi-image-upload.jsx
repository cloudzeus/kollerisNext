import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';

import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
import { setGridData, setHeaders, setSelectedPriceKey, setData, setSelectedMongoKey } from '@/features/catalogSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const Page = () => {
    return (
        <AdminLayout>
            <Upload />
        </AdminLayout>
    )
}


const Upload = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { gridData, headers } = useSelector((state) => state.catalog)
    console.log(headers)



    useEffect(() => {
        if(!gridData.length) {
            router.push('/dashboard/product')
        }
    }, [])

    
    const handleAdd = async () => {
        let {data} = await axios.post('/api/product/apiProduct', {action: "csvImages", data: gridData.slice(0, 5)})
        console.log(data)
       
    }


    const Header = () => {
        return (
            <div>
                <Button label="Συγχρονισμος" icon="pi pi-upload" onClick={ handleAdd} />
            </div>
        )
    }
    const header = Header()
    return (
        <>
            <DataTable
                header={header}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                loading={loading}
                selectionMode="radiobutton"
                value={gridData}
                tableStyle={{ minWidth: '50rem' }}
            >
                {headers.map((header, index) => (
                    <Column key={header.field} field={header.field} header={header.field} />
                ))}
            </DataTable>
          
          
        </ >
    );
};

export default Page;
