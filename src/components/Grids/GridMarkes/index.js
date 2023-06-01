'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter, actionBegin } from '@syncfusion/ej2-react-grids';
import styled from 'styled-components';
import Image from 'next/image'
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
    const [id, setId] = useState(null);
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
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
        setAction((prev) => ({ ...prev, add: true }))
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

    const handleDeleteUser = async () => {
        console.log('delete id')
        console.log(id)
        try {
            const resp = await axios.post('/api/admin/markes/markes', { action: 'delete', id: id })
            console.log(resp.data)
            handleFetchUser();
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        console.log(id)
    }, [id])
    return (
        <>
            <Container p="0px" className="box">
                <div className="header">
                    <h2 className="boxHeader">Μάρκες</h2>
                </div>
                <GridActions >
                    <button onClick={handleAction}>
                        <AddIcon /> Προσθήκη
                    </button>
                    <button onClick={handleClick}>
                        <EditIcon /> Διόρθωση
                    </button>
                    <button onClick={handleDeleteUser}>
                        <DeleteIcon /> Διαγραφή
                    </button>
                    <button onClick={handleCancel}>
                        <DeleteIcon /> Ακύρωση
                    </button>
                </GridActions>

                {!action.add && !action.edit && <Grid id={id} setId={setId}/>}
                {action.add && (
                    <FormAdd />
                )}

            </Container>
        </>

    )

}




const Grid = ({id, setId}) => {
    const [data, setData] = useState([]);
    const handleFetchUser = async () => {
        try {
            const resp = await axios.post('/api/admin/markes/markes', { action: 'findAll' })
            setData(resp.data.markes)

        } catch (error) {
            console.log(error)
        }
    }
    
    const gridTemplate = (props) => {
        console.log(props.logo)
        return (
            <ImageDiv>
                <Image
                    src={`/static/imgs/${props.logo}`}
                    // src={`/static/imgs/mountain.jpg`}
                    alt="mountain"
                    width={100}
                    height={40}

                />
            </ImageDiv>
        );
    };
    useEffect(() => {
        handleFetchUser();
    }, [])

    let grid;
    const rowSelected = () => {
        if (grid) {
            const selectedrecords = grid.getSelectedRecords();
            let id = selectedrecords[0]._id
            setId(id)
        }
    };
    return (
        <GridComponent
            dataSource={data}
            allowPaging={true}
            pageSettings={pageSettings}
            loadingIndicator={loadingIndicator}
            rowSelected={rowSelected}
            ref={g => grid = g}
        >
            <ColumnsDirective>
                <ColumnDirective type='checkbox' width='50'></ColumnDirective>
                <ColumnDirective field='name' headerText='Όνομα' width='100' ></ColumnDirective>
                <ColumnDirective field='description' headerText='Περιγραφή' width='100'  ></ColumnDirective>
                <ColumnDirective field='logo' headerText='Περιγραφή' width='100' template={gridTemplate}></ColumnDirective>
                <ColumnDirective field='photosPromoList' headerText='Video' width='100'></ColumnDirective>
                <ColumnDirective field='pimAccess.pimUrl' headerText='pimAccess' width='100'></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Page, Edit, Toolbar, Filter]} />
        </GridComponent>
    )
}




export default GridTable;


const ImageDiv = styled.div`
    width: 100px;
    height: auto;
    object-fit: cover;
    border-radius: 50%;
    img {
        width: 100%;
        height: 100%;
    }
`