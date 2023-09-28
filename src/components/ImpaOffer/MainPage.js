import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { Button } from 'primereact/button';
import { useSelector, useDispatch } from 'react-redux';
import StepHeader from '@/components/ImpaOffer/StepHeader';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import ImpaDataTable from '@/components/ImpaOffer/ImpaProductsTable';
import ProductsDataTable from '@/components/ImpaOffer/ProductTable';
import ChosenProducts from '@/components/ImpaOffer/ChosenProducts';
import ChooseCustomer from '@/components/ImpaOffer/ChooseCustomer';
import ChooseImpa from '@/components/ImpaOffer/ChooseImpa';
import CreateHolder from '@/components/ImpaOffer/HolderPage';
import Holders from '@/components/ImpaOffer/Holders';
import OffersPage from '@/components/ImpaOffer/OffersPage';
import CreateOffer from './CreateOffer';
const sources = [
    { name: 'Πηγή: Προϊόντα με Impa', id: 1 },
    { name: 'Πηγή: Όλα τα προϊόντα', id: 2 },

];





const MainPage = () => {

    const { selectedImpa, selectedClient, holderPage, offerPage, pageId } = useSelector(state => state.impaoffer)
    const [chooseImpa, setChooseImpa] = useState(true)
    useEffect(() => {
        if (selectedImpa) {
            setChooseImpa(false)
        }
    }, [selectedImpa])

    return (
        <div>
            {pageId == 1 ? (<CreateOffer />) : null}
            {pageId == 2 ? (<OffersPage />) : null}
            {pageId == 3 ? (<CreateHolder />) : null}
     
        </div>
    )
}





export default MainPage