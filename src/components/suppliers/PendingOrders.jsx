import React, { useEffect, useState, useRef } from 'react'
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
import SendOrderEmail from '@/components/emails/SendOrderEmail';
import StepHeader from '../multiOffer/StepHeader';
import { useRouter } from 'next/router';
import { setSelectedSupplier, setBrandHasActiveOrder, setSelectedMarkes, setOrderReady } from '@/features/supplierOrderSlice';
import { setSelectedProducts } from '@/features/productsSlice';
import { ProgressBar } from 'primereact/progressbar';
import CreatedAt from '../grid/CreatedAt';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Toast } from 'primereact/toast';

const PendingOrders = ({ id }) => {
    const [data, setData] = useState([])
    const toast = useRef(null);
    const dispatch = useDispatch()
    const router = useRouter();
    const [refetch, setRefetch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [expandedRows, setExpandedRows] = useState(null);
    const [minValues, setMinvalues] = useState({
        minValue: 0,
        minItem: 0,
    })



    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Δεν έχετε συμπληρώσει το ποσό για αποστολή παραγγελίας', life: 3000});
    }

    const allowExpansion = (rowData) => {
        return rowData
    };

    const handleFetch = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/createOrder', { action: 'findPending', TRDR: id })
        console.log(data.result)
        setData(data.result)
        setLoading(false)
    }

    useEffect(() => {
        handleFetch();
    }, [refetch, id])



    const Actions = ({ supplierName, supplierEmail,products, minOrderValue, orderCompletionValue }) => {
        const op = useRef(null);
        const onBulletsClick = (e) => {
            if(orderCompletionValue < minOrderValue) {
                showError()
                return;
            } else {
                op.current.toggle(e)
            }
           

        }
        return (
            <div>
                <i className="pi pi-ellipsis-v pointer" style={{ fontSize: '1.1rem', color: 'blue' }} onClick={onBulletsClick}></i>
                <OverlayPanel className='w-15rem' ref={op}>
                    <SendOrderEmail
                        mt={2}
                        email={supplierEmail}
                        products={products}
                        name={supplierName}
                        TRDR={id}
                        setRefetch={setRefetch}
                        op={op}
                    />
                </OverlayPanel>

            </div>
        )
    }

    const RowExpansionTemplate = ({ products, NAME, supplierEmail }) => {
        return <RowExpansionGrid products={products} NAME={NAME} supplierEmail={supplierEmail} id={id} />
    }


 
 
    return (
        <div className='mt-4 mb-5'>
            <Toast ref={toast} />
            <StepHeader text="Ενεργή Παραγγελία" />
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
                  <Column header="Αρ. παραγγελίας" style={{ width: '150px' }} field="orderNumber"></Column>
                  <Column header="Όνομα προμηθευτή" field="supplierName"></Column>
                  <Column header="Email" field="supplierEmail"></Column>
                  <Column header="Ημερομ. Δημιουργίας" style={{minWidth: '250px'}} body={CreatedAt}></Column>
                  <Column header="Min Order" field="minOrderValue" style={{minWidth: '200px'}} body={Completion}></Column>
                  <Column header="Aποστολή" body={Actions} style={{ width: "120px" }} bodyStyle={{ textAlign: 'center' }}></Column>
              </DataTable>
            ): (
                <div className='p-4 bg-white border-round'>
                <p>Δεν υπάρχει ενεργή παραγγελία</p>
            </div>
            )}
          


        </div>
    )
}





const RowExpansionGrid = ({ products, id }) => {
    const router = useRouter();
    const dispatch = useDispatch()
    const { selectedSupplier } = useSelector(state => state.supplierOrder)


    const onAddMore = () => {
        dispatch(setSelectedProducts([]))
        router.push(`/dashboard/suppliers/add-to-bucket/${id}`)
    }

    const Footer = () => {
        let price = products.map(product => product.TOTAL_COST).reduce((a, b) => a + b, 0)
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
                <Column header="COST" style={{ width: '60px' }} field="COST"></Column>
                <Column header="QT" style={{ width: '60px' }} field="QTY1"></Column>
                <Column header="TOTAL" style={{ width: '60px' }} body={TotalTemplate} field="TOTAL_COST"></Column>
            </DataTable>
        </div>
    )
};


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
            <span className={`${condition ? "text-green-500 font-bold" : null }`}> {`${orderCompletionValue.toFixed(2)}`} </span>
            <span>/</span>
            <span className='font-bold'>{` ${minOrderValue} €`}</span>
        </div>
    )
}

export default PendingOrders;