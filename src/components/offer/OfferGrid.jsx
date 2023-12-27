import React, { useState, useEffect, useRef, use } from 'react';
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


    const RowExpansionTemplate = ({ products, _id, TRDR, totalPrice }) => {
        return (
            <RowExpansionGrid products={products} id={_id} setRefetch={setRefetch} TRDR={TRDR}  totalPrice={totalPrice}/>
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




const RowExpansionGrid = ({ id, setRefetch, TRDR }) => {
    const [state, setState] = useState({
        products: [],
        totalPrice: 0,
        totalDiscount: 0,
        loading: false,
        refetch: false
    })
    const handleFetch = async () => {
        let { data } = await axios.post('/api/singleOffer', { action: 'findOfferProducts', id: id })
        setState(prev => ({ ...prev, products: data.result.products, totalPrice: data.result.totalPrice, totalDiscount: data.result.totalDiscount}))
    
    }
    useEffect(() => {
        handleFetch()
    }, [state.refetch])

    const onRemove = async (MTRL) => {

    }
    const RemoveItem = ({ MTRL }) => {
        return (
            <div>
                <i className="pi pi-trash pointer p-1" style={{ fontSize: '1rem', color: 'red' }} onClick={() => onRemove(MTRL)}></i>
            </div>
        )
    }

    const TotalPrice = ({ TOTAL_PRICE, DISCOUNTED_TOTAL, DISC1PRC }) => {
        return (
            <div className='flex'>
                <div>
                    <p className={`font-bold  ${DISCOUNTED_TOTAL ? "line-through text-500" : null}`}>{TOTAL_PRICE + " €"}</p>
                    
                </div>

                    {
                        DISCOUNTED_TOTAL ? (
                            <>
                            <span className='font-bold ml-2 mr-2 text-primary'>{`-${DISC1PRC}%`}</span>
                            <span className='font-bold'>{` ${DISCOUNTED_TOTAL} €`}</span>
                            </>
                        ) : null
                    }
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

   
    // const footer = `Συνολο Προϊόντων: ${productSum}  /  Συνολο Τιμής: ${sum}€  `;

    const Footer = () => {
        const [visible, setVisible] = useState(false)
        const [discount, setDiscount] = useState(0)
        const [loading, setLoading] = useState(false)


        let productSum = 0;
        state.products && state.products.map((product) => {
            productSum += product.QTY1
        })

        const handleFooter = async () => {
            setLoading(prev => !prev)
            let { data } = await axios.post('/api/singleOffer',
            {
                action: 'totalDiscount',
                discount: discount,
                TRDR: TRDR,
                id: id
            })
            setVisible(prev => !prev)
            setLoading(prev => !prev)
            setState(prev => ({ ...prev, refetch: !prev.refetch }))
        }
        return (
            <div className='flex justify-content-between align-items-center '>
                <div>
                    <div className='mb-2'>
                        <span className='font-medium'>Συνολο Προϊόντων:</span>
                        <span className='font-bold ml-2'>{productSum}</span>
                    </div>
                    <div>
                        <span className='font-medium'> Συνολο Τιμής:</span>
                        <span className='font-bold ml-2'>{state.totalPrice}€</span>
                    </div>
                    <div  className='mt-1'>
                        <span className='font-medium'>Eκπτωση στο σύνολo:</span>
                        <span className='font-bold ml-2 text-primary'>{state.totalDiscount}%</span>
                    </div>
                </div>
                <Button onClick={() => setVisible(prev => !prev)} icon="pi pi-percentage" label="Συνολική έκπτωση" className='bg-primary text-white' />
                <Dialog header="%" visible={visible} style={{ width: '20vw' }} onHide={() => setVisible(prev => !prev)}>
                <div className="flex-auto w-full">
                    <label htmlFor="percent" className="font-bold block mb-2">Έκπτωση</label>
                    <InputNumber className='w-full' inputId="percent" value={discount} max={100} onChange={(e) => setDiscount(e.value)} />
                </div>
                <div className='flex align-items-center justify-content-end mt-6'>
                    <Button loading={loading} label="Εφαρμογή" icon="pi pi-check" onClick={handleFooter} />
                </div>
            </Dialog>
            </div>
        )
    }
  

    const DiscountTemplate = ({ TOTAL_PRICE, MTRL, DISCOUNTED_TOTAL, DISC1PRC, QTY1, NAME, PRICE}) => {
        return (
            <DiscountDialog 
                TOTAL_PRICE={TOTAL_PRICE} 
                MTRL={MTRL} 
                id={id} 
                setRefetch={setRefetch} 
                setState={setState}
                DISCOUNTED_TOTAL={DISCOUNTED_TOTAL} 
                DISC1PRC={DISC1PRC}
                TRDR={TRDR}
                NAME={NAME}
                QTY1={QTY1}
                PRICE={PRICE}
             />
        )
    }

    return (
        <div  >
            <DataTable
                className=' p-datable-sm '
                value={state.products}
                footer={Footer }
            >
                <Column body={DiscountTemplate} bodyStyle={{ textAlign: 'center' }} style={{ width: '40px' }}></Column>
                <Column header="Όνομα" field="NAME"></Column>
                <Column header="Τι." body={Price} field="PRICE" style={{ width: '90px' }}></Column>
                <Column header="Ποσ." field="QTY1" style={{ width: '60px' }}></Column>
                <Column header="Συν." body={TotalPrice} field="TOTAL_PRICE" ></Column>
                <Column body={RemoveItem} bodyStyle={{ textAlign: 'center' }} style={{ width: '40px' }}></Column>
            </DataTable>
        </div>
    )
};



export const DiscountDialog = ({ 
    MTRL, 
    DISCOUNTED_TOTAL,
    id, 
    setState,
    TRDR, 
    QTY1, 
    NAME,
    PRICE,
}) => {
   
    const [localState, setLocalState] = useState({
        discount: 0,
        visible: false,
        loading: false,

    })

   

    const handleCalculatePrice = (e) => {
        setLocalState((prev) => ({ ...prev, discount: e.value }))
    }

   
    const onSubmit = async () => {
        let { data } = await axios.post('/api/singleOffer',
            {
                action: 'addDiscount',
                DISC1PRC: localState.discount,
                products: [{
                    NAME: NAME,
                    MTRL: MTRL,
                    QTY1: QTY1,
                    PRICE: PRICE,
                }],
                TRDR: TRDR,
                id: id
            })
        setLocalState((prev) => ({ ...prev, visible: false, loading: false}))
        setState(prev => ({ ...prev, refetch: !prev.refetch }))
    }
    return (
        <div>
            <div className={`text-white border-round text-sm ${DISCOUNTED_TOTAL ? "bg-green-500" : "bg-primary"}`}>
                <i className="pi pi-percentage pointer p-1  text-sm" onClick={() => setLocalState(prev => ({ ...prev, visible: true }))}></i>
            </div>
            <Dialog header="%" visible={localState.visible} style={{ width: '20vw' }} onHide={() => setLocalState(prev => ({ ...prev, visible: false }))}>
                <div className="flex-auto w-full">
                    <label htmlFor="percent" className="font-bold block mb-2">Έκπτωση</label>
                    <InputNumber className='w-full' inputId="percent" value={localState.discount} max={100} onChange={handleCalculatePrice} />
                </div>
                <div className='flex align-items-center justify-content-end mt-6'>
                    <Button label="Εφαρμογή" icon="pi pi-check" onClick={onSubmit} />
                </div>
            </Dialog>
        </div>
    )
}

export default OfferGrid