'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter, actionBegin } from '@syncfusion/ej2-react-grids';
import styled from 'styled-components';
import { Container, GridActions } from './styles';
import {
    validationRules,
    pageSettings,
    loadingIndicator,
    editOptions,
    toolbarOptions,
    AddIcon,
    EditIcon,
    DeleteIcon,
} from './config';
import { FormAdd } from './formAdd';

const GridTable = () => {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false)
    const [action, setAction] = useState({
        add: false,
        edit: false,
        delete: false,
    })   

    console.log(action)
    
    const handleClick = () => {
      setShow((prev) => !prev)
    }
    
    const handleAction = () => {
        console.log('handleAction')
      setAction((prev) => ({...prev, add: true}))
    }

    const handleCancel = () => {
        setAction((prev) => ({
            ...prev, 
            add: false,
            edit: false,
            cancel: false
        }
            ))
    }
    
   

   
   

    return (
        <>
            <Container p="0px" className="box">
                
                <div className="header">
                    <h2 className="boxHeader">Χρήστες</h2>
                </div>
                <GridActions >
                    <button onClick={handleAction}>
                        <AddIcon /> Προσθήκη
                    </button>
                    <button onClick={handleClick}>
                        <EditIcon /> Διόρθωση
                    </button>
                    <button onClick={handleClick}>
                        <DeleteIcon /> Διαγραφή
                    </button>
                    <button onClick={handleCancel}>
                        <DeleteIcon /> Ακύρωση
                    </button>
                </GridActions>

                {!action.add && !action.edit && <Grid />}
                {action.add && (
                    <FormAdd />
                )}
              
            </Container>
        </>

    )

}




const Grid = () => {
    const [data, setData] = useState([]);
     const handleFetchUser = async () => {

        try {
            const resp = await axios.post('/api/admin/users', { action: 'findAll' })
            console.log(resp.data.user)
            setData(resp.data.user)
    
        } catch (error) {
            console.log(error)
        }
    }
    const gridTemplate = (props) => {
        return (
            <div >
                <img src={'../../assets/imgs/luffy.png'} />
            </div>
        );
    };
    useEffect(() => {
        handleFetchUser();
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
    return (
        <GridComponent
        // toolbar={toolbarOptions}
        editSettings={editOptions}
        dataSource={data}
        allowPaging={true}
        pageSettings={pageSettings}
        loadingIndicator={loadingIndicator}
        // rowSelected={rowSelected}
        ref={g => grid = g}
    >
        <ColumnsDirective  >
            <ColumnDirective field='firstName' headerText='Όνομα' width='100' validationRules={validationRules}></ColumnDirective>
            <ColumnDirective field='firstName' headerText='Όνομα' width='100' template={gridTemplate} validationRules={validationRules}></ColumnDirective>
            <ColumnDirective field='LastName' headerText='Περιγραφή' width='100' validationRules={validationRules}></ColumnDirective>
            <ColumnDirective field='logo' headerText='Λογότυπο' width='100' validationRules={validationRules}></ColumnDirective>
        </ColumnsDirective>
        <Inject services={[Page, Edit, Toolbar, Filter]} />
    </GridComponent>
    )
}




export default GridTable;
