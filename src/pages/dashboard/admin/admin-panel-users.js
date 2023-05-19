'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter} from '@syncfusion/ej2-react-grids';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import styled from 'styled-components';
import { toast } from 'react-toastify';


function DialogEdit() {
    return (
        <AdminLayout>
            <GridTable />
        </AdminLayout>
    );
}



const GridTable = () => {
    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(true)
    const [flag, setFlag]  =useState(false)     
    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    const editparams = { params: { popupHeight: '300px' } };
    const validationRules = { required: true };
    const pageSettings = { pageCount: 5 };



    const passwordValidation = {
        minLength: [5, 'Τουλάχιστον 5 χαρακτήρες'],
    }
   

    const handleCRUD = async (data, action) => {
        console.log(`Action is: ${action}, data: ${JSON.stringify(data)}`)
        const resp = await axios.post('/api/admin/users', { action: action, ...data })
        console.log('response')
        console.log(resp)
        return resp.data;
    }
    const handleAdd = async (data) => {
        const resp = await axios.post('/api/user/registeruser', data )
        console.log('response')
        console.log(resp)
        return resp.data;
    }


    const handleFetchUser = async () => {

        try {
            const resp = await axios.post('/api/admin/users', { action: 'findAll' })
            setData(resp.data.user)
            console.log('resp')
            console.log(resp.data   )
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchUser();
    }, [])

    let grid;
    const actionBegin = async (e) => {
        console.log('actionBegin')
        console.log(grid)
        if(!flag) {
            if (e.requestType == 'save' && (e.action == 'edit' || e.action == 'add')) {
                e.cancel = true;
                let editedData = e.data;
                console.log('editedData' + JSON.stringify(editedData))
                // let res = await handleCRUD(editedData, 'add')
                let res = await handleAdd(editedData);
                if(res.success) {
                    setFlag(true)
                    console.log('res')
                    console.log(JSON.stringify(res))
                    grid?.endEdit();
                } 
                if(res.success == false) {
                    
                    toast.error(res.error)
                    setFlag(false)
                }
                }   

            }
        }


    //Αdd and save user
    const actionComplete = async (args) => {
        // console.log(args)
        console.log(grid)
        // if(args.requestType === 'save' && args.action === 'add') {
        setFlag(false)
        // if(args.requestType === 'save') {
        //     console.log('args after save')
        //     console.log(args)
          
        // }
        // if(args.requestType === 'save' && args.action === 'edit') {}  
        // //ADD NEW
        // if(args.requestType === 'save' && args.action === 'add') {
        //     let res = await handleCRUD(args.data, 'add')
        //     if(res && res.success === true) {
        //         res && toast.success('Επιτυχής ενημέρωση')
        //     }
        //     if(res && res.success === false) {
        //         res && toast.success(`Αποτυχία ενημέρωσης: ${res.error}`)
        //     }
            
          
        // }  

    }
   

    return (
     <>
           <div className='control-pane'>
            <div className='control-section'>
                <GridComponent
                    dataSource={data}
                    toolbar={toolbarOptions}
                    allowPaging={true}
                    editSettings={editSettings}
                    pageSettings={pageSettings}
                    actionBegin={actionBegin}
                    actionComplete={actionComplete}
                    ref={g => grid = g}
                  
                >
                    <ColumnsDirective  >
                        <ColumnDirective field='firstName' headerText='Όνομα' width='100' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='lastName' headerText='Eπώνυμο' width='100' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='email' headerText='Email' width='180' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='password' headerText='Kωδικός' width='100'  validationRules={passwordValidation}  template={rowData => '••••••••••'}  ></ColumnDirective>
                        <ColumnDirective field='role'  headerText='Ρόλος' width='150' editType='dropdownedit' edit={editparams}  validationRules={validationRules}></ColumnDirective>
                    </ColumnsDirective>
                    <Inject services={[Page, Edit, Toolbar, Filter]} />
                </GridComponent>
            </div>
        </div>
     </>

    )

}





const CustomGrid = styled(GridComponent).attrs(props => ({
  className: props.className // Pass the className prop from styled component to Syncfusion Button
}))`

`;

export default DialogEdit;