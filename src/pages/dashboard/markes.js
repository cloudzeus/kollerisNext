'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-grids';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import styled from 'styled-components';
import Dialog from '@/components/DialogFormTeampates/DialogTemplates/MarkesDialog';
import Image from 'next/image';

function DialogEdit() {
    return (
        <AdminLayout>
            <GridTable />
        </AdminLayout>
    );
}

const GridTable = () => {


    const [data, setData] = useState([]);
    const [refreshData, setDataRefresh] = useState(false);
    const validationRules = { required: true };
    const pageSettings = { pageCount: 5 };
    const loadingIndicator = { indicatorType: 'Shimmer' }
    const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    const settings = { checkboxMode: 'ResetOnRowClick' };
    const gridTemplate = (props) => {
        console.log('props')
        console.log(props.logo)
        return (
            <div className='image'>
                <Image
                    src={`/static/imgs/${props.logo}`}
                    width={80}
                    height={24}
                />
            </div>);
    };

    const handleFetchUser = async () => {

        try {
            const resp = await axios.post('/api/admin/markes/markes', { action: 'findAll' })
            console.log(resp.data.markes.name)
            setData(resp.data.markes)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchUser();
    }, [refreshData])

    let grid;
    const rowSelected = () => {
        if (grid) {
            const selectedrowindex = grid.getSelectedRowIndexes();
            const selectedrecords = grid.getSelectedRecords();
            console.log(selectedrecords)
            // alert(selectedrowindex + " : " + JSON.stringify(selectedrecords));
        }
    };
    

    return (
        <>
            <Container p="0px" className="box">
                <h2 className="boxHeader">Χρήστες</h2>
                <Dialog setDataRefresh={setDataRefresh} />
                <GridComponent
                    dataSource={data}
                    selectionSettings={settings}
                    editSettings={editOptions}
                    allowPaging={true}
                    pageSettings={pageSettings}
                    loadingIndicator={loadingIndicator}
                    rowSelected={rowSelected}
                    ref={g => grid = g}
                >
                    <ColumnsDirective  >
                        <ColumnDirective type='checkbox' width='50'></ColumnDirective>
                        <ColumnDirective field='name' headerText='Όνομα' width='100' ></ColumnDirective>
                        <ColumnDirective field='description' headerText='Περιγραφή' width='100'  ></ColumnDirective>
                        <ColumnDirective field='logo' headerText='Περιγραφή' width='100' template={gridTemplate}></ColumnDirective>
                        <ColumnDirective field='photosPromoList' headerText='Video' width='100'></ColumnDirective>
                        <ColumnDirective field='pimAccess.pimUrl' headerText='pimAccess' width='100'></ColumnDirective>
                    </ColumnsDirective>
                    {/* <Inject services={[Page, Edit, Toolbar]} /> */}
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



