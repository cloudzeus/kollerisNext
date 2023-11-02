import React, { useEffect, useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import Gallery from '@/components/Gallery';
import { DisabledDisplay } from '@/componentsStyles/grid';
import { InputTextarea } from 'primereact/inputtextarea';
import UrlInput from '@/components/Forms/PrimeUrlInput';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button'
import { useSelector, useDispatch } from 'react-redux'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'

import StepHeader from '../multiOffer/StepHeader';
import { useRouter } from 'next/router';
import { setSelectedSupplier, setBrandHasActiveOrder, setSelectedMarkes, setOrderReady } from '@/features/supplierOrderSlice';
import { setSelectedProducts } from '@/features/productsSlice';
import { ProgressBar } from 'primereact/progressbar';


const PendingOrders = ({id}) => {
    const [data, setData] = useState([])
    const dispatch = useDispatch()
    const router = useRouter();
    const [refetch, setRefetch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [expandedRows, setExpandedRows] = useState(null);
    const [minValues, setMinvalues] = useState({
        minValue: 0,
        minItem: 0,
    })

    const allowExpansion = (rowData) => {
        return rowData
    };

    const handleFetch = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/createOrder', { action: 'findPending', TRDR: id})
        console.log(data.result)
        setData(data.result)
        setLoading(false)
    }

    useEffect(() => {
        handleFetch();
    }, [refetch])



    const Actions = () => {
        return <ActionsTemplate  setRefetch={setRefetch} />
    }

    const RowExpansionTemplate = ({ products, NAME, supplierEmail }) => {
        return <RowExpansionGrid products={products} NAME={NAME} supplierEmail={supplierEmail}  />
    }


    const PriceTemplate = ({ products }) => {

        let price = products.map(product => product.TOTAL_PRICE).reduce((a, b) => a + b, 0)
        if (price >= minValues.minValue) {
            dispatch(setOrderReady(true))
        }


        return (
            <div className="card p-2">
                <span className='text-xs font-bold'>{`${price.toFixed(2)} / ${minValues.minValue} €`}</span>
       
            </div>

        )
    }
    const CompletionTemplate = ({ products }) => {

        let price = products.map(product => product.TOTAL_PRICE).reduce((a, b) => a + b, 0)
        if (price >= minValues.minValue) {
            dispatch(setOrderReady(true))
        }
        let value = (price / minValues.minValue) * 100 > 100 ? 100 : (price / minValues.minValue) * 100
        let toFixed = value.toFixed(2)

        return (
            <div className="flex align-items-center justify-content-center">
                <ProgressBar value={toFixed} style={{fontSize: '9px' , height: '20px', borderRadius: '30px', width: '100px'}}  ></ProgressBar>
            </div>

        )
    }
    // const Actions = ({MTRMARK}) => {
    //     return <ActionsTemplate  setRefetch={setRefetch} />
    // }

    const onNewOrder = () => {
        dispatch(setSelectedProducts([]))
        router.push('/dashboard/supplierOrder/supplier')
    }
    return (
        <div className='mt-4 mb-5'>
            <StepHeader text="Παραγγελίες εν ενεργεία" />
                <DataTable
                loading={loading}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={RowExpansionTemplate}
                value={data}
                editMode="row"
            >
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column header="Αρ. παραγγελίας" style={{ width: '120px' }} field="orderNumber"></Column>
                <Column header="Όνομα προμηθευτή" field="supplierName"></Column>
                <Column header="Email" field="supplierEmail"></Column>
                <Column header="Min Order" field="minOrderValue"></Column>
                <Column header="Ποσοστο Ολοκλ." field="TOTAL_PRICE" style={{ width: "140px" }}></Column>
                <Column header="Συν.Τιμή" field="TOTAL_PRICE" style={{ width: "200px" }} ></Column>
                <Column header="Aποστολή" body={Actions} style={{ width: "120px" }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
           
            
        </div>
    )
}

const ActionsTemplate = ({ setRefetch}) => {
    const { orderReady, mtrLines } = useSelector(state => state.supplierOrder)
    const [loading, setLoading] = useState(false)
  
  
    const submitOrder = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/createOrder', { 
            action: 'submitOrder', 
            products: mtrLines,
        })
        setLoading(false)
        setRefetch(prev => !prev)
    }
    return (
        <div>
            <Button loading={loading} onClick={submitOrder} size="small" disabled={!orderReady} icon="pi pi-angle-right" className="p-button-sm p-button-success mr-2" />
        </div>
    )
}

const RowExpansionGrid = ({ products}) => {
    const router = useRouter();
    const dispatch = useDispatch()
    const { selectedSupplier } = useSelector(state => state.supplierOrder)


    const onAddMore = () => {
        dispatch(setSelectedProducts([]))
        router.push('/dashboard/supplierOrder/addMore')
    }

    const Footer = () => {
        let price = products.map(product => product.TOTAL_PRICE).reduce((a, b) => a + b, 0)
        let items = products.map(product => product.QTY1).reduce((a, b) => a + b, 0)
        return (
            <div className='flex justify-content-between align-items-center p-2 w-full'>
                <div>
                    <Button size="small" icon={'pi pi-plus'} severity={"secondary"} className="p-button-sm  mr-2" onClick={onAddMore } />
                </div>
                <div className='flex'>
                    <div className='mr-3'>
                        <span className='text-500 mr-1'>{`TOTAL ITEMS:`}</span>
                        <span>{items}</span>
                    </div>
                    <div className='mr-3'>
                        <span className='text-500 mr-1'>{`TOTAL PRICE:`}</span>
                        <span>{` ${price.toFixed(2)} €`}</span>
                    </div>
                </div>

            </div>
        )

    }

    return (
        <div className="p-2">
            <p className='mb-3 font-bold ml-1'>Προϊόντα Παραγγελίας</p>
            <DataTable
                className='border-1 border-300'
                value={products}
                footer={Footer}
            >
                <Column header="Όνομα" field="NAME"></Column>
                <Column header="PR" style={{ width: '60px' }} field="PRICE"></Column>
                <Column header="QT" style={{ width: '60px' }} field="QTY1"></Column>
                <Column header="TOTAL" style={{ width: '60px' }} body={TotalTemplate} field="TOTAL_PRICE"></Column>
            </DataTable>
        </div>
    )
};


const TotalTemplate = ({ TOTAL_PRICE }) => {
    return (
        <div>
            <span className='font-bold'>{TOTAL_PRICE.toFixed(2) + "€"}</span>
        </div>
    )
}



export default PendingOrders;