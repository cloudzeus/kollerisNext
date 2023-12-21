'use client'
import React, { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import StepHeader from '@/components/StepHeader'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import { addMoreToHolder, removeHolder, removeProductFromHolder, setHolder } from '@/features/impaofferSlice'
import { useRouter } from 'next/router'
import { setSelectedProducts } from '@/features/productsSlice'
import { useSession } from 'next-auth/react'


function generateOfferNum(length) {
    const max = Math.pow(10, length) - 1; // Generates a number like 999999 for length = 6
    const min = Math.pow(10, length - 1); // Generates a number like 100000 for length = 6
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}


const ΟffersPage = () => {
    const dispatch = useDispatch();
    const { selectedClient, holder, offerEmail } = useSelector(state => state.impaoffer)
    const router = useRouter()
    const { data: session, update } = useSession();
    let user = session?.user?.user;



    const finalizeOffer = async () => {
        let { data } = await axios.post('/api/createOffer', {
            action: 'addOfferDatabase',
            holders: holder,
            client: selectedClient,
            email: offerEmail,
            createdFrom: user?.lastName,
            num: generateOfferNum(6)
        })
        router.push('/dashboard/multi-offer')
    }




    const createImpaHolder = () => {
        dispatch(setSelectedProducts([]))
        router.push('/dashboard/multi-offer/create-impa-holder')
    }

    const createHolder = () => {
        dispatch(setSelectedProducts([]))
        router.push('/dashboard/multi-offer/plain-holder')

    }
    return (
        <AdminLayout>
            <div className='flex align-items-center justify-content-between mb-5'>
                <Button size="small" icon="pi pi-angle-left" label="Πίσω" onClick={() => router.back()} />
            </div>
            <div className='mt-5'>
                <StepHeader text={"Δημιουργία Holders"} />
                <div className='bg-white mt-3 border-round p-4 '>
                    <div>
                        <Button icon="pi pi-plus" className='w-15rem' label="Νέο Holder με Impa" severity='warning' onClick={createImpaHolder} />
                    </div>
                    <div className='mt-2'>
                        <Button icon="pi pi-plus" className='w-15rem' label="Nέο Holder Χωρίς Impa" severity='secondary' onClick={createHolder} />
                    </div>
                </div>
                <div className='mt-2'>
                    {holder.length > 0 ? (< MapHolders />) : null}
                </div>
                {holder.length > 0 ? (
                    <Button
                        onClick={finalizeOffer}
                        disabled={holder.length === 0}
                        raised className='mt-2 mb-4' label="Ολοκλήρωση" />
                ) : null}


            </div>
        </AdminLayout>
    )
}


const MapHolders = () => {
    const { holder } = useSelector(state => state.impaoffer)
    const [showContent, setShowContent] = useState(null)
    const router = useRouter();
    const dispatch = useDispatch();
    const dropDownClick = (id) => {
        setShowContent(id)
    }

    const deleteHolderHandler = (id) => {
        dispatch(removeHolder(id))
    }

    const handleAddMore = (item) => {
        console.log('handle add more')
        dispatch(setSelectedProducts([]))
        console.log(item)
        if (item.isImpa) {
            router.push(`/dashboard/multi-offer/add-more-to-impa/${item.id}`)
        }
        // dispatch(addMoreToHolder({ id: item.id, products: [
        //     {
        //         NAME: "SWIVEL ΒΕΡΓΑΣ J24000 MBP1",
        //         COST: 24.74,
        //         MTRL: "64002",
        //         PRICE:  10,
        //         QTY1: 4,
        //         TOTAl_COST: 186,
        //      },
        //     {
        //         NAME: "test",
        //         COST: 24.74,
        //         MTRL: "64002",
        //         PRICE:  10,
        //         QTY1: 1,
        //         TOTAl_COST: 24.74,
        //      }
        // ]}))
        // if(item.hasImpa) {
        //     dispatch(setSelectedProducts([]))
        //     router.push('/dashboard/multi-offer/create-impa-holder')
        // }
        // if(!item.hasImpa) {
        //     dispatch(setSelectedProducts([]))
        //     router.push('/dashboard/multi-offer/plain-holder')
        // }

    }
    return (
        <div className='mb-2'>
            {holder && holder.map((item, index) => (
                <div key={index} className='bg-white mb-2 border-round'>
                    <div className='top flex align-items-center justify-content-between p-4'>
                        <div className='flex' >
                            <div className='mr-3 border-right-1 pr-3 border-400'>
                                {(showContent == item?.id) ? (
                                    <i onClick={() => dropDownClick(null)} className="pi pi-angle-up" style={{ fontSize: '1.3rem' }}></i>
                                ) : (
                                    <i onClick={() => dropDownClick(item?.id)} className="pi pi-angle-down" style={{ fontSize: '1.3rem' }}></i>
                                )}

                            </div>
                            <div>
                                <p className='block size-xs'>Όνομα holder:</p>
                                <p className='font-bold mt-1'>{item?.name}</p>
                            </div>
                        </div>
                        <div>
                            <div className='flex align-items-center'>
                                <p>Σύνολο Προϊόντων:</p>
                                <p className='font-bold ml-2 pr-3'>{item?.products?.length}</p>
                                <div className='ml-2 pl-4 border-left-1 border-400'>
                                    <i className="pi pi-trash cursor-pointer" style={{ fontSize: '1.3rem', color: 'red' }} onClick={() => deleteHolderHandler(item?.id)}></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* //HIDDEN CONTENT */}
                    <div className='border-top-1 border-300' >
                        {showContent == item?.id ? (
                            <>
                                <MapProducts products={item?.products} holderId={item?.id} />
                                <div className='p-3'>
                                    <Button icon="pi pi-plus" onClick={() => handleAddMore(item)} severity='secondary'></Button>
                                </div>
                            </>

                        ) : null}
                    </div>
                </div>

            ))}
        </div>
    )
}


const MapProducts = ({ products, holderId }) => {
    const dispatch = useDispatch();

    const handleRemove = (product) => {
        dispatch(removeProductFromHolder({
            holderId: holderId,
            product: product
        }))
    }
    return (
        <div>
            {products && products.map((item, index) => {
                return (
                    <div className=' border-bottom-1 border-400 ' key={index}>
                        <div className='p-4 flex justify-content-between'>
                            <div >
                                <p className='text-md'>{item.NAME}</p>
                            </div>
                            <div className='flex align-items-center justify-content-between'>
                                <div style={{width: '230px'}} className='flex align-items-center justify-content-between '>
                                    <div className='flex mr-5 '>
                                        <p>QNT:</p>
                                        <p className='ml-1 font-bold'>{item.QTY1}</p>
                                    </div>
                                    <div style={{width: '120px'}} className='flex '>
                                        <p>PR:</p>
                                        <p className='ml-1 font-bold'>€{item.TOTAL_PRICE}</p>
                                    </div>
                                </div>
                                <div  style={{width: '40px'}} className='flex align-items-center justify-content-center'> 
                                    <i onClick={() => handleRemove(item)} className="pi pi-trash cursor-pointer" style={{ fontSize: '1.1rem', color: 'red' }}></i>
                                </div>
                            </div>

                        </div>
                    </div>

                )
            })}
        </div>
    )
}

export default ΟffersPage;