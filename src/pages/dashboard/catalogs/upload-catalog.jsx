import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
import {  useSelector } from 'react-redux';


const UploadCatalog = () => {
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { gridData, headers } = useSelector((state) => state.catalog)


 
    return (
        <AdminLayout >

            <div className='mt-2'>
                <DataTable
                    header="Πίνακας Καταλόγου"
                    loading={loading}
                    selectionMode="radiobutton"
                    value={gridData.slice(0, 5)}
                    tableStyle={{ minWidth: '50rem' }}
                >
                    {headers.map((header, index) => (
                        <Column key={header.field} field={header.field} header={header.field} />
                    ))}
                </DataTable>
                <div>
                    <Button
                        label="Eπόμενο"
                        icon="pi pi-arrow-right"
                        className="mb-2 mt-3 bg-success"
                        onClick={() => {
                            router.push('/dashboard/catalogs/other-keys')
                        }}
                    />
                </div>
            </div>

        </AdminLayout >
    );
};








export default UploadCatalog;

