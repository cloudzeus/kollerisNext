'use client';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageId, setDataSource, setShowImpaTable, setHolder, setSelectedProducts } from '@/features/impaofferSlice';
import StepHeader from '@/components/StepHeader';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import ChooseImpa from '@/components/ImpaOffer/ChooseImpa';
import ImpaDataTable from '@/components/ImpaOffer/ImpaProductsTable';
import ChosenProducts from '@/components/ImpaOffer/ChosenProducts';
import ProductsDataTable from '@/components/ImpaOffer/ProductTable';
import axios from 'axios';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';

function generateRandomId(length = 8) {
    return Math.random().toString(36).substr(2, length);
}


const ImpaHolder = () => {
    const dispatch = useDispatch();
    const { selectedClient, selectedProducts, holder, selectedImpa, mtrLines } = useSelector(state => state.impaoffer)
    const toast = useRef(null);
    const router = useRouter();
    useEffect(() => {
        dispatch(setSelectedProducts([]))
    }, [])

    const onHolderCompletions = async () => {
        dispatch(setHolder({
            id: generateRandomId(),
            impaCode: selectedImpa?.code,
            products: mtrLines
        }))

        //This is where we realte the chosen products to the selected impa and we add them to the database
        let {data} = await axios.post('/api/createOffer', {action: 'addProductsToImpa', impa: selectedImpa?.code, products: selectedProducts})
        //navigate back to create holder, where the array of created holders appear
        router.push('/dashboard/multi-offer/create-holder')
    }


    return (
        <AdminLayout >
            <div className='flex align-items-center justify-content-between mb-5'>
                <Button size="small" icon="pi pi-angle-left" label="Πίσω" onClick={() => dispatch(setPageId(2))} />
            </div>
            {/* <StepHeader text={"Δημιουργία Holder"} />
            <p>{selectedClient?.NAME}</p> */}
            <PickListComp />
            <div className='mt-4 mb-5'>
            <Button icon="pi pi-angle-right" disabled={selectedProducts.length === 0} label="Ολοκλήρωση Holder" onClick={onHolderCompletions} />
            </div>
        </AdminLayout>
    )
}




const PickListComp = () => {
    const { selectedProducts, selectedImpa, dataSource, showImpaTable } = useSelector(state => state.impaoffer)
    const [show, setShow] = useState(true)


    return (
        <div >
            <div className='mt-4' >
                    <StepHeader text={"Eπιλογή Impa"} />
                    <CustomToolbar setShow={setShow} show={show} />
                    {showImpaTable ? (<ChooseImpa />) : null}

                    {(!showImpaTable && selectedImpa) ? (
                        <div>
                            {(dataSource == 2 && show) ? (<ProductsDataTable />) : null}
                            {(dataSource == 1 && show )  ? (<ImpaDataTable />) : null}
                    </div>
                    ) : null}
                    


            </div>
            <div className='col-12 mt-6'>
                {selectedProducts.length > 0 ? (
                    <div>
                        <StepHeader text={`Συνολο Προϊόντων για Impa ${selectedImpa?.code}:`} />
                        <ChosenProducts />
                    </div>
                ) : null}

            </div>
        </div>
    )

}


const CustomToolbar = ({setShow, show }) => {
    const { selectedImpa, dataSource } = useSelector(state => state.impaoffer)
    const dispatch = useDispatch()

    const onAllProductsClick = () => {
        dispatch(setShowImpaTable(false))
        dispatch(setDataSource(2))
    }

    const resetToImpa = () => {
        dispatch(setDataSource(1))
    }
    
    const StartContent = () => {
        return (
            <div className='w-full flex justify-content-between '>
                  <Button severity='secondary' label={`Eπιλογή Impa: ${( selectedImpa) ? selectedImpa?.code : '' }`} onClick={() => dispatch(setShowImpaTable((true)))} />
            </div>
        )
    }


    const EndContent = () => {
        return (
            <div className=''>
            {dataSource == 1 ? ( <Button icon="pi pi-tag" disabled={!selectedImpa} severity='warning' label="όλα τα Προϊόντα" onClick={onAllProductsClick} />) : null}
            {dataSource == 2 ? ( <Button icon="pi pi-tag" disabled={!selectedImpa}  label={`Προϊόντα του IMPA: ${selectedImpa?.code }`} onClick={resetToImpa} />) : null}
            <Button icon={`pi  ${!show ? "pi-angle-down" : " pi-angle-up"  }`} className='ml-3' severity='secondary' onClick={() => setShow(prev => !prev)} />
        </div>
        )
    }

    return (
        <Toolbar start={StartContent} end={EndContent} />
    )
}


export default ImpaHolder;