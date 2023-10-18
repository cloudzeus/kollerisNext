'use client';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageId, setDataSource, setShowImpaTable, setHolder } from '@/features/impaofferSlice';
import { setSelectedProducts } from '@/features/productsSlice';
import StepHeader from '@/components/StepHeader';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import ChooseImpa from '@/components/multiOffer/ChooseImpa';
import ImpaDataTable from '@/components/multiOffer/ImpaProductsTable';
import axios from 'axios';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useRouter } from 'next/router';
import ProductSearchGrid from '@/components/grid/ProductSearchGrid';
import SelectedProducts from '@/components/grid/SelectedProducts';
function generateRandomId(length = 8) {
    return Math.random().toString(36).substr(2, length);
}


const ImpaHolder = () => {
    const dispatch = useDispatch();
    const { selectedProducts, mtrLines } = useSelector(state => state.products)

    const { selectedClient, holder, selectedImpa } = useSelector(state => state.impaoffer)
    const toast = useRef(null);
    const router = useRouter();
    useEffect(() => {
        dispatch(setSelectedProducts([]))
        if(!selectedClient) {
            router.push('/dashboard/multi-offer')
        }
    }, [])
  

    const onHolderCompletions = async () => {
        let subString = selectedImpa?.greekDescription || selectedImpa?.englishDescriptio
        let fullName = selectedImpa?.code + ': ' + subString
        dispatch(setHolder({
            id: generateRandomId(),
            name: fullName,
            products: mtrLines
        }))


        //OPEN IT AGAIN 
        // let {data} = await axios.post('/api/createOffer', {action: 'addProductsToImpa', impa: selectedImpa?.code, products: selectedProducts})
        //navigate back to create holder, where the array of created holders appear
        router.push('/dashboard/multi-offer/create-holder')
    }


    return (
        <AdminLayout >
            <div className='flex align-items-center justify-content-between mb-5'>
                <Button size="small" icon="pi pi-angle-left" label="Πίσω" onClick={() => dispatch(setPageId(2))} />
            </div>
            <PickListComp />
            <div className='mt-4 mb-5'>
                {selectedProducts.length !== 0 ? (<Button icon="pi pi-angle-right" disabled={selectedProducts.length === 0} label="Ολοκλήρωση Holder" onClick={onHolderCompletions} />
                ) : null}
            </div>
        </AdminLayout>
    )
}




const PickListComp = () => {
    const { selectedImpa, dataSource, showImpaTable } = useSelector(state => state.impaoffer)
    const { selectedProducts } = useSelector(state => state.products)
    const [show, setShow] = useState(true)


    return (
        <div >
            <div className='mt-4' >
                <StepHeader text={"Eπιλογή Impa"} />
                <CustomToolbar setShow={setShow} show={show} />
                {showImpaTable ? (<ChooseImpa />) : null}

                {(!showImpaTable && selectedImpa) ? (
                    <div>
                        {(dataSource == 2 && show) ? (<ProductSearchGrid />) : null}
                        {(dataSource == 1 && show) ? (<ImpaDataTable />) : null}
                    </div>
                ) : null}



            </div>
            <div className='col-12 mt-6'>
                {selectedProducts.length > 0 ? (
                    <div>
                        <StepHeader text={`Συνολο Προϊόντων για Impa ${selectedImpa?.code}:`} />
                        <SelectedProducts />
                    </div>
                ) : null}

            </div>
        </div>
    )

}


const CustomToolbar = ({ setShow, show }) => {
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
                <Button severity='secondary' label={`Eπιλογή Impa: ${(selectedImpa) ? selectedImpa?.code : ''}`} onClick={() => dispatch(setShowImpaTable((true)))} />
            </div>
        )
    }


    const EndContent = () => {
        return (
            <div className=''>
                {dataSource == 1 ? (<Button icon="pi pi-tag" disabled={!selectedImpa} severity='warning' label="όλα τα Προϊόντα" onClick={onAllProductsClick} />) : null}
                {dataSource == 2 ? (<Button icon="pi pi-tag" disabled={!selectedImpa} label={`Προϊόντα του IMPA: ${selectedImpa?.code}`} onClick={resetToImpa} />) : null}
                <Button icon={`pi  ${!show ? "pi-angle-down" : " pi-angle-up"}`} className='ml-3' severity='secondary' onClick={() => setShow(prev => !prev)} />
            </div>
        )
    }

    return (
        <Toolbar start={StartContent} end={EndContent} />
    )
}


export default ImpaHolder;