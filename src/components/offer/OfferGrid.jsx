import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Button } from 'primereact/button';
import XLSXDownloadButton from '../exportCSV/Download';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import CreatedAt from '@/components/grid/CreatedAt';
import SendEmailTemplate from '../emails/SendEmailTemplate';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { set } from 'mongoose';

const OfferGrid = ({ clientName }) => {
    const [expandedRows, setExpandedRows] = useState(null);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState({
        grid: false,
        delete: false,
    })
    const [refetch, setRefetch] = useState(false)
    const [statuses] = useState(['pending', 'done', 'rejected']);

    const handleFetch = async () => {
        setLoading(prev => ({ ...prev, grid: true }))
        let res = await axios.post('/api/singleOffer', { action: 'findOffers', clientName: clientName })
        setData(res.data.result)
        
        setLoading(prev => ({ ...prev, grid: false }))

    }
    console.log(data)


    useEffect(() => {
        handleFetch();
    }, [refetch])


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
        setLoading(prev => ({ ...prev, grid: true }))
        let { data } = await axios.post('/api/createOffer', { action: 'updateStatus', status: newData.status, id: newData._id })
        setLoading(prev => ({ ...prev, grid: false }))
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
    // const Actions = ({products, clientName, clientEmail, _id, SALDOCNUM,createdAt}) => {
    const Actions = ({ clientEmail, clientName, products, SALDOCNUM, createdAt, _id }) => {
        
        const op = useRef(null);
        const _products = products.map((item, index) => {
            return {
                CLIENT_NAME: clientName,
                CLIENT_EMAIL: clientEmail || 'Δεν υπάρχει email',
                SALDOCNUM: SALDOCNUM,
                CREATED_AT: createdAt,
                SALDOCNUM: SALDOCNUM,
                PRODUCT_NAME: item.NAME,
                PRICE: item.PRICE,
                QTY1: item.QTY1,
                TOTAL_PRICE: item.TOTAL_PRICE
            }
        })


        const onDelete = async () => {
            setLoading(prev => ({ ...prev, delete: true }))
            let { data } = await axios.post('/api/singleOffer', { action: 'deleteOffer', id: _id })
            setLoading(prev => ({ ...prev, delete: false }))
            setRefetch(prev => !prev)
        }
        return (
            <div className='flex justify-content-center'>
                <i className="pi pi-ellipsis-v pointer" style={{ fontSize: '1.1rem', color: 'blue' }} onClick={(e) => op.current.toggle(e)}></i>
                <OverlayPanel className='w-15rem' ref={op}>
                    <Button loading={loading.delete} label="Διαγραφή" severity='danger' className='w-full mb-2' icon="pi pi-trash" onClick={onDelete} />
                    <XLSXDownloadButton data={_products} fileName={`${clientName}.offer`} />
                    <SendEmailTemplate
                        mt={2}
                        email={clientEmail}
                        products={_products}
                        clientName={clientName}
                        SALDOCNUM={SALDOCNUM}
                        setRefetch={setRefetch}
                        op={op}
                    />
                </OverlayPanel>
            </div>


        )
    }

    const allowExpansion = (rowData) => {
        return rowData
    };


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
                <XLSXDownloadButton data={_newdata} fileName="offer" />
            </div>
        )
    }
    const header = Header();


    const RowExpansionTemplate = ({ products, _id }) => {
        return (
            <RowExpansionGrid products={products} id={_id}/>
        )
    }

    return (
        <div className="card mt-3">
            <DataTable
                loading={loading.grid}
                header={header}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                value={data}
                showGridlines
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={RowExpansionTemplate}
            >
                <Column expander={allowExpansion} style={{ width: '5%', textAlign: 'center' }} />
                <Column field="clientName" header="Όνομα"></Column>
                <Column field="clientEmail" header="Email"></Column>
                <Column field="FINCODE" header="Κωδ.Παραστατικού"></Column>
                <Column field="createdAt" body={CreatedAt} header="Ημ. Δημ."></Column>
                <Column header="Status" field="status" body={Status} style={{ width: '20%' }} editor={(options) => statusEditor(options)}></Column>
                <Column field="createdFrom" body={CreatedFrom} header="Created From" style={{ width: '10%' }}></Column>
                <Column header="Status Edit" rowEditor headerStyle={{ width: '50px' }} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column headerStyle={{ width: '30px' }} bodyStyle={{ textAlign: 'end' }} body={Actions}></Column>
            </DataTable>
        </div>
    )
}


const CreatedFrom = ({ createdFrom }) => {
    return (
        <div className='flex align-items-center'>
            {createdFrom ? (
                <>
                    <i className="pi pi-user mr-1 mt-1 text-primary" style={{ fontSize: '12px' }}></i>
                    <span className="text-600">{createdFrom}</span>
                </>
            ) : null}

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




const RowExpansionGrid = ({ products, id }) => {

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

    let sum = 0;
    let productSum = 0;
    products.map((product) => {
        sum += product.TOTAL_PRICE
    })
    products.map((product) => {
        productSum += product.QTY1
    })
    const footer = `Συνολο Προϊόντων: ${productSum}  /  Συνολο Τιμής: ${sum}€  `;

    const DiscountTemplate = ({ TOTAL_PRICE, MTRL }) => {
        return (
            <DiscountDialog TOTAL_PRICE={TOTAL_PRICE} MTRL={MTRL} id={id} />
        )
    }
    return (
        <div  >
            <DataTable
                className='border-1 border-300 p-datable-sm '
                value={products}
                footer={footer}
            >
                <Column body={DiscountTemplate}  bodyStyle={{ textAlign: 'center' }} style={{ width: '40px' }}></Column>
                <Column header="Όνομα" field="NAME"></Column>
                <Column header="Τι." body={Price} field="PRICE" style={{width: '90px'}}></Column>
                <Column header="Ποσ." field="QTY1" style={{width: '60px'}}></Column>
                <Column header="ΣΤ." body={TotalPrice} field="TOTAL_PRICE" ></Column>
                <Column body={RemoveItem}  bodyStyle={{ textAlign: 'center' }} style={{ width: '40px' }}></Column>
            </DataTable>
        </div>
    )
};



const DiscountDialog = ({ TOTAL_PRICE, MTRL, id  }) => {
    const [state, setState] = useState({
        discount: 0,
        discountedTotal: TOTAL_PRICE,
        visible: false,
        loading: false,
    
    })
   

    const handleCalculatePrice = (e) => {
        // setDiscount(e.value)
        setState((prev) => ({ ...prev, discount: e.value }))
    }

    useEffect(() => {
        let _discount = state.discount / 100;
        let _price = TOTAL_PRICE * _discount;
        let _total = TOTAL_PRICE - _price;
        setState((prev) => ({ ...prev, discountedTotal: _total.toFixed(2) }))
    }, [state.discount])

    const onSubmit = async () => {
        let { data } = await axios.post('/api/singleOffer', 
            { 
                action: 'addDiscount', 
                discount: state.discount, 
                discountedTotal: state.discountedTotal,
                MTRL: MTRL,
                id: id
            })
        setState((prev) => ({ ...prev, visible: false, loading: false }))
    }
    return (
        <div>
            <div className='offer_disctount_btn'>
                <i className="pi pi-percentage pointer p-1" onClick={() => setState(prev => ({...prev, visible: true}))}></i>
            </div>
            <Dialog header="%" visible={state.visible} style={{ width: '20vw' }} onHide={() => setVisible(false)}>
                <div className="flex-auto w-full">
                    <label htmlFor="percent" className="font-bold block mb-2">Έκπτωση</label>
                    <InputNumber className='w-full' inputId="percent" value={state.discount} max={100} onChange={handleCalculatePrice}  />
                </div>
                <div className="flex align-items-center w-full mt-4 ">
                    <span style={{width: '140px'}}  className="">Συνολική Τιμή: </span>
                    <p className='font-bold ml-2 mt-0'>{TOTAL_PRICE.toFixed(2)} €</p>
                </div>
                <div className="flex align-items-center w-full mt-2">
                    <span style={{width: '140px'}} className="">Mετά την έκπτωση: </span>
                    <p className='font-bold ml-2 mt-0 text-green-600 underline'>{state.discountedTotal} €</p>
                </div>
                <div className='flex align-items-center justify-content-end mt-6'>
                    <Button label="Εφαρμογή" icon="pi pi-check" onClick={onSubmit} />
                </div>
            </Dialog>
        </div>
    )
}

export default OfferGrid