import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown';


const OurDatabaseKeys = [
    {
        key: 'name',
        value: 'Όνομα'
    },
    {
        key: 'description',
        value: 'Περιγραφή'
    },
    {
        key: 'description',
        value: 'Περιγραφή'
    },
    {
        key: 'description',
        value: 'Περιγραφή'
    },
    
]

const Step2 = ({selectedHeaders, currentPage, setCurrentPage}) => {
   
  return (  
        <div>
                <DataTable
                    paginator rows={100} rowsPerPageOptions={[20, 50, 100, 200]}
                    value={selectedHeaders}
                    tableStyle={{ minWidth: '50rem' }}>
                        <Column  header="Headers" field="value" body={({value}) => <Template value={value} />} />
                </DataTable>
                <div>
                    <Button label="back" icon="pi pi-arrow-left" onClick={() => setCurrentPage(1)} />
                    <Button label="next" icon="pi pi-arrow-right" onClick={() => setCurrentPage(3)} />
                </div>
        </div>
  )
}

const Template = ({value}) => {
    return (
        <div className='flex justify-content-between'>
            <p>{value}</p>
            <div className="card flex justify-content-center">
            <Dropdown value={'key'} onChange={(e) => setSelectedCity(e.value)} options={OurDatabaseKeys} optionLabel="value" 
                placeholder="Select a City" className="w-full md:w-14rem" />
        </div>

        </div>
    )
}

export default Step2