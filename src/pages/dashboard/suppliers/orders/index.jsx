import AdminLayout from "@/layouts/Admin/AdminLayout";
import axios from "axios";
import {useToast} from "@/_context/ToastContext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import CreatedAt from "@/components/grid/CreatedAt";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";


export default function Page() {
    return (
        <AdminLayout>
            <div className="flex flex-column row-gap-4">
                <PendingOrders/>
                <CompletedOrders/>
            </div>
        </AdminLayout>
    )
}


function PendingOrders() {
    const {showMessage} = useToast()
    const router = useRouter();
    const [state, setState] = useState({
        data: [],
        loading: false,
        expandedRows: null
    })
    const handleFetch = async () => {
        setState(prev => ({...prev, loading: true}))
        let {data} = await axios.post('/api/createOrder', {action: 'findPendingAll'})
        setState(prev => ({...prev, data: data.result}))
        try {

        } catch (e) {
            showMessage({
                severity: "error",
                summary: "Σφάλμα",
                message: e?.response?.data?.error || e.message
            })
        } finally {
            setState(prev => ({...prev, loading: false}))
        }
    }

    useEffect(() => {
        handleFetch()

    }, [])
    const allowExpansion = (rowData) => {
        return rowData
    };


    return (
        <div>
            <p className="stepheader">Ενεργές Παραγγελίες</p>
            <DataTable
                loading={state.loading}
                expandedRows={state.expandedRows}
                onRowToggle={(e) => setState(prev => ({...prev, expandedRows: e.data}))}
                rowExpansionTemplate={RowGrid}
                value={state.data}
                editMode="row"
                showGridlines
            >
                <Column expander={allowExpansion} style={{width: '5rem'}}/>
                <Column header="Όνομα προμηθευτή" field="supplierName"></Column>
                <Column header="Status" field="status"></Column>
                <Column header="Email" field="supplierEmail"></Column>
                <Column header="Ημερομ. Δημιουργίας" style={{minWidth: '250px'}} body={CreatedAt}></Column>
                <Column header="Min Order" field="minOrderValue" style={{minWidth: '200px'}} body={Completion}></Column>
                <Column body={(props) => (
                    <div onClick={() => router.push(`/dashboard/suppliers/order/${props.TRDR}`)}>
                        <i className={'pi pi-eye text-primary'}></i>
                    </div>
                )} style={{width: "6px"}} bodyStyle={{textAlign: 'center'}}></Column>
            </DataTable>
        </div>
    )
}

function CompletedOrders() {
    const {showMessage} = useToast()
    const router = useRouter();
    const [state, setState] = useState({
        data: [],
        loading: false,
        expandedRows: null
    })
    const handleFetch = async () => {
        setState(prev => ({...prev, loading: true}))
        let {data} = await axios.post('/api/createOrder', {action: 'findCompletedAll'})
        setState(prev => ({...prev, data: data.result}))
        try {

        } catch (e) {
            showMessage({
                severity: "error",
                summary: "Σφάλμα",
                message: e?.response?.data?.error || e.message
            })
        } finally {
            setState(prev => ({...prev, loading: false}))
        }
    }

    useEffect(() => {
        handleFetch()
    }, [])
    const allowExpansion = (rowData) => {
        return rowData
    };


    return (
        <div>
            <p className="stepheader">Παραγγελίες Προς Αποστολή</p>
            <DataTable
                loading={state.loading}
                expandedRows={state.expandedRows}
                onRowToggle={(e) => setState(prev => ({...prev, expandedRows: e.data}))}
                rowExpansionTemplate={RowGrid}
                value={state.data}
                editMode="row"
                showGridlines
            >
                <Column expander={allowExpansion} style={{width: '5rem'}}/>
                <Column header="Όνομα προμηθευτή" field="supplierName"></Column>
                <Column header="Status" field="status"></Column>
                <Column header="Email" field="supplierEmail"></Column>
                <Column header="Ημερομ. Δημιουργίας" style={{minWidth: '250px'}} body={CreatedAt}></Column>
                <Column body={(props) => (
                    <div onClick={() => router.push(`/dashboard/suppliers/order/${props.TRDR}`)}>
                        <i className={'pi pi-eye text-primary'}></i>
                    </div>
                )} style={{width: "6px"}} bodyStyle={{textAlign: 'center'}}></Column>
            </DataTable>
        </div>
    )
}


const Completion = ({minOrderValue, orderCompletionValue}) => {
    let condition = orderCompletionValue >= minOrderValue;
    return (
        <div>
            <span
                className={`${condition ? "text-green-500 font-bold" : null}`}> {`${orderCompletionValue?.toFixed(2)}`} </span>
            <span>/</span>
            <span className='font-bold'>{` ${minOrderValue} €`}</span>
        </div>
    )
}


const RowGrid = ({products}) => {
    const calcTotalPrice = (products) => {
        return products.reduce((acc, curr) => acc + curr.TOTAL_COST, 0)
    }
    return (
        <div className="p-2">
            <p className='mb-3 font-bold ml-1'>Προϊόντα Παραγγελίας</p>
            <DataTable
                className='border-1 border-300'
                value={products}
                footer={() => (
                    <div className="flex column-gap-2">
                        <div>
                            <span className="font-bold">Σύνολο Προϊόντων: </span>
                            <span className="font-medium">{products.length}</span>
                        </div>
                        <div>
                            <span className="font-bold">Σύνολο Κόστους: </span>
                            <span className="font-medium">{calcTotalPrice(products)}</span>
                        </div>
                    </div>
                )}
            >
                <Column header="Όνομα" field="NAME"></Column>
                <Column header="COST" style={{width: '110px'}} field="COST"></Column>
                <Column header="QT" style={{width: '60px'}} field="QTY1"></Column>
                <Column header="TOTAL" style={{width: '100px'}} field="TOTAL_COST"></Column>
                <Column style={{width: '50px'}}></Column>

            </DataTable>
        </div>
    )
};
