import { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter} from '@syncfusion/ej2-react-grids';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useDispatch } from 'react-redux';
import { DataManager, WebApiAdaptor,  RemoteSaveAdaptor  } from '@syncfusion/ej2-data';


function DialogEdit() {
    return (
        <AdminLayout>
            <GridTable />
        </AdminLayout>
    );
}

const GridTable = () => {
    const [data, setData] = useState([])
    const [hide, show] = useState(false);



    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    const editparams = { params: { popupHeight: '300px' } };
    const validationRules = { required: true };
    const orderidRules = { required: true, number: true };
    const pageSettings = { pageCount: 5 };
    let grid;


    const handleAdd = async (user) => {
        const resp = await axios.post('/api/admin/users', { action: 'add', ...user })
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

    const dataSource = new DataManager({
        adaptor: new RemoteSaveAdaptor,
        insertUrl: '/Home/Insert',
        json: data,
        removeUrl: '/Home/Delete',
        updateUrl: '/Home/Update'
    });
    
    const actionBegin = (args) => {
        //Function to hide/show columns:
        // console.log(args)

        let hideShowCol = (colName, boolean) => {
            let cols = grid.columns;
            for (const col of cols) {

                if (col.field === colName) {
                    col.visible = boolean;
                }
            }
        }
      

        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            hideShowCol('_id', false)
        }
        if ((args.requestType === 'add')) {
            hideShowCol('password', true)

        }

      
    };

    const actionComplete = (args) => {
        if ((args.requestType === 'save')) {
            console.log('new user added')
            let saveUser =  handleAdd(args.data)
            if(saveUser) {
                console.log(args)
            }
           
        }
    }




    return (
        <div className='control-pane'>
            <div className='control-section'>
                <GridComponent
                    dataSource={data}
                    toolbar={toolbarOptions}
                    allowPaging={true}
                    editSettings={editSettings}
                    pageSettings={pageSettings}
                    actionBegin={actionBegin}
                    actionComplete={actionComplete}
                    ref={g => grid = g}
                >
                    <ColumnsDirective>
                        <ColumnDirective allowEditing={false} allowAdding={false} isPrimaryKey={true} field='_id' headerText='Id' width='150'></ColumnDirective>
                        <ColumnDirective field='firstName' headerText='Όνομα' width='100' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='lastName' headerText='Eπώνυμο' width='100' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='email' headerText='Email' width='180' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='password' headerText='Kωδικός' width='100' validationRules={validationRules} visible={false}></ColumnDirective>
                        <ColumnDirective field='role' headerText='Ρόλος' width='150' editType='dropdownedit' edit={editparams}></ColumnDirective>
                    </ColumnsDirective>
                    <Inject services={[Page, Edit, Toolbar, Filter]} />
                </GridComponent>
            </div>
        </div>

    )

}


export default DialogEdit;