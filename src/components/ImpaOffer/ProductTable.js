
import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { setSelectedImpa, setSelectedProducts } from '@/features/impaofferSlice';
import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';


const ProductsDataTable = () => {
    const { selectedProducts } = useSelector(state => state.impaoffer)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 5,
        page: 1,
    });
    const [totalRecords, setTotalRecords] = useState(0);
    const dispatch = useDispatch()

    const handleFetchProducts = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/createOffer', {
            action: 'findProducts',
            skip: lazyState.first,
            limit: lazyState.rows,
        })
        console.log(data.result)
        setData(data.result)
        setTotalRecords(data.totalRecords)
        setLoading(false)

    }

    useEffect(() => {
        handleFetchProducts()
    }, [lazyState.rows, lazyState.first])

    const onSelectionChange = (e) => {
        dispatch(setSelectedProducts(e.value))
    }

    const onPage = (event) => {
        setlazyState(event);
    };
    return (
        <DataTable
            loading={loading}
            paginator
            rows={lazyState.rows}
            rowsPerPageOptions={[5, 10, 20 ,50, 100, 200]}
            first={lazyState.first}
            lazy
            totalRecords={totalRecords}
            onPage={onPage}
            selectionMode={'checkbox'} selection={selectedProducts} onSelectionChange={onSelectionChange}
            value={data} 
            className='border-1 border-round-sm	border-50' 
            size="small" 
            >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            <Column field="Επιλέξτε από όλα τα Προϊόντα" header="Προϊόν" body={itemTemplate}></Column>
        </DataTable>
    )
}


const itemTemplate = (item) => {
    return (
        <div className="flex flex-wrap p-2 align-items-center gap-3">
            <div className="flex-1 flex flex-column gap-2">
                <span className="font-bold">{item.NAME}</span>
                <div className="flex align-items-center gap-2">
                    <i className="pi pi-tag text-sm"></i>
                    <span>{item.CODE}</span>
                </div>
            </div>
            <span className="font-bold text-900">${item.PRICER}</span>
        </div>
    );
};

export default ProductsDataTable;