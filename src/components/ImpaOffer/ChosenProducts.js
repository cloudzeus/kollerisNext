
import React, { useState, useEffect } from 'react';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { deleteSelectedProduct } from '@/features/impaofferSlice';
const ChosenProducts = () => {
    const { selectedProducts } = useSelector(state => state.impaoffer)
    const [length, setLength] = useState(selectedProducts.length)
 
    
    useEffect(() => {
            setLength(selectedProducts.length)
    }, [selectedProducts])

   
  
    return (
        <DataTable
            paginator
            rows={5}
            totalRecords={length}
            rowsPerPageOptions={[5, 10, 20 ,50, 100, 200]}
            value={selectedProducts} 
            className='border-1 border-round-sm	border-50' 
            size="small"
            >
            <Column field="Επιλέξτε από όλα τα Προϊόντα" header="Προσφορά" body={itemTemplate}></Column>
            <Column style={{width: '30px'}}   body={RemoveTemplate}></Column>
        </DataTable>
    )
}


const RemoveTemplate = (item) => {
    const dispatch = useDispatch()
    return (
        <div className="flex flex-wrap p-2 align-items-center gap-3 border-left-1 border-400 pl-3">
            <i className="pi pi-trash text-red-400" onClick={() => dispatch(deleteSelectedProduct(item._id))}></i>
        </div>
    );
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

export default ChosenProducts;