

import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { Button } from 'primereact/button';

import SelectImpa from '@/components/ImpaOffer/SelectImpas';
import { useSelector, useDispatch } from 'react-redux';

import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import ImpaDataTable from '@/components/ImpaOffer/ImpaProductsTable';
import ProductsDataTable from '@/components/ImpaOffer/ProductTable';
import ChosenProducts from '@/components/ImpaOffer/ChosenProducts';
import ChooseCustomer from '@/components/ImpaOffer/ChooseCustomer';

const sources = [
    { name: 'Πηγή: Προϊόντα με Impa', id: 1 },
    { name: 'Πηγή: Όλα τα προϊόντα', id: 2 },

];


export default function impaOffers() {
    const { selectedImpa } = useSelector(state => state.impaoffer)
    const [chooseImpa, setChooseImpa] = useState(true)
    useEffect(() => {
        if (selectedImpa) {
            setChooseImpa(false)
        }
    }, [selectedImpa])


    return (
        <AdminLayout>
            <ChooseCustomer />
            {/* <Button label="Επιλογή Impa" className='mb-3' onClick={() => { setChooseImpa(true) }} />
            {chooseImpa ? (<SelectImpa />) : (<PickListComp />)} */}
        </AdminLayout>

    );
}


const PickListComp = () => {
    const { selectedProducts } = useSelector(state => state.impaoffer)

    console.log('wtfwtf ---------------------')
    console.log(selectedProducts)
    const [dataSource, setDataSource] = useState(
        { name: 'Πηγή: Προϊόντα με Impa', id: 1 },
    )
    
    useEffect(() => {
        setDataSource( { name: 'Πηγή: Προϊόντα με Impa', id: 1 },)
    }, [])

    const onDataSourceChange = (e) => {
        setDataSource(e.value)
    }

    const startContent = (
        <React.Fragment>
            <Dropdown value={dataSource} onChange={onDataSourceChange} options={sources} optionLabel="name"
                placeholder="Επιλογή Πίνακα" className="w-full" />
        </React.Fragment>
    );


    return (
        <div >
            <div >
                <div className='col-12'>
                    
                    <Toolbar start={startContent} />
                    {dataSource.id == 1 ? (<ImpaDataTable />) : null}
                    {dataSource.id == 2 ? (<ProductsDataTable />) : null}
                </div>
                <div className='col-12 mt-4'>
                    { selectedProducts.length > 0  ? ( <ChosenProducts />) : null}
                   
                </div>
            </div>

        </div>
    )

}









