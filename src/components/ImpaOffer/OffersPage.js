import React, { useState } from 'react'
import { Button } from 'primereact/button'
import StepHeader from './StepHeader'
import ChooseCustomer from './ChooseCustomer'
import { useDispatch, useSelector } from 'react-redux'
import { setPageId } from '@/features/impaofferSlice'


const ΟffersPage = () => {
    const dispatch = useDispatch()
    const { selectedClient, holder } = useSelector(state => state.impaoffer)
    return (
        <div>
            <div className='flex align-items-center justify-content-between mb-5'>
                <Button size="small" icon="pi pi-angle-left" label="Πίσω" onClick={() => dispatch(setPageId(1))} />
            </div>
            <StepHeader text={"Επιλογή Πελάτη"} />
            <ChooseCustomer />
            <div className=''>
                <div className='bg-white mt-3 border-round p-4 flex align-item-center justify-content-between'>
                    <div>
                        <Button icon="pi pi-plus" disabled={!selectedClient} label="Νέο Holder" severity='warning' onClick={() => dispatch(setPageId(3))} />
                    </div>
                </div>
                <div className='mt-2'>
                    < MapHolders />
                </div>
            </div>
        </div>
    )
}


const MapHolders = () => {
    const { holder } = useSelector(state => state.impaoffer)
    const [showContent, setShowContent] = useState(null)

    const dropDownClick = (id) => {
        console.log(id)
        setShowContent(id)
    }
    return (
        <div className='mb-2'>
            {holder.map((item, index) => (
                <div key={index} className='bg-white mb-2 border-round'>
                    <div className='top flex justify-content-between p-4'>
                        <div className='flex' >
                            <div className='mr-3 border-right-1 pr-3 border-400'>
                                {(showContent == item.id) ? (
                                    <i onClick={() => dropDownClick(null)} className="pi pi-angle-up" style={{ fontSize: '1.3rem' }}></i>
                                ) : (
                                    <i onClick={() => dropDownClick(item.id)} className="pi pi-angle-down" style={{ fontSize: '1.3rem' }}></i>
                                )}

                            </div>

                            <p>IMPA CODE:</p>
                            <p className='font-bold ml-2'>{item.name}</p>
                        </div>
                        <div>
                            <div className='flex'>
                                <p>Σύνολο Προϊόντων:</p>
                                <p className='font-bold ml-2 pr-3'>{item.products.length}</p>
                                <div className='ml-2 pl-4 border-left-1 border-400'>
                                    <i className="pi pi-trash cursor-pointer" style={{ fontSize: '1.3rem', color: 'red' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* //HIDDEN CONTENT */}
                    <div className='p-4 border-top-1 border-300' >
                        {showContent == item.id ? (
                            <MapProducts products={item.products} />
                        ) : null}
                    </div>
                </div>

            ))}
        </div>
    )
}


const MapProducts = ({ products }) => {
    return (
        <div>
            {products.map((item, index) => {
                console.log(item)
                return (
                    <div className='p-2' key={index}>
                        <p>{item.NAME}</p>
                    </div>

                )
            })}
        </div>
    )
}

export default ΟffersPage;