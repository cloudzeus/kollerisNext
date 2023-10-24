import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Button } from 'primereact/button';
import XLSXDownloadButton from '../exportCSV/Download';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

const OfferGrid = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [statuses] = useState(['pending', 'done', 'rejected']);

    const handleFetch = async () => {
        setLoading(true)
        let res = await axios.post('/api/singleOffer', { action: 'findOrders' })
        setData(res.data.result)
        setLoading(false)
    }



    useEffect(() => {
        handleFetch();
    }, [])


    //STATUS ROW:
    const getSeverity = (value) => {
        switch (value) {
            case 'done':
                return 'warning';

            case 'rejected':
                return 'danger';

            default:
                return null;
        }
    };
    //ON STATUS UPDATE:
    const onRowEditComplete = async (e) => {
        let { newData, index } = e;
        console.log(newData, index)
        let { data } = await axios.post('/api/createOffer', { action: 'updateStatus', status: newData.status, id: newData._id })
        setRefetch(prev => !prev)
    };
    //OPTIONS FOR THE STATUS ON EDIT:
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


    //SUBMIT ACTIONS, SEND EMAIL TO CLIENT:
    const Actions = ({ clientEmail, num, _id }) => {
        console.log(clientEmail, _id)
        const onSendOffer = async () => {
            setLoading(true)
            let { data } = await axios.post('/api/singleOffer', { action: 'sendOfferEmail', holders: holders, email: clientEmail, num: num, id: _id })
            console.log(data.emailSent)
            setRefetch(prev => !prev)
            setLoading(false)
        }
        return (
            <div className='flex justify-content-center'>
                <Button icon="pi pi-envelope" onClick={onSendOffer} />
            </div>
        )
    }

    const Header = () => {
        const _newdata = [];

        data.forEach((item) => {
            item.products.forEach((product) => {
                _newdata.push({
                    CLIENT_NAME: item.clientName,
                    CLIENT_EMAIL: item.clientEmail,
                    SALDOCNUM: item.SALDOCNUM,
                    CREATED_AT: item.createdAt,
                    PRODUCT_NAME: product.NAME,
                    PRICE: product.PRICE,
                    QTY1: product.QTY1,
                    TOTAL_PRICE: product.TOTAL_PRICE
                });
            });
        });
        return (
            <div className='flex justify-content-end'>
                <XLSXDownloadButton data={_newdata} fileName="offer"/>
            </div>
        )
    }
    const header = Header();
    return (
        <div className="card mt-3">
            <DataTable
                header={header}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                value={data}
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column field="clientName" header="Όνομα"></Column>
                <Column field="clientEmail" header="Email"></Column>
                <Column field="SALDOCNUM" header="SALDOCNUM"></Column>
                <Column field="createdAt" body={createdAt} header="Ημερομηνία Δημ."></Column>
                <Column header="Status" field="status" body={Status} style={{ width: '160px' }} editor={(options) => statusEditor(options)}></Column>
                <Column header="Αλλαγή Status" rowEditor headerStyle={{ width: '10%', width: '160px' }} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column header="Aποστολή σε Πελάτη" headerStyle={{ width: '165px' }} bodyStyle={{ textAlign: 'end' }} body={Actions}></Column>
                <Column headerStyle={{ width: '30px' }} bodyStyle={{ textAlign: 'end' }} body={PrintActions}></Column>

            </DataTable>
        </div>
    )
}




const Status = ({ status }) => {
    let color;
    if (status === 'created') color = "bg-green-500"
    if (status === 'pending') color = "bg-green-500"
    if (status === 'sent') color = "bg-blue-500"
    if (status === 'done') color = "bg-orange-500"
    if (status === 'rejected') color = "bg-red-500"

    return (
        <div className='flex align-items-center '>

            <span className={`mt-1 ${color} border-circle`} style={{ width: '7px', height: '7px' }}>
            </span >
            <span className='ml-2 text-600'>{status.toUpperCase()}</span>
        </div>
    )
}

const createdAt = ({ createdAt }) => {
    return (
        <div className='flex align-items-center'>
            <i className="pi pi-calendar mr-2 text-primary" style={{ fontSize: '13px' }}></i>
            <p>{createdAt.split('T')[0]}</p>
        </div>
    )
}



const PrintActions = (data) => {
    const products = data.products.map((item, index) => {
        return {
            CLIENT_NAME: data.clientName,
            CLIENT_EMAIL: data.clientEmail,
            SALDOCNUM: data.SALDOCNUM,
            PRODUCT_NAME: item.NAME,
            PRICE: item.PRICE,
            QTY1: item.QTY1,
            TOTAL_PRICE: item.TOTAL_PRICE
        }
    })

    const op = useRef(null);
    return (
        <div className='flex justify-content-center'>
            <i className="pi pi-ellipsis-v pointer" style={{ fontSize: '1.3rem', color: 'blue' }} onClick={(e) => op.current.toggle(e)}></i>
            <OverlayPanel className='w-15rem' ref={op}>
                <XLSXDownloadButton data={products} fileName="offer" />
            </OverlayPanel>
        </div>


    )
}
export default OfferGrid