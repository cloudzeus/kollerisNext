

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useSelector, useDispatch } from 'react-redux';


import MainPage from '@/components/multiOffer/MainPage';
import HolderPage from '@/components/multiOffer/HolderPage';



const ImpaOffers = () => {
    const { selectedImpa, selectedClient, holderPage } = useSelector(state => state.impaoffer)
    const [chooseImpa, setChooseImpa] = useState(true)
    useEffect(() => {
        if (selectedImpa) {
            setChooseImpa(false)
        }
    }, [selectedImpa])


    return (
        <AdminLayout>
           <div className='p-2'>
           <MainPage />
           </div>
        </AdminLayout>

    );
}





export default ImpaOffers;








