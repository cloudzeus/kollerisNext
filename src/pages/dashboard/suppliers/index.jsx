import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import StepHeader from '@/components/StepHeader';
import { useRouter } from 'next/router';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { EditDialog, AddDialog } from '@/GridDialogs/supplierDialog';
import { setGridRowData } from '@/features/grid/gridSlice';
import RegisterUserActions from '@/components/grid/GridRegisterUserActions';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useSelector } from 'react-redux';
import { setSelectedSupplier } from '@/features/supplierOrderSlice';
import styled from 'styled-components';
import { setGridData, setHeaders, setSelectedPriceKey, } from '@/features/catalogSlice';
import * as XLSX from 'xlsx';
import { uploadBunny, uploadBunnyFolderName } from '@/utils/bunny_cdn';
import Link from 'next/link';
function modifyName(name) {
    // Remove symbols from the name using a regular expression
    const cleanedName = name.replace(/[^\w\s]/g, '');
    // Generate a random number between 1 and 100 (you can adjust the range as needed)
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    // Append the random number to the cleaned name
    const modifiedName = `${cleanedName}${randomNumber}`;
    return modifiedName;
}

export default function Page() {
    const { selectedSupplier,  inputEmail, mtrl } = useSelector(state => state.supplierOrder) 

    const {gridData} = useSelector(state => state.catalog)
    const fileInputRef = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0)
    const [data, setData] = useState([])
    const toast = useRef(null);
    const [editData, setEditData] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fileLoading, setFileLoading] = useState(false)
    const [sortOffers, setSortOffers] = useState(1)
    const [searchTerm, setSearchTerm] = useState({
        name: '',
        afm: '',
        address: '',
        phone01: '',
        phone02: '',
        email: ''
    })
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 50,
        page: 1,
    });


    const onPage = (event) => {
        setlazyState(event);
    };


    const fetchClients = async () => {
        const isAnyFieldNotEmpty = Object.values(searchTerm).some(value => value == '');
        if (isAnyFieldNotEmpty) {
            setLoading(true)
        }
       
        let { data } = await axios.post('/api/suppliers', {
            action: "fetchAll",
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm,
            sortOffers: sortOffers,
        })
        setData(data.result)
        setTotalRecords(data.totalRecords)
        setLoading(false)

    }


    useEffect(() => {
        fetchClients();
    }, [
        lazyState.rows,
        lazyState.first,
        searchTerm,
        submitted,
        sortOffers
    ])



   


  
    //Add product
    const openNew = () => {
        setSubmitted(false);
        setAddDialog(true);
    };


    const hideDialog = () => {
        setEditDialog(false);
        setAddDialog(false);
    };



   



    const SearchName = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.name} onChange={(e) => setSearchTerm(prev => ({ ...prev, name: e.target.value }))} />
                </span>
            </div>
        )
    }

    const SearchAFM = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.afm} onChange={(e) => setSearchTerm(prev => ({ ...prev, afm: e.target.value }))} />
                </span>
            </div>
        )
    }
    const SearchΑddress = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.address} onChange={(e) => setSearchTerm(prev => ({ ...prev, address: e.target.value }))} />
                </span>
            </div>
        )
    }
    const SearchPhone01 = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.phone01} onChange={(e) => setSearchTerm(prev => ({ ...prev, phone01: e.target.value }))} />
                </span>
            </div>
        )
    }
    const SearchPhone02 = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.phone02} onChange={(e) => setSearchTerm(prev => ({ ...prev, phone02: e.target.value }))} />
                </span>
            </div>
        )
    }
    const SearchEmail = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.email} onChange={(e) => setSearchTerm(prev => ({ ...prev, email: e.target.value }))} />
                </span>
            </div>
        )
    }

    const FilterOffers = () => {
       const onSort = () => {
        setSortOffers(prev => {
            if(prev === 0) return 1;
            if(prev === 1) return -1;
            if(prev === -1) return 0;
        })
       }
       console.log(sortOffers)
        
        return (
            <div>
                  <div className='ml-3'>
                    {sortOffers === 0 ? (<i className="pi pi-sort-alt" onClick={onSort}></i>) : null}
                    {sortOffers === 1 ? (<i className="pi pi-sort-amount-up" onClick={onSort}></i>) : null}
                    {sortOffers === -1 ? (<i className="pi pi-sort-amount-down-alt" onClick={onSort}></i>) : null}
                </div>
            </div>
        )
    }
   
    //EDIT TEMPALTE AND HANDLER
    const editProduct = async (product) => {
        setSubmitted(false);
        setEditDialog(true)
        dispatch(setGridRowData(product))
    };

    const newOrder = async (supplier) => {
        dispatch(setSelectedSupplier(supplier))
        let email = supplier.EMAIL || 'no-email'
        router.push(`/dashboard/suppliers/chooseProducts/${supplier.TRDR}/${supplier.NAME}/${email}/${supplier.minOrderValue}}`)
    }

    const onUploadClick = () => {
        fileInputRef.current.click()
    }

    useEffect(() => {
        if(gridData.length) {

        }
    }, [gridData])


    const handleFileUpload = async (e, rowData) => {
        setFileLoading(true)
        let fileName = e.target.files[0].name
        let save = await axios.post('/api/suppliers', {action: 'saveCatalog', catalogName: fileName, id: rowData._id})
      
        dispatch(setSelectedSupplier(rowData))
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onload = async (e) => {

            const data = e.target.result;
            let upload = await uploadBunnyFolderName(data, fileName , 'catalogs')
         
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            console.log(parsedData)
            dispatch(setGridData(parsedData))

            if (parsedData.length > 0) {
                const firstRow = parsedData[0];
                const headers = Object.keys(firstRow).map((key) => ({
                    field: key,
                }));
                dispatch(setHeaders(headers))
                setFileLoading(false)
                router.push('/dashboard/catalogs/upload-catalog')
                
              
            }
        };
    };

    const ActionTemplate = (rowData) => {
        const op = useRef(null);

        return (
            <div className='flex align-items-center justify-content-center'>
            <i className="pi pi-cog mr-2 cursor-pointer text-primary" style={{fontSize: '12px'}} onClick={(e) => op.current.toggle(e)}></i>
                <OverlayPanel ref={op}>
                    <div className='flex flex-column'>
                    <Button label="Διαμόρφωση Προμηθευτή" icon="pi pi-pencil" className='w-full mb-2' onClick={() => editProduct(rowData)} />
                    <Button disabled={rowData?.ORDERSTATUS} label="ΝΕΑ Παραγγελία" severity='success' icon="pi pi-plus" className='w-full mb-2' onClick={() => newOrder(rowData)} />
                    
            <UploadBtn>
                <input className="hide" ref={fileInputRef} type="file" onChange={(e) => handleFileUpload(e, rowData)} />
                <Button className='w-full' severity='warning' loading={fileLoading} onClick={onUploadClick} label="Ανέβασμα τιμοκατάλογου" icon="pi pi-plus"></Button>
            </UploadBtn>
                    </div>
                </OverlayPanel>
        </div>
        )
    }

    const LeftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button disabled={true} label="Νέο" icon="pi pi-plus" severity="secondary" onClick={openNew} />
            </div>
        )
    }
    const ShowOffers = ({ ORDERSTATUS, NAME, TRDR }) => {
        
        const handleClick = () => {
            router.push(`/dashboard/suppliers/order/${TRDR}`)
        }
        if (ORDERSTATUS) {
            return (
                <div className='flex cursor-pointer align-items-center justify-content-center p-0' onClick={handleClick}>
                    <div className={`bg-green-600  border-round mr-1 mt-1 `} style={{ width: '4px', height: '4px' }}></div>
                    <span className='font-xm text-600' style={{fontSize: '10px'}}>OFFERS</span>

                </div>
            )
        }
        

    }

    return (
        <AdminLayout >
            <Toast ref={toast} />
            <StepHeader text="Προμηθευτές" />
            <Toolbar start={LeftToolbarTemplate}></Toolbar>
            <DataTable
                lazy
                totalRecords={totalRecords}
                first={lazyState.first}
                onPage={onPage}
                rows={lazyState.rows}
                size="small"
                value={data}
                paginator
                rowsPerPageOptions={[50, 100, 200, 500]}
                dataKey="_id"
                paginatorRight={true}
                loading={loading}
                filterDisplay="row"
                showGridlines
            >   
                <Column body={ActionTemplate} style={{width: '50px'}}></Column>
                
                <Column body={ShowOffers} filter showFilterMenu={false} filterElement={FilterOffers} header="Order Status" style={{minWidth: '70px'}}></Column>
                <Column field="NAME" filter showFilterMenu={false} filterElement={SearchName} body={NameTemplate} header="Ονομα"></Column>
                <Column field="AFM" filter showFilterMenu={false} filterElement={SearchAFM} header="ΑΦΜ" ></Column>
                <Column field="ADDRESS" filter showFilterMenu={false} filterElement={SearchΑddress} header="Διεύθυνση" ></Column>
                <Column field="EMAIL" filter showFilterMenu={false} filterElement={SearchEmail} header="Email"></Column>
                <Column field="PHONE01" filter showFilterMenu={false} filterElement={ SearchPhone01} header="Τηλέφωνο" ></Column>
                <Column field="PHONE02" filter showFilterMenu={false} filterElement={SearchPhone02} header="Τηλέφωνο 2" ></Column>
                <Column field="ZIP" header="Ταχ.Κώδικας" ></Column>
                <Column field="updatedFrom" header="updatedFrom"  body={UpdatedFromTemplate} style={{ width: '90px' }}></Column>

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
                dialog={addDialog}
                setDialog={setAddDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            />

        </AdminLayout >
    );
}



const NameTemplate = ({NAME, catalogName}) => {
    return (
        <div className='flex align-items-center'>
            {catalogName ? (
                <Link href={`https://kolleris.b-cdn.net/catalogs/${catalogName}`}>
                <i className="pi pi-file-pdf mr-2 text-red-500 mr-1"></i>
    
               </Link>
            ) : null}
            <span>{NAME}</span>
           
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

const UploadBtn = styled.div`
  .hide {
    display: none;
  }
  display: inline-block;
`;




