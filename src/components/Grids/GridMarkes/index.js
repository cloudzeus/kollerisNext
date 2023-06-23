'use client'
import React, { useState, useEffect } from 'react';
// import { Container, GridActions, GridContainer } from './styles';
import { IndexWrapper, GridActions } from '@/componentsStyles/grid/gridStyles';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import Link from 'next/link';
// import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
    AddIcon,
    EditIcon,
} from './config';
import { FormAdd } from './formAdd';
import { FormEdit } from './formEdit';
import Grid from './Grid';
import { useSelector } from 'react-redux';
import { setSelectedId, setAction } from '@/features/grid/gridSlice';
import SoftOneExtra from './softone/addAllSoftone';
import { ImList2 } from 'react-icons/im';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { ProductService } from './service/ProductService';
import Image from 'next/image';



const GridTable = () => {
    const [id, setId] = useState(null);
    const { selectedId, action } = useSelector(state => state.grid)
    const dispatch = useDispatch();
    const handleAction = (action) => {
        dispatch(setAction(action))
    }
    const handleCancel = () => {
        dispatch(setAction(null))
        dispatch(setSelectedId(null))
    }

  
    const showComponents = () => {
        switch (action) {
            case 'add':
                return <FormAdd />
            case 'edit':
                return <FormEdit />
            case 'findSoftoneExtra':
                return <SoftOneExtra />
            default:
                return <Grid id={id} setId={setId} />
        }
    }

   


    return (
        <IndexWrapper p="0px" className="box">
            <div className="header">
                <h2 className="boxHeader">Μάρκες</h2>
            </div>
            <div className="innerContainer" >
              
                <GridActions action={action}>
                    <button className="grid-icon" onClick={handleCancel} >
                        <ImList2 />
                    </button>
                    <button className="grid-icon" onClick={handleCancel} >
                        <MdOutlineKeyboardBackspace />
                    </button>
                    <button
                        className={(action !== 'add' && action !== null) ? 'disabled' : ''}
                        disabled={(action !== 'add' && action !== null) ? true : false}
                        onClick={() => handleAction('add')}>
                        <AddIcon className={(action !== 'add' && action !== null) ? 'disabled' : ''} /> Προσθήκη
                    </button>
                    <button
                        className={(action !== 'edit' && action !== null) ? 'disabled' : ''}
                        disabled={(action !== 'edit' && action !== null) ? true : false}
                        onClick={() => {
                            if (selectedId) {
                                handleAction('edit')
                            } else { toast.error('Δεν έχετε επιλέξει εγγραφή') }
                        }}>
                        <EditIcon className={(action !== 'edit' && action !== null) ? 'disabled' : ''} /> Διόρθωση
                    </button>

                </GridActions>
                <Button variant="outlined" sx={{ marginLeft: '10px', marginBottom: '10px' }}>
                    <Link href="/dashboard/product/sync-items">Νεες Εγγραφες</Link>
                </Button>
                <div>
                    <>
                        {showComponents()}
                    </>

                </div>

            </div>

        </IndexWrapper>

    )

}




export default function TemplateDemo() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        ProductService.getProductsMini().then((data) => setProducts(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const imageBodyTemplate = (product) => {
        return (
            <Image
            src={`/uploads/1685705325908_mountain.jpg`}
            alt="mountain"
            fill={true}
            sizes="40px"
        />
        );
    };

    const priceBodyTemplate = (product) => {
        return formatCurrency(product.price);
    };

    const ratingBodyTemplate = (product) => {
        return <Rating value={product.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (product) => {
        return <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>;
    };

    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Products</span>
            <Button icon="pi pi-refresh" rounded raised />
        </div>
    );
    const footer = `In total there are ${products ? products.length : 0} products.`;

    return (
        <div className="card">
            <DataTable value={products} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                <Column field="name" header="Name"></Column>
                <Column header="Image" body={imageBodyTemplate}></Column>
                <Column field="price" header="Price" body={priceBodyTemplate}></Column>
                <Column field="category" header="Category"></Column>
                <Column field="rating" header="Reviews" body={ratingBodyTemplate}></Column>
                <Column header="Status" body={statusBodyTemplate}></Column>
            </DataTable>
        </div>
    );
}
        



export default GridTable;



