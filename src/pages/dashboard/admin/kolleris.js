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
    const [grid, setGrid] = useState(null);
    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    const validationRules = { required: true };
    const pageSettings = { pageCount: 5 };
  


    const passwordValidation = {
        minLength: [5, 'Τουλάχιστον 5 χαρακτήρες'],
    }
   

  


    const handleFetchUser = async () => {
        try {
            const resp = await axios.post('/api/admin/fetchSoftone',)
            setData(resp?.data?.rows)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchUser();
       
    }, [])

    useEffect(() => {
        console.log(data)
    }, [data])

    const actionBegin = async (e) => {

        if(!flag && grid) {
            console.log('We should be able to enter')
            if(e.requestType == 'save' && e.action == 'edit') {
                console.log('Edit a row from the dataGrid')
                e.cancel = true;
                let editedData = e.data;
                console.log('editedData' + JSON.stringify(editedData))
               
                let res = await handleCRUD(editedData, 'edit');
                if(res.success == true) {
                    // setFlag(true)
                    this.flag = true;


                    console.log('res')
                    console.log(JSON.stringify(res))
                    grid.endEdit();
                } 
                if(res.success == false) {
                    
                    toast.error(res.error)
                    // setFlag(false)
                    this.flag = false;

                }
            }
            if(e.requestType == 'save' && e.action == 'add') {
                e.cancel = true;
                let editedData = e.data;
                console.log('editedData' + JSON.stringify(editedData))
                let res = await handleAdd(editedData);
                if(res.success) {
                    setFlag(true)
                    console.log('res')
                    console.log(JSON.stringify(res))
                    grid.endEdit();
                    setFlag(false)

                } 
                if(res.success == false) {
                    
                    toast.error(res.error)
                    setFlag(false)
                }
            }
            // if (e.requestType == 'save' && (e.action == 'edit' || e.action == 'add')) {
            //     e.cancel = true;
            //     let editedData = e.data;
            //     console.log('editedData' + JSON.stringify(editedData))
            //     // let res = await handleCRUD(editedData, 'add')
            //     let res = await handleAdd(editedData);
            //     if(res.success) {
            //         setFlag(true)
            //         console.log('res')
            //         console.log(JSON.stringify(res))
            //         grid?.endEdit();
            //     } 
            //     if(res.success == false) {
                    
            //         toast.error(res.error)
            //         setFlag(false)
            //     }
            // }   

        }
    }


    //Αdd and save user
    const actionComplete = async (e) => {
      
        if (e.requestType === 'save' || e.requestType === 'delete') {
            console.log('on Action Complete')
            // setFlag(false)
            console.log('flag ' + flag)
            this.flag = false;

        }
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
                    // actionBegin={actionBegin}
                    // actionComplete={actionComplete}
                    ref={g => setGrid(g)}
                  
                >
                    <ColumnsDirective  >
                        <ColumnDirective field='mtrl' headerText='Mtrl' width='100' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='name' headerText='Όνομα' width='100' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='Code' headerText='Code' width='100' validationRules={validationRules}></ColumnDirective>
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