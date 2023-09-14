import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import { Button } from 'primereact/button'
const Step3 = ({selectedHeaders, currentPage, setCurrentPage, data}) => {
    console.log('data')
    console.log(data)
    console.log('selectedHeaders')
    console.log(selectedHeaders)
  return (
        <div>
                <DataTable
                    paginator rows={100} rowsPerPageOptions={[20, 50, 100, 200]}
                    value={data}
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
                    <Button label="back" icon="pi pi-arrow-left" onClick={() => setCurrentPage(2)} />
                </div>
        </div>
  )
}

export default Step3