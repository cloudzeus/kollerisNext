'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter } from '@syncfusion/ej2-react-grids';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { conditionalFormatting } from '@syncfusion/ej2/pivotview';


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
    const [flag, setFlag] = useState(false)


    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    const editparams = { params: { popupHeight: '300px' } };
    const validationRules = { required: true };
    const pageSettings = { pageCount: 5 };
    const loadingIndicator = { indicatorType: 'Shimmer' };


    const passwordValidation = {
        minLength: [5, 'Τουλάχιστον 5 χαρακτήρες'],
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





    const actionBegin = (e) => {
        // console.log('e.row')
        console.log(e)
        // console.log('Initial Events: ' )
        // console.log(e)
        // console.log('flag is: '  + flag)
        if (!flag && grid) {
            // console.log(grid)
            if (e.requestType == 'save' && e.action == 'edit') {
                
                e.cancel = true;
                let editedData = e.data;
                const handleCRUD = async (data, action) => {
                    try {
                        const res = await axios.post('/api/admin/users', { action: action, ...data })
                        console.log(res)
                        if (res.data.success == true) {
                            console.log(res.data)
                            grid.endEdit();
                            setFlag(() => true)
                        }
                        if (res.data.success == false) {
                            toast.error(res.data.error)
                            setFlag(false)

                        }

                    } catch (error) {
                        console.log(error)
                    }
                }
                handleCRUD(editedData, 'edit')
            }


            //ADD USER:
            if (e.requestType == 'save' && e.action == 'add') {
                console.log('----------------------------------------------------------------------------------------')
                let editedData = e.data;
                console.log('editedData' + JSON.stringify(editedData))
            
                const handleCrud = async (data, action) => {
                    e.cancel = true;

                    try {
                        const res = await axios.post('/api/admin/users', { action: action, ...data })
                        console.log(res);
                        e.cancel = false;
                        if (res.data.success) {
                            
                            console.log('are we here')
                            
                        }


                        if (res.data.success == false) {
                            toast.error(res.data.error)

                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                handleCrud(editedData, 'add')
            }
            
        }
    }



    //Αdd and save user
    const actionComplete = (e) => {
        console.log('on Action Complete')
        console.log(e)
        // setFlag(false)
        if(e.requestType === 'save') {
            console.log('On action complete: SAVE')
            // setFlag(false)
        }
    }

    const handleGrid = (g) => {
        setGrid(g)
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
                        loadingIndicator={loadingIndicator}
                        actionBegin={actionBegin}
                        actionComplete={actionComplete}
                        ref={g => handleGrid(g)}

                    >
                        <ColumnsDirective  >
                            <ColumnDirective field='firstName' headerText='Όνομα' width='100' validationRules={validationRules}></ColumnDirective>
                            <ColumnDirective field='lastName' headerText='Eπώνυμο' width='100' validationRules={validationRules}></ColumnDirective>
                            <ColumnDirective field='email' headerText='Email' width='180' validationRules={validationRules}></ColumnDirective>
                            <ColumnDirective field='password' headerText='Kωδικός' width='100' validationRules={passwordValidation} template={rowData => '••••••••••'}  ></ColumnDirective>
                            <ColumnDirective field='role' headerText='Ρόλος' width='150' editType='dropdownedit' edit={editparams} validationRules={validationRules}></ColumnDirective>
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