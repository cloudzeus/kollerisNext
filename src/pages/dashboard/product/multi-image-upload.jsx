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
            <UploadProductImages/>
        </AdminLayout>
    )
}


export const UploadProductImages = () => {
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
        for(let i = 0; i < gridData.length; i++){
        // for(let i = 0; i < 4; i++){
            let { data } = await axios.post('/api/product/apiProduct', { action: "csvImages", data: gridData[i], index: i, total: gridData.length},)
            console.log(data.result)
            setReturendData(prev => [...prev, data.result])
        }
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
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginator

                    >
                        <Column header="Προϊόν" field='NAME' />
                        <Column header="Κωδικός" field='CODE' />
                        <Column header="Κωδικός" body={Image} />
                        <Column header="Num" field={'updatedToTotal'}/>
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
