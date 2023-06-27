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
import { Link } from '@mui/material';


export default function TemplateDemo() {
    const [brand, setBrand] = useState([]);
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const dispatch = useDispatch();
    //Images to use for the gallery:
    const [images, setImages] = useState([])
    const [expandedRows, setExpandedRows] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    });
    //


    const handleFetch = async () => {
        setLoading(true)
        try {
            let resp = await axios.post('/api/product/apiMarkes', { action: 'findAll'})
            setData(resp.data.markes)
            // console.log("rendered data " + JSON.stringify(resp.data.markes))
            // setImages(resp.data.images)
            // setImages(resp.data.images)
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
        if(submitted) handleFetch()
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
            for(let image of data.photosPromoList) {
            newArray.push(image.photosPromoUrl)
        }

        return (
            < ShowDetails >
                <div className="card p-20">
                    <TabView>
                        <TabPanel header="Φωτογραφίες">
                            <Gallery images={newArray}/>
                        </TabPanel>
                        <TabPanel header="Βίντεο">
                            {data?.videoPromoList?.map((video, index) => {
                                return (
                                    <div key={index} className="video-div">
                                       { JSON.stringify(video)}
                                    </div>
                                )
                            })}
                        </TabPanel>
                        <TabPanel header="Λεπτομέριες">
                            <DropDownDetails>
                                <div className="tab-div">
                                    <span className='tab-title'>Περιγραφή</span>
                                    <p className='tab-details'>{data.description}</p>
                                </div>
                                <div className="tab-div">
                                    <span className='tab-title'>URL Pim</span>
                                    <Link className="tab-url" >{data?.pimAccess?.pimUrl}</Link>
                                </div>
                                <div className="tab-div">
                                    <span className='tab-title'>Pim Όνομα Χρήστη</span>
                                    <p className='tab-details'>{data?.pimAccess?.pimUserName}</p>
                                </div>
                                <div className="tab-div">
                                    <span className='tab-title'>URL Ιστοσελίδας</span>
                                    <Link className="tab-url" >{data?.pimAccess?.pimUrl}</Link>
                                </div>
                                <div className="tab-div">
                                    <span className='tab-title'>URL Facebook</span>
                                    <Link className="tab-url" >{data?.facebookUrl}</Link>
                                </div>
                                <div className="tab-div">
                                    <span className='tab-title'>URL Instagram</span>
                                    <Link className="tab-url" >{data?.instagramUrl}</Link>
                                </div>
                               
                              
                            
                            </DropDownDetails>
                          
                            
                        </TabPanel>
                    </TabView>
                </div>
            </ ShowDetails >
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={() => console.log('export pdf')} />
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
        setBrand([]);
        setSubmitted(false);
        setAddDialog(true);
    };


    const hideDialog = () => {
        setSubmitted(false);
        setEditDialog(false);
        setAddDialog(false);
        dispatch(resetGridRowData())
      
    };

 

    // CUSTOM TEMPLATES FOR COLUMNS
    const actionBodyTemplate = (rowData) => {
        // console.log('row data: ' + JSON.stringify(rowData))
        return (
            <ActionDiv>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => console.log('delete')} />
            </ActionDiv>
        );
    };
    return (
        <AdminLayout >
            {/* <Toast ref={toast} /> */}
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
                dataKey="softOne.MTRMARK"
                filters={filters} 
                paginatorLeft={true}
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
                data={editData}
                setData={setEditData}
                dialog={editDialog}
                setDialog={setEditDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            />
            <AddDialog
                data={brand}
                setData={setBrand}
                dialog={addDialog}
                setDialog={setAddDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            />
        </AdminLayout >
    );
}


const ActiveTempate = ({ softOne }) => {
    const isActive = softOne.ISACTIVE
    return (
        <div>
            {isActive == 1 ? (
                <Tag severity="success" value=" active "></Tag>
            ) : (
                <Tag severity="Danger" value="deleted" ></Tag>
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