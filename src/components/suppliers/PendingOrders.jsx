import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'primereact/button'
import { useSelector, useDispatch } from 'react-redux'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { setSelectedProducts } from '@/features/productsSlice';
import CreatedAt from '../grid/CreatedAt';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { setOrderReady } from '@/features/supplierOrderSlice'
import { useToast } from '@/_context/ToastContext'

const PendingOrders = ({ id }) => {
    const [data, setData] = useState([])
    const [refetch, setRefetch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [expandedRows, setExpandedRows] = useState(null);
    const dispatch = useDispatch()
    const {showMessage} = useToast();
    const router = useRouter()

    const allowExpansion = (rowData) => {
        return rowData
    };

    const handleFetch = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/createOrder', { action: 'findPending', TRDR: id })
        setData(data.result)
        setLoading(false)
    }

    useEffect(() => {
        handleFetch();
    }, [refetch, id])



    const Actions = ({ minOrderValue, orderCompletionValue, _id }) => {
        const op = useRef(null);
        const onBulletsClick = (e) => {
            op.current.toggle(e)
        }

      
        const issuePurdoc = async () => {
            if (orderCompletionValue < minOrderValue) {
                showMessage({
                    severity: "info",
                    summary: "Προσοχή",
                    message: "Δεν έχετε συμπληρώσει το ποσό για αποστολή παραγγελίας"
                })
                return;
            }
            setLoading(true)
            try {
                let { data } = await axios.post('/api/createOrder', { action: 'issuePurdoc', TRDR: id, id: _id })
                dispatch(setOrderReady())
                setRefetch(prev => !prev)
            } catch (e) {
                showMessage({
                    severity: "error",
                    summary: "Σφάλμα",
                    message: e.message
                })
            } finally {
                setLoading(false)
            }
          
          
            
        }
        
        const deletePendingOffer = async () => {
            setLoading(true)
            try {
                 await axios.post('/api/createOrder', { action: 'deletePendingOrder', TRDR: id, id: _id })
                showMessage({
                    severity: "success",
                    summary: "Επιτυχία",
                    message: "Επιτυχής διαγραφή προσφοράς"
                })
                setRefetch(prev => !prev)

            } catch (e) {
                showMessage({
                    severity: "error",
                    summary: "Σφάλμα",
                    message: e.message
                })
            } finally {
                setLoading(false)
            }
           
         
        }
        return (
            <div>
                <i className="pi pi-ellipsis-v pointer" style={{ fontSize: '1.1rem', color: 'blue' }} onClick={onBulletsClick}></i>
                <OverlayPanel className='w-15rem' ref={op}>
                    <Button 
                        disabled={orderCompletionValue < minOrderValue ? true : false}
                        label="Εκ. Παραστατικού" 
                        className='w-full mb-2' 
                        severity='secondary' 
                        onClick={issuePurdoc} 
                    />
                  
                    <Button onClick={deletePendingOffer} className='mt-2 w-full' severity='danger' label="Διαγραφή" icon="pi pi-trash" />
                </OverlayPanel>

            </div>
        )
    }

    const RowExpansionTemplate = ({ products, NAME, supplierEmail, _id, orderCompletionValue, }) => {
        return (
            <RowExpansionGrid
                products={products}
                setRefetch={setRefetch}
                NAME={NAME}
                supplierEmail={supplierEmail}
                id={id}
                docId={_id}
                orderCompletionValue={orderCompletionValue}
            />
        )
    }

    const handleNewOrder = async () => {
        console.log({id})
        try {
            const {data} = await axios.post("/api/suppliers", {
                action: "findOne",
                id
            })
            console.log({data})
            const supplier = data.result;
            router.push(`/dashboard/suppliers/chooseProducts/${id}/${supplier.NAME}/${supplier.EMAIL || "no-email"}/${supplier.minOrderValue}}`)
        } catch(e) {
            showMessage({
                severity: "error",
                summary: "Σφάλμα",
                message: e.response?.data.error || e.message
            })
        }
    }


    return (
        <div className='mt-4 mb-5'>
            <p className="stepheader">Ενεργή Παραγγελία</p>
            {data && data.length ? (
                <DataTable
                    loading={loading}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={RowExpansionTemplate}
                    value={data}
                    editMode="row"
                    showGridlines

                >
                    <Column expander={allowExpansion} style={{ width: '5rem' }} />
                    <Column header="Όνομα προμηθευτή" field="supplierName"></Column>
                    <Column header="Status" field="status"></Column>
                    <Column header="Email" field="supplierEmail"></Column>
                    <Column header="Ημερομ. Δημιουργίας" style={{ minWidth: '250px' }} body={CreatedAt}></Column>
                    <Column header="Min Order" field="minOrderValue" style={{ minWidth: '200px' }} body={Completion}></Column>
                    <Column  body={Actions} style={{ width: "6px" }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            ) : (
                <div className='p-4 bg-white border-round'>
                    <p>Δεν υπάρχει ενεργή παραγγελία</p>
                    <Button
                        label="Νέα Παραγγελία"
                        icon="pi pi-plus"
                        className="p-button-sm  mt-2"
                        onClick={handleNewOrder}
                    />
                </div>
            )}



        </div>
    )
}





const RowExpansionGrid = ({ products, id, docId, refresh, setRefetch }) => {
    const [state, setState] = useState({
        data: [],
        completionValue: 0,
        minOrderValue: 0,
        loading: false,
        refetch: false,
    })
    const router = useRouter();

    const dispatch = useDispatch()
    const { selectedSupplier } = useSelector(state => state.supplierOrder)


    const handleFetch = async () => {
        setState(prev => ({ ...prev, loading: !prev.loading }))
        let { data } = await axios.post('/api/createOrder', { action: 'findPending', TRDR: id })
        setState(prev => ({
            ...prev,
            data: data.result[0].products,
            loading: !prev.loading,
            completionValue: data.result[0].orderCompletionValue,
            minOrderValue: data.result[0].minOrderValue
        }))
    }

  

    useEffect(() => {
        handleFetch();
    }, [state.refetch, id])

    const onAddMore = () => {
        dispatch(setSelectedProducts([]))
        router.push(`/dashboard/suppliers/add-to-bucket/${id}`)
    }

    const handleRefresh = () => {
        setRefetch(prev => !prev)
    }

    const Footer = () => {
        let items = products.map(product => product.QTY1).reduce((a, b) => a + b, 0)
        return (
            <div className='flex justify-content-between align-items-center p-2 w-full'>
                <div>
                    <Button size="small" icon={'pi pi-plus'} severity={"secondary"} className="p-button-sm  mr-2" onClick={onAddMore} />
                </div>
                <div className='flex'>
                    <div className='mr-3'>
                        <span className='text-500 mr-1'>{`TOTAL ITEMS:`}</span>
                        <span>{items}</span>
                    </div>
                    <div className='mr-3'>
                        <div>
                            <span className='text-500 mr-1'>{`TOTAL PRICE:`}</span>
                            <span>{` ${state.completionValue}  / ${state.minOrderValue} €`}</span>
                        </div>
                        <div className='flex  justify-content-end mt-1'>
                            <span onClick={handleRefresh} className='cursor-pointer text-primary-600 underline font-light text-sm'>update grid</span>
                        </div>
                    </div>
                </div>

            </div>
        )

    }


    const Quantity = ({ QTY1, MTRL, }) => {
        const [quantity, setQuantity] = useState(QTY1)

        const handleQuantity = async () => {
            setState(prev => ({ ...prev, loading: !prev.loading }))
            const { data } = await axios.post('/api/createOrder', { action: 'updateQuantity', QTY1: quantity, MTRL: MTRL, TRDR: id, id: docId })
            setState(prev => ({ ...prev, refetch: !prev.refetch, loading: !prev.loading }))
        }

        useEffect(() => {
            if (quantity === QTY1) return;
            handleQuantity();
        }, [quantity])
        return (
            <div>
                <InputNumber

                    value={quantity}
                    size='small'
                    min={0}
                    onValueChange={(e) => setQuantity(e.value)}
                    showButtons
                    buttonLayout="horizontal"
                    decrementButtonClassName="p-button-secondary"
                    incrementButtonClassName="p-button-secondary"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                    inputStyle={{ width: '70px', textAlign: 'center' }}
                />
            </div>
        )
    }
    const Delete = ({ MTRL}) => {
        const handleDelete = async () => {
            await axios.post('/api/createOrder', {action: 'deleteProduct', id: docId, MTRL: MTRL})
            setState(prev => ({ ...prev, refetch: !prev.refetch }))
        }
        return (
            <div>
                <i onClick={handleDelete} className="pi pi-trash cursor-pointer" style={{ fontSize: '0.9rem', color:  'red' }}></i>
            </div>
        )
    }

    return (
        <div className="p-2">
            <p className='mb-3 font-bold ml-1'>Προϊόντα Παραγγελίας</p>
            <DataTable
                className='border-1 border-300'
                value={state.data}
                footer={Footer}
            >
                <Column header="Όνομα" field="NAME"></Column>
                <Column header="COST" style={{ width: '110px' }} field="COST" body={Cost}></Column>
                <Column header="QT" style={{ width: '60px' }} field="QTY1" body={Quantity}></Column>
                <Column header="TOTAL" style={{ width: '100px' }} body={TotalTemplate} field="TOTAL_COST"></Column>
                <Column style={{ width: '50px' }} body={Delete}></Column>

            </DataTable>
        </div>
    )
};

const Cost = ({ COST }) => {
    return (
        <div>
            <span className='font-bold'>{COST.toFixed(2) + " €"}</span>
        </div>
    )

}

const TotalTemplate = ({ TOTAL_COST }) => {
    return (
        <div>
            <span className='font-bold'>{TOTAL_COST.toFixed(2) + "€"}</span>
        </div>
    )
}

const Completion = ({ minOrderValue, orderCompletionValue }) => {
    let condition = orderCompletionValue >= minOrderValue;
    return (
        <div>
            <span className={`${condition ? "text-green-500 font-bold" : null}`}> {`${orderCompletionValue.toFixed(2)}`} </span>
            <span>/</span>
            <span className='font-bold'>{` ${minOrderValue} €`}</span>
        </div>
    )
}

export default PendingOrders;