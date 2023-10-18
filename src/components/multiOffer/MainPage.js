'use client'
import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import CreateHolder from '@/components/multiOffer/HolderPage';
import OffersPage from '@/components/multiOffer/OffersPage';
import CreateOffer from './CreateOffer';





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