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
import Gallery from '@/components/Gallery';
import { useDispatch } from 'react-redux';
import { TabView, TabPanel } from 'primereact/tabview';
import { setGridRowData } from '@/features/grid/gridSlice';
import { ActionDiv } from '@/componentsStyles/grid';
import DeletePopup from '@/components/deletePopup';
import { DisabledDisplay } from '@/componentsStyles/grid';
import { InputTextarea } from 'primereact/inputtextarea';
import UrlInput from '@/components/Forms/PrimeUrlInput';
import { Toast } from 'primereact/toast';
import SyncBrand from '@/GridSync/SyncBrand';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import GridLogoTemplate from '@/components/grid/gridLogoTemplate';
import GridTranslate from '@/components/grid/GridTranslate';
import GridActions from '@/components/grid/GridActions';
import { useSession } from 'next-auth/react';


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
        console.log(data)
        let newArray = []
        for (let image of data.photosPromoList) {
            newArray.push(image.photosPromoUrl)
        }

        return (
            <  >
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
            </ >
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew} />
            </div>
        );
    };

    // const rightToolbarTemplate = () => {
    //     return (
    //         <SyncBrand
    //             refreshGrid={handleFetch}
    //             addToDatabaseURL='/api/product/apiMarkes'
    //         />
    //     )
    // }


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

    const onDelete = async (id) => {

        let res = await axios.post('/api/product/apiMarkes', { action: 'delete', id: id })
        if (!res.data.success) return showError()
        handleFetch()
        showSuccess()
    }

    // CUSTOM TEMPLATES FOR COLUMNS
    const actionBodyTemplate = (rowData) => {
        return (
            <GridActions onDelete={onDelete} onEdit={editProduct} rowData={rowData} />
        )
    }

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
    
    console.log(data)
    return (
        <AdminLayout >
            <Toast ref={toast} />
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
                <Column field="softOne.NAME" header="Ονομα" sortable></Column>
                <Column field="minItemsOrder"  header="Min items order" sortable></Column>
                <Column field="minValueOrder"  header="Μin value order" sortable></Column>
                <Column field="minYearPurchases"  header="Μin year purchases" sortable></Column>
                <Column field="updatedFrom" sortable header="updatedFrom" style={{ width: '90px' }} body={UpdatedFromTemplate}></Column>
                {user?.role === 'admin' ? (
                    <Column body={actionBodyTemplate} exportable={false} sortField={'delete'} bodyStyle={{ textAlign: 'center' }} style={{ width: '90px' }} ></Column>
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
const CreatedFromTemplate = ({ createdFrom, createdAt }) => {
    return (
        <RegisterUserActions
            actionFrom={createdFrom}
            at={createdAt}
            icon="pi pi-user"
            color="#fff"
            backgroundColor='var(--green-400)'
        />

    )
}







