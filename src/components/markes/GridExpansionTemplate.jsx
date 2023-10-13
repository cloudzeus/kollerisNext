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
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import StepHeader from '../ImpaOffer/StepHeader';
import { useRouter } from 'next/router';
import { setSelectedSupplier, setBrandHasActiveOrder, setSelectedMarkes } from '@/features/supplierOrderSlice';


const GridExpansionTemplate = ({ data }) => {
    let mtrmark = data?.softOne.MTRMARK
    let newArray = []
    for (let image of data.photosPromoList) {
        newArray.push(image.photosPromoUrl)
    }

    return (
        < >
            <div className="card p-20">
                <TabView>
                    <TabPanel header="Παραγγελίες">
                        <OrdersTable mtrmark={mtrmark} rowData={data} />
                    </TabPanel>
                    <TabPanel header="Φωτογραφίες">
                        <Gallery images={newArray} />
                    </TabPanel>
                    <TabPanel header="Βίντεο">
                        < DisabledDisplay  >
                            {data?.videoPromoList?.map((video, index) => {
                                return (
                                    <UrlInput
                                        key={index}
                                        label={video.name}
                                        value={video.videoUrl}
                                    />
                                )
                            })}
                        </ DisabledDisplay  >

                    </TabPanel>
                    <TabPanel header="Λεπτομέριες">
                        < DisabledDisplay  >
                            <div className="disabled-card">
                                <label>
                                    Περιγραφή
                                </label>
                                <InputTextarea autoResize disabled value={data.description} />
                            </div>
                            <div className="disabled-card">
                                <label>
                                    Pim Username
                                </label>
                                <InputText disabled value={data?.pimAccess?.pimUserName} />
                            </div>
                            <UrlInput
                                label={'URL Iστοσελίδας'}
                                value={data.webSiteUrl}
                            />
                            <UrlInput
                                label={'URL Ιnstagram'}
                                value={data.instagramUrl}
                            />
                            <UrlInput
                                label={'URL Facebook'}
                                value={data.facebookUrl}
                            />
                            <UrlInput
                                label={'URL Pim'}
                                value={data?.pimAccess?.pimUrl}
                            />


                        </DisabledDisplay>

                    </TabPanel>
                </TabView>
            </div>
        </ >
    );
}



const OrdersTable = ({ mtrmark, rowData }) => {
    console.log('rowData')
    console.log(rowData)

    const [data, setData] = useState([])
    const dispatch = useDispatch()
    const [refetch, setRefetch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [expandedRows, setExpandedRows] = useState(null);
    const [statuses] = useState(['pending', 'done', 'rejected']);
    const [minValues, setMinvalues] = useState({
        minValue: 0,
        minItem: 0,
    })

    const allowExpansion = (rowData) => {
        return rowData
    };

    const handleFetch = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/createOrder', { action: 'findPending', mtrmark: mtrmark })
        setData(data.result)
        dispatch(setSelectedSupplier({
            NAME: data.result[0]?.NAME,
            supplierEmail: data.result[0]?.supplierEmail, 
        }))

        dispatch(setSelectedMarkes({
            NAME: rowData?.softOne?.NAME,
            mtrmark: mtrmark,
            minItemsOrder: rowData?.minItemsOrder,
            minValueOrder: rowData?.minValueOrder,

        }))
        setMinvalues({
            minValue: data.minValue,
            minItem: data.minItem,
        })
        setLoading(false)
    }

    useEffect(() => {
        handleFetch();
    }, [refetch])
 
    
    const getSeverity = (value) => {
        switch (value) {
            case 'pending':
                return 'success';

            case 'done':
                return 'warning';

            case 'rejected':
                return 'danger';

            default:
                return null;
        }
    };


    const RowExpansionTemplate = ({ products, NAME, supplierEmail }) => {
        return <RowExpansionGrid products={products} NAME={NAME} supplierEmail={supplierEmail} />
    }

    const onRowEditComplete = async (e) => {
        // let { newData, index } = e;
        // console.log(newData, index)
        // let { data } = await axios.post('/api/createOrder', { action: 'updateStatus', status: newData.status, id: newData._id })
        // setRefetch(prev => !prev)
    };

    const PriceTemplate = ({ products }) => {

        let price = products.map(product => product.TOTAL_PRICE).reduce((a, b) => a + b, 0)

        return (
            <div>
                <span>{`${price} / ${minValues.minValue} €`}</span>
            </div>
        )
    }
    return (
        <div className='mt-4 mb-5'>
            <StepHeader text="Παραγγελίες σε προμηθευτές" />
            {/* <div className='bg-white p-4 borer-round'>
                <p className='font-bold'>Ελάχιστη παραγγελία</p>
                <div className='flex'>
                    <p className='mr-2'>Ποσό</p>
                    <p className='font-bold'>{minValues.minValue}</p>
                </div>
                <div className='flex'>
                    <p className='mr-2'>Ποσότητα</p>
                    <p className='font-bold'>{minValues.minItems}</p>
                </div>
            </div> */}
            <DataTable
                loading={loading}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={RowExpansionTemplate}
                value={data}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
            >
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column header="Αρ. παραγγελίας" style={{ width: '120px' }} field="orderNumber"></Column>
                <Column header="Όνομα προμηθευτή" field="NAME"></Column>
                <Column header="Συν.Τιμή" field="TOTAL_PRICE" body={PriceTemplate}></Column>
                {/* <Column header="email" body={EmailTemplate} field="supplierEmail"></Column> */}
                {/* <Column header="Ημερομηνία Προσφοράς" body={DateTemplate} field="createdAt"></Column> */}
                {/* <Column header="Status" field="status" body={Status} style={{ width: '70px' }} editor={(options) => statusEditor(options)}></Column> */}
                <Column body={ActionsTemplate} style={{ width: "200px" }}></Column>
            </DataTable>
        </div>
    )
}

const ActionsTemplate = ({ data }) => {

    return (
        <div className=''>

            <Button size="small" disabled={true} icon="pi pi-angle-right" label="Αποστολή" className="p-button-sm p-button-success mr-2" />
        </div>
    )
}

const RowExpansionGrid = ({ products, NAME, supplierEmail }) => {
    const router = useRouter();
    const {selectedSupplier} = useSelector(state => state.supplierOrder)
    console.log(selectedSupplier)
    const onClick = () => {
        router.push('/dashboard/supplierOrder/addMore')
    }

    const Footer = () => {
        let price = products.map(product => product.TOTAL_PRICE).reduce((a, b) => a + b, 0)
        let items = products.length
        return (
            <div className='flex justify-content-between align-items-center p-2 w-full'>
                <div>
                    <Button size="small" icon={'pi pi-plus'} severity={"secondary"} className="p-button-sm  mr-2" onClick={onClick} />
                </div>
                <div className='flex'>
                    <div className='mr-3'>
                        <span className='text-500 mr-1'>{`TOTAL ITEMS:`}</span>
                        <span>{items}</span>
                    </div>
                    <div className='mr-3'>
                        <span className='text-500 mr-1'>{`TOTAL PRICE:`}</span>
                        <span>{` ${price} €`}</span>
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
            <span className='font-bold'>{TOTAL_PRICE}</span>
        </div>
    )
}



export default GridExpansionTemplate