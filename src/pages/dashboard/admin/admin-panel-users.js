'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter } from '@syncfusion/ej2-react-grids';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { conditionalFormatting } from '@syncfusion/ej2/pivotview';

import { DataManager, RemoteSaveAdaptor } from '@syncfusion/ej2-data';

function DialogEdit() {

    return (
        <AdminLayout>
            <GridTable />
        </AdminLayout>
    );
}

const GridTable = () => {

    const [grid, setGrid] = useState(null);
    const [flag, setFlag] = useState(false)
    const [error, setError] = useState(false)
    const [data, setData] = useState([])

    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    const editparams = { params: { popupHeight: '300px' } };
    const validationRules = { required: true };
    const pageSettings = { pageCount: 5 };
    const loadingIndicator = { indicatorType: 'Shimmer' }

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

        if (!flag && grid) {
            if (e.requestType == 'save' && e.action == 'edit') {
                e.cancel = true;
                let editedData = e.data;
                const handleCRUD = async (data, action) => {
                    try {
                        const res = await axios.post('/api/admin/users', { action: action, ...data })
                        console.log(res)
                        console.log('res success is: ' + res.data.success)
                        if (res.data.success == true) {
                            grid.endEdit();
                            setFlag(() => true)
                        }
                        if (res.data.success == false) {
                            toast.error(res.data.error)
                            setFlag(false)
                            console.log('')

                        }

                    } catch (error) {
                        console.log(error)
                    }
                }
                handleCRUD(editedData, 'edit')
            }


            //ADD USER:
            if (e.requestType == 'save' && e.action == 'add') {

                let editedData = e.data;
                // e.cancel = true
                const handleCrud = async (data, action) => {
                    try {
                        const res = await axios.post('/api/admin/users', { action: action, ...data })
                        handleFetchUser()
                        if (res.data.success) {
                           
                        }

                        if (res.data.success == false) {
                        
                            toast.error(res.data.error)
                            setError(res.data.error)
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
        setFlag(false)
        if (e.requestType === 'save' && e.action === 'add') {
            console.log('On action complete: SAVE')
        }
    }

    const handleGrid = (g) => {
        setGrid(g)
    }


    return (
        <>
            <Container p="0px" className="box">
                <h2 className="boxHeader">Χρήστες</h2>
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
                        // autoFit ={true}
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
                    </Container>
        </>

    )

}


const Container = styled.div`
    padding: 0px;
`




export default DialogEdit;