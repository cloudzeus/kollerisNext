import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setPageId, setDataSource, setShowImpaTable, setHolder, setSelectedProducts } from '@/features/impaofferSlice';
import StepHeader from './StepHeader';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import ChooseImpa from './ChooseImpa';
import ImpaDataTable from './ImpaProductsTable';
import ChosenProducts from './ChosenProducts';
import ProductsDataTable from './ProductTable';


function generateRandomId(length = 8) {
    return Math.random().toString(36).substr(2, length);
}






const HolderPage = () => {
    const dispatch = useDispatch();
    const { selectedClient, selectedProducts, holder, selectedImpa } = useSelector(state => state.impaoffer)

    console.log('SELECTED PRODUCTS')
    console.log(selectedProducts)

    console.log('holderrrrrrr')
    console.log(holder)

    useEffect(() => {
        dispatch(setSelectedProducts([]))
    }, [] )


    const onHolderCompletions = () => {
        dispatch(setHolder({
            id: generateRandomId(),
            name: selectedImpa?.code,
            products: selectedProducts
        }))
        dispatch(setPageId(2))
    }

   
    return (
        <div className=''>
            <div className='flex align-items-center justify-content-between mb-5'>
                <Button size="small" icon="pi pi-angle-left" label="Πίσω" onClick={() => dispatch(setPageId(2))} />
            </div>
            <StepHeader text={"Δημιουργία Holder"} />
            <p>{selectedClient?.NAME}</p>
            <PickListComp />
            <div className='mt-4 mb-5'>
            <Button icon="pi pi-angle-right" disabled={selectedProducts.length === 0} label="Ολοκλήρωση Holder" onClick={onHolderCompletions} />
            </div>
        </div>
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
                {dataSource == 1 ? ( <Button icon="pi pi-tag" severity='warning' label="όλα τα Προϊόντα" onClick={onAllProductsClick} />) : null}
                {dataSource == 2 ? ( <Button icon="pi pi-tag"  label={`Προϊόντα του IMPA: ${selectedImpa?.code }`} onClick={resetToImpa} />) : null}
                <Button icon={`pi  ${!show ? "pi-angle-down" : " pi-angle-up"  }`} className='ml-3' severity='secondary' onClick={() => setShow(prev => !prev)} />
            </div>
        )
    }

    return (
        <Toolbar start={StartContent} end={EndContent} />
    )
}


export default HolderPage;