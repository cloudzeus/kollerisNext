'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter} from '@syncfusion/ej2-react-grids';
import AdminLayout from '@/layouts/Admin/AdminLayout';



function DialogEdit() {
    return (
        <AdminLayout>
            <GridTable />
        </AdminLayout>
    );
}


const validatePassword = (args) => {
    if (args.value.length < 6) {
      args.hasError = true;
      args.error = 'Password must be at least 6 characters long.';
    }
  };
const GridTable = () => {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(true)
    const [action, setAction] = useState(true)


    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    const editparams = { params: { popupHeight: '300px' } };
    const validationRules = { required: true };
    const orderidRules = { required: true, number: true };
    const pageSettings = { pageCount: 5 };
    const passwordValidation = {
        minLength: [5, 'Τουλάχιστον 5 χαρακτήρες'],
    }


    const handleAdd = async (user) => {
        const resp = await axios.post('/api/admin/users', { action: 'add', ...user })
        setAction(prev => !prev)
        setVisible(prev => !prev)
    }


    const handleFetchUser = async () => {

        try {
            const resp = await axios.post('/api/admin/users', { action: 'findAll' })
            setData(resp.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchUser();
    }, [])

    
   
    
    const actionBegin = (args) => {
      
    };


    //Αdd and save user
    const actionComplete = (args) => {
        console.log(args)
        if ((args.requestType === 'save')) {
          
            let added = handleAdd(args.data)
            if(added) {
                args.cancel = false;
            }
            if(!added) {
                args.cancel = true;
            }
        }
    }

   


    return (
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
                >
                    <ColumnsDirective>
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

    )

}



export default DialogEdit;