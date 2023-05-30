'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter, actionBegin } from '@syncfusion/ej2-react-grids';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { conditionalFormatting } from '@syncfusion/ej2/pivotview';
import { InputStyled } from '@/components/Forms/FormInput';
import { DataManager, RemoteSaveAdaptor } from '@syncfusion/ej2-data';
import { useForm } from "react-hook-form";
import Dialog from '@/components/DialogFormTeampates/Templates/Markes';
import Image from '../../assets/imgs/queen.png'
function DialogEdit() {

    return (
        <AdminLayout>
            <GridTable />
        </AdminLayout>
    );
}

const GridTable = () => {


    
    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search', ];

    const [data, setData] = useState([]);
    const validationRules = { required: true };
    const pageSettings = { pageCount: 5 };
    const loadingIndicator = { indicatorType: 'Shimmer' }
    const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
   

  
    const actionBegin = (args) => {
      
        console.log(args.data)
    }

    const handleFetchUser = async () => {

        try {
            const resp = await axios.post('/api/admin/users', { action: 'findAll' })
            console.log(resp.data.user)
            setData(resp.data.user)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchUser();
        console.log('it should refresh')
    }, [])

    let grid;
    const rowSelected = () => {
        // if (grid) {
        //     console.log('grid')
        //     /** Get the selected row indexes */
        //     const selectedrowindex = grid.getSelectedRowIndexes();
        //     const selectedrecords = grid.getSelectedRecords();
        //     console.log(selectedrecords)
        //     // alert(selectedrowindex + " : " + JSON.stringify(selectedrecords));
        // }
    };
    const gridTemplate = (props) => {
        return (
        <div >
            <img src={'../../assets/imgs/luffy.png'}  />
        </div>
        );
    };

    return (
        <>
            <Container p="0px" className="box">
             
                <h2 className="boxHeader">Χρήστες</h2>
                <Dialog />
                <GridComponent
                    toolbar={toolbarOptions}
                    editSettings={editOptions}
                    dataSource={data}
                    allowPaging={true}
                    pageSettings={pageSettings}
                    loadingIndicator={loadingIndicator}
                    actionBegin={actionBegin}
                    // rowSelected={rowSelected}
                    ref={g => grid = g}
                >
                    <ColumnsDirective  >
                        <ColumnDirective field='firstName' headerText='Όνομα' width='100' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='firstName' headerText='Όνομα' width='100'  template={gridTemplate} validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='LastName' headerText='Περιγραφή' width='100' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='logo' headerText='Λογότυπο' width='100' validationRules={validationRules}></ColumnDirective>

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


const GridActionsContainer = styled.div`
    background-color: $fafafa;
`

const GridActions = () => {
    return (
       < GridActionsContainer>
            <button>Add</button>
            <button>Edit</button>
        </GridActionsContainer>
    )
}

