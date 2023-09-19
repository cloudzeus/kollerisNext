import React, { useEffect} from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { useSelector, useDispatch } from 'react-redux';
import {  setCurrentPage } from '@/features/catalogSlice';
import axios from 'axios';

const Step3 = () => {
    const { selectedHeaders, gridData, selectedMongoKey, currentPage, attributes, mongoKeys, prices } = useSelector((state) => state.catalog)
    const [newData, setNewData] = React.useState([])
    const dispatch = useDispatch();
    useEffect(() => {
 
        if(currentPage !== 3) return;
        const keysToCheck = mongoKeys;
        const keysToCheckAttributes = attributes;
        console.log(attributes)

        const filteredData = gridData.map(dataObj => {
            
            let newObj = {};
            keysToCheck.forEach(item => {
             
                if (dataObj[`${item.oldKey}`]) {
                    newObj[`${item.related}`] = dataObj[`${item.oldKey}`];
                }
            });
           
            keysToCheckAttributes.forEach(item => {
                
                if (dataObj[`${item.ogKey}`]) {
                    newObj.attribute = {
                        name: item.value,
                        value: dataObj[`${item.ogKey}`]
                    }
                   
                }
            })

            return newObj;

         
        });

        console.log(filteredData)
        setNewData(filteredData)
       
    }, [])

    const handleSubmit = async () => {
        console.log(newData)
        // let {data } = await axios.post('/api/product/apiProduct', {data: newData, action: 'importCSVProducts'})

    }
 
  return (
        <div>
                <DataTable
                    key={'index'}
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
                    <Button label="Πίσω" icon="pi pi-arrow-left" onClick={() => dispatch(setCurrentPage(3))} />
                    <Button label="Αποστολή" className='ml-2' onClick={handleSubmit} />
                </div>
        </div>
  )
}

export default Step3