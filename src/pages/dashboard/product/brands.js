import React, { useState, useEffect, useRef, useReducer } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { AddDialog, EditDialog } from '@/GridDialogs/brandDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setGridRowData } from '@/features/grid/gridSlice';

import { Toast } from 'primereact/toast';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import GridLogoTemplate from '@/components/grid/gridLogoTemplate';
import { useSession } from 'next-auth/react';
import StepHeader from '@/components/StepHeader';
import GridExpansionTemplate from '@/components/markes/GridExpansionTemplate';
import MarkesActions from '@/components/markes/MarkesActions';
import { setSelectedMarkes } from '@/features/supplierOrderSlice';
import { useRouter } from 'next/router';
import { ImageGrid } from '@/components/bunnyUpload/ImageGrid';

export default function TemplateDemo() {
    const router = useRouter()
    const dispatch = useDispatch();
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const toast = useRef(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    });
    const { data: session } =  useSession()
    let user = session?.user?.user;


    const handleFetch = async () => {
        setLoading(true)
        try {
            let resp = await axios.post('/api/product/apiMarkes', { action: 'findAll' })
            setData(resp.data.markes)
            setLoading(false)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }


    useEffect(() => {
        handleFetch();

    }, []);

    useEffect(() => {
        console.log('submitted: ' + submitted)
        if (submitted) handleFetch()
    }, [submitted])



    const logoTemplate = (data) => {
        return (
            <GridLogoTemplate logo={data?.logo} />
        )
    }
    //TEMPLATES

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Αναζήτηση" />
            </span>
        );
    };
    const header = renderHeader();

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };


    const allowExpansion = (rowData) => {
        return rowData

    };



    const rowExpansionTemplate = (data) => {
      
        return (
            < Images id={data._id}/>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew} />
            </div>
        );
    };

    //Edit:
    const editProduct = async (product) => {
        setSubmitted(false);
        setEditDialog(true)
        dispatch(setGridRowData(product))
    };

    //Add product
    const openNew = () => {
        setSubmitted(false);
        setAddDialog(true);
    };


    const hideDialog = () => {
        setEditDialog(false);
        setAddDialog(false);
    };

   

 
           
    // CUSTOM TEMPLATES FOR COLUMNS
  

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής διαγραφή', life: 4000 });
    }
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 4000 });
    }

    const dialogStyle = {
        marginTop: '10vh', // Adjust the top margin as needed
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',

    };
    const Actions = (product) => {
        return (
            <div>
                <i className="pi pi-pencil cursor-pointer" onClick={() => editProduct(product)}></i>
            </div>
        )
    }
    return (
        <AdminLayout >
            <Toast ref={toast} />
            <div>
                <StepHeader text="Μάρκες" />
            </div>
            <Toolbar start={leftToolbarTemplate}></Toolbar>
            <DataTable
                size="small"
                header={header}
                value={data}
                paginator
                rows={8}
                rowsPerPageOptions={[5, 10, 25, 50]}
                showGridlines
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                dataKey="_id"
                filters={filters}
                paginatorRight={true}
                removableSort
                onFilter={(e) => setFilters(e.filters)}
                loading={loading}
                editMode="row"
                selectOnEdit
            >
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '20px' }} />
                
                <Column field="logo" header="Λογότυπο" body={logoTemplate} style={{ width: '50px' }} ></Column>
                <Column field="softOne.NAME" header="Ονομα" ></Column>
                <Column field="updatedFrom" header="updatedFrom" style={{ width: '90px' }} body={UpdatedFromTemplate}></Column>
                {user?.role === 'admin' ? (
                    <Column body={Actions} exportable={false} sortField={'delete'} bodyStyle={{ textAlign: 'center' }} style={{ width: '90px' }} ></Column>
                ) : null}

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

        </AdminLayout >
    );
}









const UpdatedFromTemplate = ({ updatedFrom, updatedAt }) => {
    return (
        <RegisterUserActions
            actionFrom={updatedFrom}
            at={updatedAt}
            icon="pi pi-user"
            color="#fff"
            backgroundColor='var(--yellow-500)'
        />

    )
}



const Images = ({id}) => {
    console.log(id)
    const router = useRouter();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [data, setData] = useState([])
    const [refetch, setRefetch] = useState(false)

    const createImagesURL =  (files) => {
        let imagesNames = [];
        for (let file of files) {
            imagesNames.push({name: file.name})
        }
        return imagesNames;
    }



    const handleFetch = async () => {
        let { data } = await axios.post('/api/product/apiMarkes', { action: "getImages", id: id })
        let images = data.result
        setData(images)
    }

    const onDelete = async (name, _id) => {
        //THis is not the product id but the image id
        let { data } = await axios.post('/api/product/apiMarkes', { action: "deleteImage", parentId:id, imageId :_id, name: name })
        setRefetch(prev => !prev)
    }

    const onAdd = async () => {
        console.log('uploadedFiles')
        console.log(uploadedFiles)
        let imagesURL = createImagesURL(uploadedFiles)
        console.log('images url')
        console.log(imagesURL)
        let { data } = await axios.post('/api/product/apiMarkes', { action: 'addImages', id: id, imagesURL: imagesURL})
        setRefetch(prev => !prev)
        return data;
    }


    useEffect(() => {
        handleFetch()
    }, [id, refetch])
    return (
        <div className='p-4'>
              <ImageGrid
            data={data}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onDelete={onDelete}
            onAdd={onAdd}
            
        />
        </div>
      
    )
}




