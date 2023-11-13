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
import { Toolbar } from 'primereact/toolbar';
import UpdatedAt from '@/components/grid/UpdatedAt';
import XLSXDownloadButton from '@/components/exportCSV/Download';
const Page = () => {
    return (
        <AdminLayout>
            <Upload />
        </AdminLayout>
    )
}


const Upload = () => {
    const [loading, setLoading] = useState(false);
    const [returnedData, setReturendData] = useState([]);
    const router = useRouter();
    const { gridData, headers } = useSelector((state) => state.catalog)



    useEffect(() => {
        if (!gridData.length) {
            router.push('/dashboard/product')
        }
    }, [])


    const handleAdd = async () => {
        setLoading(true)

        let items = 0;
        let _data = []
        while (items < 3) {
            let { data } = await axios.post('/api/product/apiProduct', { action: "csvImages", data: gridData[items] })
            console.log(data.result)
            items += 1;
            _data.push(data.result)
        }
      
        setReturendData(_data)
        setLoading(false)
    }


    const Start = () => {
        return (
            <div>
                <Button loading={loading} disabled={loading} label="Συγχρονισμος" icon="pi pi-upload" onClick={handleAdd} />
            </div>
        )
    }
    const End = () => {
        return (
            <div>
                <XLSXDownloadButton data={returnedData} filename="images" />
            </div>
        )
    }
    return (
        <>
            <Toolbar start={Start} end={End}/>
            {!returnedData.length ? (
                <DataTable
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    selectionMode="radiobutton"
                    value={gridData}
                    tableStyle={{ minWidth: '50rem' }}
                >
                    {headers.map((header, index) => (
                        <Column key={header.field} field={header.field} header={header.field} />
                    ))}
                </DataTable>
            ) : (
                <div>
                    <DataTable
                        value={returnedData}
                        tableStyle={{ minWidth: '50rem' }}
                    >
                        <Column header="Προϊόν" field='NAME' />
                        <Column header="Κωδικός" field='CODE' />
                        <Column header="Κωδικός" body={Image} />
                        <Column header="UpdatedAt" field='updatedAt' body={UpdatedAt} />
                    </DataTable>
                </div>
            )}



        </ >
    );
};
const Image = ({ images }) => {
    return (
        <div>
            <span>{images[0].name}</span>
        </div>
    )
}



export default Page;
