
'use client'
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { lazy, useEffect, useState } from "react";
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

const dialogStyle = {
    marginTop: '10vh', // Adjust the top margin as needed
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',

};


const Impas = () => {
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
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
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
    });
  

    const allowExpansion = (rowData) => {
        return rowData
    };

    const handleFetch = async (action) => {
        if(action === "findAllWithProducts") setLoading(true)
        const {data} = await axios.post('/api/product/apiImpa', {
            action: action,
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm
        })
        setData(data.result)
        setTotalRecords(data.totalRecords)
        if(action === "findAllWithProducts") setLoading(false)
    }
    useEffect(() => {
        if (searchTerm.greek) handleFetch('searchGreekImpa');
        if (searchTerm.english) handleFetch('searchEng');
        if (searchTerm.code) handleFetch('searchCode');
        if (searchTerm.greek === '' && searchTerm.english === '' && searchTerm.code === '') {
       
            handleFetch('findAllWithProducts')
        }
    }, [searchTerm, lazyState.rows, lazyState.first, submitted])


    const rowExpansionTemplate = (props) => {
        return (
            <ExpandedDataTable products={props.products} />
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


    const LeftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew} />
            </div>
        );
    };

    const ActionBodyTemplate = (rowData) => {
        return (
            <Actions onEdit={() => onEdit(rowData)} onDelete={onDelete} />
        )
    }

    const onEdit = (rowData) => {
        setSubmitted(false);
        setEditDialog(true);
        dispatch(setGridRowData(rowData))

    }
    const onDelete = () => {
        console.log('delete')
    }

    return (
        <AdminLayout>
            <StepHeader text="Κωδικοί Impas" />
            <Toolbar start={LeftToolbarTemplate} ></Toolbar>
            <DataTable
                key={'code'}
                value={data}
                first={lazyState.first}
                rows = {lazyState.rows}
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
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '20px' }} />
                <Column field="code" header="code" filter filterElement={searchCode} showFilterMenu={false}></Column>
                <Column field="englishDescription" header="Αγγλική Περιγραφή" filter filterElement={searchEngName} showFilterMenu={false}></Column>
                <Column field="greekDescription" header="Ελληνική Περιγραφή"  filter filterElement={searchGreekName} showFilterMenu={false}></Column>
                <Column field="unit" header="Unit"></Column>
                <Column style={{width: '100px'}} body={ActionBodyTemplate}></Column>
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



const ExpandedDataTable = ({ products }) => {
    console.log(products)
    return (
        <div className="p-4">
            <p className="font-semibold mb-3 ">Προϊόντα συσχετισμένα με impa:</p>
            <DataTable dataKey="_id" value={products}>
                <Column field="NAME" header="Προϊόν"></Column>
            </DataTable>
        </div>
    )
}





const Actions = ({onEdit, onDelete}) => {
    return (
        <div>
            <i className="pi pi-pencil text-primary mr-3 cursor-pointer" onClick={onEdit}></i>
            <i className="pi pi-trash text-red-400 cursor-pointer" onClick={onDelete}></i>
        </div>
    )
}

export default Impas;
