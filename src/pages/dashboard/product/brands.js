import React, { useState, useEffect, useRef, useReducer } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Image from 'next/image';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import styled from 'styled-components';
import { Tag } from 'primereact/tag';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { AddDialog, EditDialog } from '@/GridDialogs/brandDialog';
import Gallery from '@/components/Gallery';
import { useDispatch } from 'react-redux';
import { TabView, TabPanel } from 'primereact/tabview';
import { setGridRowData, resetGridRowData } from '@/features/grid/gridSlice';
import { DropDownDetails, ImageDiv, ActionDiv } from '@/componentsStyles/grid';
import { Input, Link } from '@mui/material';
import DeletePopup from '@/components/deletePopup';
import { DisabledDisplay } from '@/componentsStyles/grid';
import { InputTextarea } from 'primereact/inputtextarea';
import UrlInput from '@/components/Forms/PrimeUrlInput';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import SyncBrand from '@/GridSync/SyncBrand';

export default function TemplateDemo() {
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    });



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

    //Refetch on add edit:
    useEffect(() => {
        console.log('submitted: ' + submitted)
        if (submitted) return handleFetch()
    }, [submitted])



    const logoTemplate = (data) => {
        let logo = data.logo ? data.logo : 'notfound.jpg'
        return (
            <ImageDiv>
                <Image
                    src={`/uploads/${logo}`}
                    alt="mountain"
                    sizes="40px"
                    fill={true}

                />
            </ImageDiv>

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
        let newArray = []
        for (let image of data.photosPromoList) {
            newArray.push(image.photosPromoUrl)
        }

        return (
            < ShowDetails >
                <div className="card p-20">
                    <TabView>
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
            </ ShowDetails >
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
            <SyncBrand data={data} />
                {/* <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={() => console.log('export pdf')} /> */}
            </>
        );

    };


    //Edit:
    const editProduct = async (product) => {
        // console.log('edit product: ' + JSON.stringify(product))

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

    const onDelete = async (id) => {
        
        let res = await axios.post('/api/product/apiMarkes', { action: 'delete', id: id })
        if(!res.data.success) return showError()
        handleFetch()
        showSuccess()
    }

    // CUSTOM TEMPLATES FOR COLUMNS
    const actionBodyTemplate = (rowData) => {
        // console.log('row data: ' + JSON.stringify(rowData))
        return (
            <ActionDiv>
                <Button disabled={!rowData.status} icon="pi pi-pencil" onClick={() => editProduct(rowData)} />
                <DeletePopup onDelete={() => onDelete(rowData._id)} status={rowData.status} />
                {/* <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => console.log('delete')} /> */}
            </ActionDiv>
        );
    };

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής διαγραφή', life: 4000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
    }

    const dialogStyle = {
        marginTop: '10vh', // Adjust the top margin as needed
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
       
      };

    return (
        <AdminLayout >
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            <DataTable
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

                onFilter={(e) => setFilters(e.filters)}
                //edit:
                loading={loading}
                editMode="row"
                selectOnEdit
            >
                {/* <Column field="softOne.MTRMARK" header="MTRMARK" sortable></Column> */}
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '20px' }} />
                <Column field="logo" header="Λογότυπο" body={logoTemplate} ></Column>
                <Column field="name" header="Ονομα" sortable></Column>
                <Column field="softOne.ISACTIVE" header="Status" tableStyle={{ width: '5rem' }} body={ActiveTempate}></Column>
                {/* <Column header="Actions"  body={actionsTemplate} tableStyle={{ width: '80px'}}></Column> */}
                {/* <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
                <Column body={actionBodyTemplate} exportable={false} bodyStyle={{ textAlign: 'center' }} tableStyle={{ width: '4rem' }} filterMenuStyle={{ width: '5rem' }}></Column>

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


const ActiveTempate = ({ status }) => {

    return (
        <div>
            {status ? (
                <Tag severity="success" value=" active "></Tag>
            ) : (
                <Tag severity="danger" value="deleted" ></Tag>
            )}

        </div>
    )

}












const ShowDetails = styled.div`
    border: 1px solid #e0e0e0;
   
    .list-item  {
        padding: 20px;
        /* border-bottom: 1px solid #e0e0e0; */
     
    } 
    .list-item span:nth-child(1) {
        font-weight: bold;
        margin-right: 20px;
    }
   

    .divider {
        padding: 0px;
        height: 1px;
        background-color: #e0e0e0;
    }

    .grid-link {
        color: #0d6efd;
        cursor: pointer;

    }
`