'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter, Grid } from '@syncfusion/ej2-react-grids';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import styled from 'styled-components';

import { DataManager } from '@syncfusion/ej2-data';


function DialogEdit() {
    return (
        <AdminLayout>
            <CustomGrid/>
        </AdminLayout>
    );
}



const CustomGrid = (props) => {
    const [data, setData] = useState([])
    const [grid, setGrid] = useState(null);
    const [flag, setFlag] = useState(false)
    const [newRowData, setNewRowData] = useState({})

    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
    const editparams = { params: { popupHeight: '300px' } };
    const validationRules = { required: true };
    const pageSettings = { pageCount: 5 };


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
        console.log('yes')
        console.log(e);
            setNewRowData(e.data)
    }



    //Αdd and save user
    const actionComplete = (e) => {
       
    }

    const handleGrid = (g) => {
        setGrid(g)
    }

    const handleAdd = async (data) => {
        console.log('add')
    }
    return (
        <Container>
            <div className='control-pane'>
                <div className='control-section'>
                    <div className='button-container'>
                    <button onClick={handleAdd} >Add </button>
                    </div>
                    <GridComponent
                        dataSource={data}
                        allowPaging={true}
                        editSettings={editSettings}
                        pageSettings={pageSettings}
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
        </Container>

    )

}


//This is the basic component with the main styles




const Container = styled.div`
    background-color: white;

    .button-container {
        display: flex;
        padding: 10px;
    }
    .control-section {
    /* background-color: red; */
  }
 
`


export default DialogEdit;