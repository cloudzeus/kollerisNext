
'use client'
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { useEffect, useState, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import axios from "axios";
import { useDispatch } from "react-redux";
import StepHeader from "@/components/StepHeader";
import { EditDialog, AddDialog } from "@/GridDialogs/impaDialog";
import { Toolbar } from "primereact/toolbar";
import { setGridRowData } from "@/features/grid/gridSlice";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import { OverlayPanel } from 'primereact/overlaypanel';

const dialogStyle = {
    marginTop: '10vh', // Adjust the top margin as needed
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',

};


const Impas = () => {
    const [data, setData] = useState([]);
    const op = useRef(null);
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [searchTerm, setSearchTerm] = useState({
        code: '',
        english: '',
        greek: '',
    })
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [expandedRows, setExpandedRows] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(false)
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
    });
    const showSuccess = (detail) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: detail, life: 4000 });
    }
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 5000 });
    }


    const allowExpansion = (rowData) => {
        if (rowData.isActive === false) return;
        return rowData
    };

    const handleFetch = async () => {
        setLoading(true)
        const { data } = await axios.post('/api/product/apiImpa', {
            action: 'findAll',
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm
        })
        setData(data.result)
        setTotalRecords(data.totalRecords)
        setLoading(false)
    }



    useEffect(() => {
        console.log('it should run')
        handleFetch()
    }, [searchTerm, lazyState.rows, lazyState.first, submitted])


    const rowExpansionTemplate = (props) => {
        return (
            <ExpandedDataTable
                id={props._id}
                setSubmitted={setSubmitted}
                showSuccess={showSuccess}
                showError={showError}
            />
        )
    }

    const onPage = (event) => {
        setlazyState(event);
    };

    const openNew = () => {
        setSubmitted(false);
        setAddDialog(true);
    };


    const hideDialog = () => {
        setEditDialog(false);
        setAddDialog(false);
    };

    const searchGreekName = () => {
        return (
            <div className="flex justify-content-start ">
                <span className="p-input-icon-left w-5">
                    <i className="pi pi-search" />
                    <InputText value={searchTerm.greek} onChange={(e) => setSearchTerm((prev) => ({ ...prev, greek: e.target.value }))} />
                </span>
            </div>
        )
    }

    const searchEngName = () => {
        return (
            <div className="flex justify-content-start ">
                <span className="p-input-icon-left w-5">
                    <i className="pi pi-search" />
                    <InputText value={searchTerm.english} onChange={(e) => setSearchTerm((prev) => ({ ...prev, english: e.target.value }))} />
                </span>
            </div>
        )
    }
    const searchCode = () => {
        return (
            <div className="flex justify-content-start ">
                <span className="p-input-icon-left w-5">
                    <i className="pi pi-search" />
                    <InputText value={searchTerm.code} onChange={(e) => setSearchTerm((prev) => ({ ...prev, code: e.target.value }))} />
                </span>
            </div>
        )
    }

    const onDeactivate = async () => {
        try {
            let { data } = await axios.post('/api/product/apiImpa', { action: 'deactivate', selected: selected })
            if (!data.success) return showError('Αποτυχία απενεργοποίησης')
            setSelected([])
            setSubmitted(prev => !prev)


        } catch (e) {
            showError('Προσπαθήστε ξανά')

        }
    }
    const onActivate = async () => {
        try {
            let { data } = await axios.post('/api/product/apiImpa', { action: 'activate', selected: selected })
            if (!data.success) return showError('Αποτυχία απενεργοποίησης')
            setSelected([])
            setSubmitted(prev => !prev)

        } catch (e) {
            showError('Προσπαθήστε ξανά')

        }
    }
    const LeftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew} />
                <div className="card flex justify-content-center">
                    <Button icon="pi pi-angle-down" type="button" label="Impa Status" onClick={(e) => op.current.toggle(e)} />
                    <OverlayPanel ref={op} >
                        <div className="flex flex-column">
                            <Button className="mb-2" icon="pi pi-times" label="Απενεργοποίηση Impa" severity="danger" onClick={onDeactivate} />
                            <Button label="Eνεργοποίηση Impa" icon="pi pi-check" severity="success" onClick={onActivate} />
                        </div>
                    </OverlayPanel>
                </div>


            </div>
        );
    };

    const ActionBodyTemplate = (rowData) => {
        return (
            <Actions isActive={rowData.isActive} onEdit={() => onEdit(rowData)} onDelete={() => onDelete(rowData)} />
        )
    }

    const onEdit = (rowData) => {
        if (rowData.isActive === false) return showError('Δεν μπορείτε να επεξεργαστείτε απενεργοποιημένο impa')
        setSubmitted(false);
        setEditDialog(true);
        dispatch(setGridRowData(rowData))

    }
    const onDelete = async ({ _id, isActive }) => {
        if (isActive === false) return showError('Δεν μπορείτε διαγράψετε απενεργοποιημένο impa')
        let { data } = await axios.post('/api/product/apiImpa', { action: 'deleteOne', id: _id })

        setSubmitted(true)
        if (!data.success) showError('Αποτυχία Διαγραφής')
        showSuccess('Επιτυχής Διαγραφή')
    }

    const onSelectionChange = (e) => {
        setSelected(e.value)
    }




    return (
        <AdminLayout>
            <Toast ref={toast} />
            <StepHeader text="Κωδικοί Impas" />
            <Toolbar start={LeftToolbarTemplate} ></Toolbar>
            <DataTable
                selectionMode={'checkbox'}
                selection={selected}
                onSelectionChange={onSelectionChange}
                showGridlines
                key={'code'}
                value={data}
                first={lazyState.first}
                rows={lazyState.rows}
                onPage={onPage}
                lazy
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                paginator
                totalRecords={totalRecords}
                loading={loading}
                rowsPerPageOptions={[20, 50, 100, 200]}
                filterDisplay="row"
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column selectionMode="multiple" filed="selection" headerStyle={{ width: '3rem' }}></Column>
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '20px' }} />
                <Column field="code" header="code" filter filterElement={searchCode} showFilterMenu={false} body={ImpaCode}></Column>
                <Column field="englishDescription" header="Αγγλική Περιγραφή" filter filterElement={searchEngName} showFilterMenu={false}></Column>
                <Column field="greekDescription" header="Ελληνική Περιγραφή" filter filterElement={searchGreekName} showFilterMenu={false}></Column>
                <Column field="unit" header="Unit"></Column>
                <Column field="isActive" header="isActive" body={IsActive}></Column>
                <Column style={{ width: '100px' }} body={ActionBodyTemplate}></Column>
            </DataTable>
            <EditDialog
                style={dialogStyle}
                data={editData}
                setData={setEditData}
                dialog={editDialog}
                setDialog={setEditDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            />
            <AddDialog
                dialog={addDialog}
                setDialog={setAddDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            />
        </AdminLayout>
    )
}


const ImpaCode = ({ code, products }) => {
    return (
        <div>
            <span className="block font-bold">{code}</span>
            {products.length > 0 ? (
                <div className="flex align-items-center  mt-1 text-sm">
                    <span className="">products:</span>
                    <span className="block ml-1 font-bold text-primary">{products.length}</span>
                </div>
            ) : null}
        </div>
    )
}

const ExpandedDataTable = ({ id, setSubmitted, showSuccess, showError }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        const handleFetch = async () => {
            setLoading(true);
            let { data } = await axios.post('/api/product/apiImpa', { action: 'findImpaProducts', id: id })
            setData(data.result)
            setLoading(false);

        }
        handleFetch()
    }, [refetch])

    const renderHeader = () => {
        const handleClick = () => {
            router.push(`/dashboard/products-to-impa/${id}`)
        }
        return (
            <div>
                <Button label="Νέο" icon="pi pi-plus" severity="secondary" onClick={handleClick} />
            </div>
        )
    }
    const header = renderHeader()

    const handleDelete = async () => {
        setLoading(true);
        let { data } = await axios.post('/api/product/apiImpa', { action: 'deleteImpaProduct', id: product._id, impaId: id })
        if (!data.success) showError('Αποτυχία Διαγραφής')
        showSuccess('Επιτυχής Διαγραφή')
        setLoading(false);
        setRefetch(prev => !prev)

    }

    const DeleteProducts = (product) => {

      
        return (
            <div>
                <i className="pi pi-trash text-red-400 cursor-pointer" onClick={handleDelete}></i>
            </div>
        )
    }
    return (
        <div className="p-4">
            <p className="font-semibold mb-3 ">Προϊόντα συσχετισμένα με impa:</p>
            <DataTable
                //    selectionMode={'checkbox'}
                //    selection={selected}
                //    onSelectionChange={(e) => setSelected(e.value)}
                loading={loading}
                showGridlines
                header={header}
                dataKey="_id"
                value={data}>
                    {/* <Column selectionMode="multiple" filed="selection" headerStyle={{ width: '3rem' }}></Column> */}
                    <Column field="NAME" header="Προϊόν"></Column>
                    <Column field="CODE" style={{ width: '50px' }} body={DeleteProducts}></Column>

            </DataTable>
        </div>
    )
}


const IsActive = ({ isActive }) => {
    return (
        <div style={{ width: '20px', height: '20px' }} className={`${isActive ? "bg-green-500" : "bg-red-500"} border-round flex align-items-center justify-content-center`}>
            {isActive ? <i className="pi pi-check text-white text-xs"></i> : <i className="pi pi-times text-white text-xs"></i>}
        </div>
    )
}


const Actions = ({ onEdit, onDelete, isActive }) => {

    return (
        <div>
            <i className="pi pi-pencil text-primary mr-3 cursor-pointer" onClick={onEdit}></i>
            <i className="pi pi-trash text-red-400 cursor-pointer" onClick={onDelete}></i>
        </div>
    )
}

export default Impas;
