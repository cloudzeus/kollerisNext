import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter } from '@syncfusion/ej2-react-grids';
import { GridContainer } from "./styles";
import styled from "styled-components";
import { useDispatch } from 'react-redux';
import { setSelectedId} from "@/features/gridSlice";
import {
    validationRules,
    pageSettings,
    loadingIndicator,
    editOptions,
    toolbarOptions,
    AddIcon,
    EditIcon,
    DeleteIcon,} from './config';

const Grid = ({id, setId}) => {
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const handleFetchUser = async () => {
        try {
            const resp = await axios.post('/api/admin/markes/markes', { action: 'findAll' })
            setData(resp.data.markes)

        } catch (error) {
            console.log(error)
        }
    }
    
    const gridTemplate = (props) => {
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
            console.log(id)
            setId(id)
            dispatch(setSelectedId(id))
        }
    };
    return (
       <GridContainer>
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
       </GridContainer>
    )
}

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

export default Grid