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


const GridExpansionTemplate = ({ data }) => {
    let mtrmark = data?.softOne.MTRMARK
    let newArray = []
    for (let image of data.photosPromoList) {
        newArray.push(image.photosPromoUrl)
    }

    console.log(data)
    return (
        < >
            <div className="card p-20">
                <TabView>
                    <TabPanel header="Παραγγελίες">
                        <OrdersTable mtrmark={mtrmark } />
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



const OrdersTable = ({ mtrmark}) => {
    const [data, setData] = useState([])
    const [refetch, setRefetch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [expandedRows, setExpandedRows] = useState(null);
    const [statuses] = useState(['pending', 'done', 'rejected']);

    const allowExpansion = (rowData) => {
        return rowData
    };

    const handleFetch = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/createOrder', { action: 'findPending',  mtrmark: mtrmark})
        setData(data.result)
        setLoading(false)
    }

    useEffect(() => {
        handleFetch();
    }, [refetch])
    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };
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


    const RowExpansionTemplate = ({ products }) => {
        return <RowExpansionGrid products={products} />
    }

    const onRowEditComplete = async (e) => {
        // let { newData, index } = e;
        // console.log(newData, index)
        // let { data } = await axios.post('/api/createOrder', { action: 'updateStatus', status: newData.status, id: newData._id })
        // setRefetch(prev => !prev)
    };
    return (
        <div className='mt-4 mb-5'>
            <StepHeader text="Παραγγελίες σε προμηθευτές" />
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
                <Column header="Συν.Τιμή" field="TOTAL_PRICE" body={PriceStatus}></Column>
                {/* <Column header="email" body={EmailTemplate} field="supplierEmail"></Column> */}
                {/* <Column header="Ημερομηνία Προσφοράς" body={DateTemplate} field="createdAt"></Column> */}
                {/* <Column header="Status" field="status" body={Status} style={{ width: '70px' }} editor={(options) => statusEditor(options)}></Column> */}
                <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    )
}


const RowExpansionGrid = ({ products }) => {

    return (
        <div className="p-2">
            <p className='mb-3 font-bold ml-1'>Προϊόντα Παραγγελίας</p>
            <DataTable
                className='border-1 border-300'
                value={products}
            >
                <Column header="Όνομα" field="NAME"></Column>
                <Column header="Ποσότητα" field="QUANTITY"></Column>
                <Column header="Συν.Τιμή" field="TOTAL_PRICE"></Column>
            </DataTable>
        </div>
    )
};

const PriceStatus = ({ minValue }) => {
    return (
        <div>
            <p>{minValue}</p>
        </div>
    )
}
export default GridExpansionTemplate