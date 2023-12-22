'use client'
import React, { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import StepHeader from '@/components/StepHeader'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import { addMoreToHolder, removeHolder, removeProductFromHolder, setHolder, increaseQuantity, calculateTotal } from '@/features/impaofferSlice'
import { useRouter } from 'next/router'
import { setSelectedProducts } from '@/features/productsSlice'
import { useSession } from 'next-auth/react'
import { InputNumber } from 'primereact/inputnumber'


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


    useEffect(() => {
        console.log('oofer email')
        console.log(offerEmail)
    }, [offerEmail])
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


    useEffect(() => {
        console.log('new holder')
        console.log(holder)
    }, [holder])


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
    const [quantity, setQuantity] = useState()
    const router = useRouter();
    const dispatch = useDispatch();
    const dropDownClick = (id) => {
        setShowContent(id)
    }

    const deleteHolderHandler = (id) => {
        dispatch(removeHolder(id))
    }

    const handleReduce = (products) => {
        let total = 0;
        products.map((item, index) => {
            total += item.TOTAL_PRICE
        })
        return total.toFixed(2)
    }
    const handleAddMore = (item) => {
        console.log('handle add more')
        dispatch(setSelectedProducts([]))
        if (item.isImpa) {
            router.push(`/dashboard/multi-offer/add-more-to-impa/${item.id}`)
        }

        if (!item.isImpa) {
            router.push(`/dashboard/multi-offer/add-more-to-holder/${item.id}`)
        }


    }
    return (
        <div className='mb-2'>
            {holder && holder.map((item, index) => (
                <div key={index} className='bg-white mb-2 border-round'>
                    <div className='holder_container'>
                        <div className='holder_icon'>
                            {(showContent == item?.id) ? (
                                <i onClick={() => dropDownClick(null)} className="pi pi-angle-up" style={{ fontSize: '1.3rem' }}></i>
                            ) : (
                                <i onClick={() => dropDownClick(item?.id)} className="pi pi-angle-down" style={{ fontSize: '1.3rem' }}></i>
                            )}

                        </div>
                        <div className='holder_name'>
                            <div>
                                <p className='block size-xs'>Όνομα holder:</p>
                                <p className='font-bold mt-1'>{item?.name}</p>
                            </div>
                        </div>
                        <div className='holder_info' >
                                <div className='flex align-items-center'>
                                    <p className='block size-xs'>Σύν. Tιμής:</p>
                                    <p className='font-bold ml-2 pr-3'>{handleReduce(item.products)}</p>
                                </div>
                                <div className='flex align-items-center'>
                                    <p>Σύν. Προϊόντων:</p>
                                    <p className='font-bold ml-2 pr-3'>{item?.products?.length}</p>
                                </div>
                                <div className='flex align-items-center justify-content-center  border-left-1 border-400'>
                                    <i className="pi pi-trash cursor-pointer" style={{ fontSize: '1.3rem', color: 'red' }} onClick={() => deleteHolderHandler(item?.id)}></i>
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
    const [quantity, setQuantity] = useState();
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
                    // <div className=' border-300 border-bottom-1' key={index}>
                    //     <div className='p-2 flex justify-content-between md:flex-col'>
                    //         <div className='flex align-items-center pl-2'>
                    //             <p className='text-sm'>{item.NAME}</p>
                    //         </div>
                    //         <div className='flex align-items-center justify-content-between bg-red-200' style={{ width: '30%' }}>
                    //             <div style={{ width: '220px' }} className='flex align-items-center'>
                    //                 <div className='flex mr-3 ' style={{ width: '100px' }}>
                    //                     <p>QNT:</p>
                    //                     <p className='ml-1 font-bold'>{item.QTY1}</p>
                    //                 </div>
                    //                 <div className='flex '>
                    //                     <p>PR:</p>
                    //                     <p className='ml-1 font-bold'>€{item.TOTAL_PRICE}</p>
                    //                 </div>
                    //             </div>
                    //             <div style={{ width: '400px' }} className='flex align-items-center justify-content-between '>

                    //             </div>
                    //             <div style={{ width: '200px' }} className='flex align-items-center justify-content-center'>
                    //                 <QuantityTemplate qt={item.QTY1} holderId={holderId} productName={item.NAME} />
                    //                 <i onClick={() => handleRemove(item)} className="pi pi-trash cursor-pointer ml-4 mr-2" style={{ fontSize: '1.1rem', color: 'red' }}></i>
                    //             </div>
                    //         </div>
                    //     </div>
                        
                    // </div>
                    <div className='holder_products_container'>
                        <div className='holder-products_left'>
                            <p className='text-sm'>{item.NAME}</p>
                        </div>
                        <div className='holder-products_right'>
                            {/* <div >
                                <div className='flex'>
                                    <p>QNT:</p>
                                    <p className='ml-1 font-bold'>{item.QTY1}</p>
                                </div>
                                <div className='flex'>
                                    <p>PR:</p>
                                    <p className='ml-1 font-bold'>€{item.TOTAL_PRICE}</p>
                                </div>
                            </div>
                            <div >
                            </div>
                            <div>
                                <QuantityTemplate qt={item.QTY1} holderId={holderId} productName={item.NAME} />
                                <i onClick={() => handleRemove(item)} className="pi pi-trash cursor-pointer ml-4 mr-2" style={{ fontSize: '1.1rem', color: 'red' }}></i>
                            </div> */}
                            <div>
                            <div className='holder_item_quantity'>
                                    <p>QNT:</p>
                                    <p className='ml-1 font-bold'>{item.QTY1}</p>
                                </div>
                                <div className='holder_item_price '>
                                    <p>PR:</p>
                                    <p className='ml-1 font-bold'>€{item.TOTAL_PRICE}</p>
                                </div>
                            </div>
                            <div>
                                <QuantityTemplate qt={item.QTY1} holderId={holderId} productName={item.NAME} />
                            </div>
                            <div>
                            <i onClick={() => handleRemove(item)} className="pi pi-trash cursor-pointer ml-4 mr-2" style={{ fontSize: '1.1rem', color: 'red' }}></i>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}


const QuantityTemplate = ({ qt, holderId, productName }) => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(qt)

    useEffect(() => {
        const handleQuantity = () => {
            dispatch(increaseQuantity({
                QTY1: quantity,
                holderId: holderId,
                productName: productName
            }))
        }
        handleQuantity()
    }, [quantity])

    const onValueChange = (e) => {
        setQuantity(e.value)
    }
    return (
        <InputNumber
            value={quantity}
            size='small'
            min={1}
            onValueChange={onValueChange}
            showButtons
            buttonLayout="horizontal"
            decrementButtonClassName="p-button-secondary"
            incrementButtonClassName="p-button-secondary"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            inputStyle={{ width: '70px', textAlign: 'center' }}
        />
    )
}
export default ΟffersPage;