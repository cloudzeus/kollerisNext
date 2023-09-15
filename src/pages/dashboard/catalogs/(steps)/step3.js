import React, { useEffect} from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { useSelector, useDispatch } from 'react-redux';
import {  setCurrentPage } from '@/features/catalogSlice';


const Step3 = () => {
    const { selectedHeaders, gridData,selectedMongoKey, currentPage  } = useSelector((state) => state.catalog)
    const dispatch = useDispatch();
    useEffect(() => {
 
        if(currentPage !== 3) return;
        const keysToCheck = selectedHeaders
     
        const filteredData = gridData.map(dataObj => {
            let newObj = {};
            keysToCheck.forEach(item => {
                if (dataObj[`${item.key}`]) {
                    newObj[`${item.related}`] = dataObj[`${item.key}`];
                }
            });
            return newObj;
        });

        console.log('filtered data')
        console.log(filteredData)
    }, [])

 
  return (
        <div>
                <DataTable
                showGridlines
                stripedRows
                    paginator rows={100} rowsPerPageOptions={[20, 50, 100, 200]}
                    value={gridData}
                    tableStyle={{ minWidth: '50rem' }}>
                        {
                            selectedHeaders.map((header, index) => {
                                return (
                                    <Column  header={header.value} field={header.key}/>
                                )
                            })
                        }
                </DataTable>
                <div>
                    <Button label="back" icon="pi pi-arrow-left" onClick={() => dispatch(setCurrentPage(2))} />
                </div>
        </div>
  )
}

export default Step3