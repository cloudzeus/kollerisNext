import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';

import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
import { setGridData, setHeaders, setSelectedPriceKey, setData, setSelectedMongoKey } from '@/features/catalogSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import styled from 'styled-components';


const UploadCatalog = () => {
    const [loading, setLoading] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);
    const fileInputRef = useRef(null);
    const [fileLoading, setFileLoading] = useState(false)
    const router = useRouter();
    const { gridData, headers, data } = useSelector((state) => state.catalog)

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





const ChooseKey = ({ headers, selectedKey, setSelectedKey }) => {
    const dispatch = useDispatch();
    const onChange = (e) => {
        dispatch(setSelectedPriceKey(e.value.field))
        setSelectedKey(e.value)
        dispatch(setSelectedMongoKey({
            oldKey: e.value.field,
            related: 'COST'
        }))

    }
    return (
        <Dropdown value={selectedKey} onChange={onChange} options={headers} optionLabel="field" placeholder="Επιλογή Τιμής Κόστους"
            filter className="w-20rem mt-2" />
    )
}


export default UploadCatalog;

