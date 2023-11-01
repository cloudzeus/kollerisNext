'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { OverlayPanel } from 'primereact/overlaypanel';
import CreatedAt from '../grid/CreatedAt'
import SendEmailTemplate from '@/components/emails/SendEmailTemplate'
import XLSXDownloadButton from '../exportCSV/Download'
import SendMultiOfferEmail from '../emails/SendMultiOfferTemplate'
import {useSelector} from 'react-redux'

const ClientHolder = ({ NAME }) => {
    const [expandedRows, setExpandedRows] = useState(null);
    const { selectedClient } = useSelector(state => state.impaoffer)
    console.log(selectedClient)
    const [statuses] = useState(['pending', 'done', 'rejected']);
    const [data, setData] = useState([])
    const [refetch, setRefetch] = useState(false)
    const [loading, setLoading] = useState(false)
    const op = useRef(null);


    const handleFetch = async () => {
        setLoading(true)
        let res = await axios.post('/api/createOffer', { action: 'findClientHolder', clientName: NAME })
        setData(res.data.result)
        setLoading(false)
    }



    useEffect(() => {
        handleFetch();
    }, [refetch, NAME])



    const allowExpansion = (rowData) => {
        return rowData
    };


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

    const onRowEditComplete = async (e) => {
        let { newData, index } = e;
        console.log(newData, index)
        let { data } = await axios.post('/api/createOffer', { action: 'updateStatus', status: newData.status, id: newData._id })
        setRefetch(prev => !prev)
    };

  

    const Actions = ({ clientEmail, clientName, holders, SALDOCNUM, createdAt, num, _id  }) => {
        const op = useRef(null);
        const _products = []
        console.log(holders)
        holders.map((holder) => {
            holder.products.map((product) => {
                _products.push({
                    name: clientName,
                    email: clientEmail,
                    holderName: holder.name,
                    productName: product.NAME,
                    productPrice: product.PRICE,
                    productQuantity: product.QTY1,
                    productTotalPrice: product.TOTAL_PRICE

                })

            })
        })
        console.log('new products')

        console.log(_products)

        return (
            <div className='flex justify-content-center'>
                <i className="pi pi-ellipsis-v pointer" style={{ fontSize: '1.1rem', color: 'blue' }} onClick={(e) => op.current.toggle(e)}></i>
                <OverlayPanel className='w-15rem' ref={op}>
                    <XLSXDownloadButton data={_products} fileName={`${clientName}.offer`} />
                    <SendMultiOfferEmail
                        mt={2}
                        email={clientEmail}
                        products={_products}
                        clientName={clientName}
                        SALDOCNUM={SALDOCNUM}
                        setRefetch={setRefetch}
                        holders={holders}
                        createdAt={createdAt}
                        num={num}
                        _id={_id}
                    />
                </OverlayPanel>
            </div>


        )
    }

    const RowExpansionTemplate = ({ holders, _id }) => {
        return <RowExpansionGrid holders={holders} documentID={_id} />
    }
    return (
        <>
            <DataTable
                loading={loading}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={RowExpansionTemplate}
                value={data}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                showGridlines
            >
                <Column expander={allowExpansion} style={{ width: '20px', textAlign: 'center' }} />
                <Column header="Όνομα Πελάτη" field="clientName"></Column>
                <Column header="Email" field="clientEmail"></Column>
                <Column header="createdAt" field="createdAt" body={CreatedAt}></Column>
                <Column header="Aριθμός Προσφοράς" headerStyle={{ width: '170px' }} bodyStyle={{ textAlign: 'center' }} field="num"></Column>
                <Column field="createdFrom" body={CreatedFrom}  header="Created From" style={{width: '60px'}}></Column>
                <Column header="Status" field="status" body={Status} style={{ width: '160px' }} editor={(options) => statusEditor(options)}></Column>
                <Column header="Status Edit" rowEditor headerStyle={{ width: '50px' }} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column headerStyle={{ width: '30px' }} bodyStyle={{ textAlign: 'end' }} body={Actions}></Column>
            </DataTable>
        </>
    )
}


const CreatedFrom = ({createdFrom}) => {
    return (
        <div className='flex align-items-center'>
            {createdFrom ? (
                <>
                <i className="pi pi-user mr-1 mt-1 text-primary" style={{fontSize: '12px'}}></i>
                 <span className="text-600">{createdFrom}</span>
                </>
            ) : null}

        </div>
    )
}
const RowExpansionGrid = ({ holders, documentID }) => {
    const [expandedRows, setExpandedRows] = useState(null);

    const allowExpansion = (rowData) => {
        return rowData
    };

    const RowExpansionTemplate = ({ products, _id }) => {
        return <SubRowExpansionGrid products={products} documentID={documentID} holderID={_id} />
    }

    return (
        <div className="p-3 mb-8 mt-4">
            <p className='mb-3 font-bold ml-1'>holders</p>
            <DataTable
                className='border-1 border-300'
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={RowExpansionTemplate}
                value={holders}
            >
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column header="Όνομα" field="name"></Column>
                {/* <Column header="Σύνολο Προϊόντων" body={TotalProducts}></Column> */}
            </DataTable>
        </div>
    )
};

const SubRowExpansionGrid = ({ products, documentID, holderID }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [refetch, setRefetch] = useState(false)
    useEffect(() => {

        const fetch = async () => {
            setLoading(true)
            let { data } = await axios.post('/api/createOffer', { action: 'findHolderProducts', documentID: documentID, holderID: holderID })
            let updateData = data.result.holders[0].products
            setData(updateData)
            setLoading(false)
        }
        fetch();
    }, [refetch])

    const onRemove = (MTRL) => {
        setLoading(true)
        let { data } = axios.post('/api/createOffer', { action: 'removeHolderItems', mtrl: MTRL, documentID: documentID, holderID: holderID })
        console.log(data)
        setRefetch(prev => !prev)
    }
    const RemoveItem = ({ MTRL }) => {

        return (
            <div>
                <i className="pi pi-trash pointer p-1" style={{ fontSize: '1rem', color: 'red' }} onClick={() => onRemove(MTRL)}></i>
            </div>
        )
    }

    const TotalPrice = ({ TOTAL_PRICE }) => {
        return (
            <div>
                <p className='font-bold'>{TOTAL_PRICE + " €"}</p>
            </div>
        )
    }
    const Price = ({ PRICE }) => {
        return (
            <div>
                <p className='font-bold'>{PRICE + " €"}</p>
            </div>
        )
    }
    return (
        <div className='p-3'>
            <p className='mb-3 font-bold ml-1'>Προϊόντα</p>
            <DataTable
                value={data}
                loading={loading}
            >
                <Column header="Όνομα Προϊόντος" field="NAME"></Column>
                <Column header="Τιμή" body={Price} field="PRICE"></Column>
                <Column header="ΠΟΣΟΤΗΤΑ" field="QTY1"></Column>
                <Column header="Σύνολο Τιμής" body={TotalPrice} field="TOTAL_PRICE"></Column>
                <Column body={RemoveItem} header="Αφαίρεση" bodyStyle={{ textAlign: 'center' }} style={{ width: '100px' }}></Column>
                {/* <Column header="Σύνολο Προϊόντων" body={TotalProducts}></Column> */}
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





export default ClientHolder;