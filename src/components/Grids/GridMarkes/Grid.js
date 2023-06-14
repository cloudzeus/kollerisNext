import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter, ExcelExport, Sort } from '@syncfusion/ej2-react-grids';
import { GridContainer } from "./styles";
import styled from "styled-components";
import { useDispatch } from 'react-redux';
import { setSelectedId, setGridRowData } from "@/features/grid/gridSlice";

const settings = { checkboxMode: 'ResetOnRowClick' };
const validationRules = { required: true };
const pageSettings = { pageCount: 5 };
const loadingIndicator = { indicatorType: 'Shimmer' }
const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
const toolbarOptions = ['Search', 'ExcelExport'];


const Grid = ({ id, setId }) => {

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

    const created = () => {
        document.getElementById(grid.element.id + "_searchbar").addEventListener('keyup', () => {
            grid.search(event.target.value);
        });
    };

    const toolbarClick = (args) => {
        if (grid && args.item.id === 'grid_excelexport') {
            grid.excelExport();
        }
    };

    const sortingOptions = {
        columns: [{ field: 'softOne.MTRMAR', direction: 'Ascending' }]
    };

    const gridTemplate = (props) => {
        const logo = props.logo ? props.logo : 'notfound.jpg'
        const objectFit = props.logo ? 'contain' : 'cover'
        return (
            <ImageDiv>
                <Image
                    src={`/uploads/${logo}`}
                    alt="mountain"
                    fill={true}
                    style={{objectFit: objectFit}}	
                    sizes="40px"
                />
            </ImageDiv>
        );
    };

    useEffect(() => {
        handleFetchUser();
    }, [])

    const rowSelected = () => {
        if (grid) {
            const selectedrecords = grid.getSelectedRecords();
            let id = selectedrecords[0]._id
            console.log(selectedrecords[0])
            setId(id)
            dispatch(setSelectedId(id))
            dispatch(setGridRowData(selectedrecords[0]))
        }
    };
    return (
        <GridContainer>
            <GridComponent
                id='grid'
                allowMultiSorting={true}
                selectionSettings={settings}
                // sortSettings={sortingOptions}
                allowSorting={true}
                toolbarClick={toolbarClick}
                toolbar={toolbarOptions}
                dataSource={data}
                allowPaging={true}
                allowExcelExport={true}
                pageSettings={pageSettings}
                loadingIndicator={loadingIndicator}
                rowSelected={rowSelected}
                created={created}
                ref={g => setGrid(g)}
            >
                <ColumnsDirective>
                    {/* <ColumnDirective type='checkbox' width='30'></ColumnDirective> */}
                    <ColumnDirective field='softOne.MTRMARK' headerText='MTRMARK' width='100' ></ColumnDirective>
                    <ColumnDirective field='logo' headerText='Λογότυπο' width='100' template={gridTemplate}></ColumnDirective>
                    <ColumnDirective field='softOne.NAME' headerText='Softone Όνομα' width='140' ></ColumnDirective>
                    <ColumnDirective field='name' headerText='Όνομα' width='140' ></ColumnDirective>
                    <ColumnDirective field='description' headerText='Περιγραφή' width='100'  ></ColumnDirective>

                    {/* <ColumnDirective field='photosPromoList' headerText='Video' width='100'></ColumnDirective>
                <ColumnDirective field='pimAccess.pimUrl' headerText='pimAccess' width='100'></ColumnDirective> */}
                </ColumnsDirective>
                <Inject services={[Page, Edit, Toolbar, Filter, ExcelExport, Sort]} />
            </GridComponent>
        </GridContainer>
    )
}

const ImageDiv = styled.div`
    width: 50px;
    height: 50px;
    object-fit: contain;
    border-radius: 4px;
    background-color: white;
    position: relative;
    overflow: hidden;
    border: 2px solid ${({ theme }) => theme.palette.border};
    
   
`

export default Grid