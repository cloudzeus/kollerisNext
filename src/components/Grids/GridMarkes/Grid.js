import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter } from '@syncfusion/ej2-react-grids';
import { GridContainer } from "./styles";
import styled from "styled-components";
import { useDispatch } from 'react-redux';
import { setSelectedId, setGridRowData} from "@/features/grid/gridSlice";
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

const Grid = ({id, setId}) => {
    
    const [data, setData] = useState([]);
    const [grid, setGrid] = useState(null);
    const dispatch = useDispatch();

    const handleFetchUser = async () => {
        try {
            const resp = await axios.post('/api/admin/markes/markes', { action: 'findAll' })
            console.log(resp.data.markes)
            setData(resp.data.markes)

        } catch (error) {
            console.log(error)
        }
    }
    
    const gridTemplate = (props) => {
        return (
            <ImageDiv>
                <Image
                    src={`/static/uploads/${props.logo}`}
                    alt="mountain"
                    fill={true}
                />
            </ImageDiv>
        );
    };

    useEffect(() => {
        handleFetchUser();
    }, [])

    const rowSelected = () => {
        console.log('before grid')
        if (grid) {
            console.log('row selected')
            const selectedrecords = grid.getSelectedRecords();
            let id = selectedrecords[0]._id
            console.log('idee')
            console.log(id)
            setId(id)
            dispatch(setSelectedId(id))
            dispatch(setGridRowData(selectedrecords[0]))
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
            ref={g => setGrid(g)}
        >
            <ColumnsDirective>
                <ColumnDirective type='checkbox' width='50'></ColumnDirective>
                <ColumnDirective field='name' headerText='Όνομα' width='100' ></ColumnDirective>
                <ColumnDirective field='description' headerText='Περιγραφή' width='100'  ></ColumnDirective>
                <ColumnDirective field='logo' headerText='Λογότυπο' width='100' template={gridTemplate}></ColumnDirective>
                <ColumnDirective field='photosPromoList' headerText='Video' width='100'></ColumnDirective>
                <ColumnDirective field='pimAccess.pimUrl' headerText='pimAccess' width='100'></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Page, Edit, Toolbar, Filter]} />
        </GridComponent>
       </GridContainer>
    )
}

const ImageDiv = styled.div`
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
   
`

export default Grid