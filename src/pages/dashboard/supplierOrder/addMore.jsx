'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { setSelectedProducts, setSearchTerm, } from '@/features/supplierOrderSlice';
import StepHeader from '@/components/StepHeader';
import { useRouter } from 'next/router';
import { setTotalProductsPrice, setMtrLines, updateMtrlines } from '@/features/supplierOrderSlice';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { CategoriesRowFilterTemplate, GroupRowFilterTemplate, SubGroupsRowFilterTemplate } from '@/components/grid/Product/GridConfig';
import { setLazyState } from '@/features/productsSlice';

const ChooseProducts = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { category, group, subgroup, lazyState, loading } = useSelector(state => state.products)
  const { selectedProducts, selectedMarkes, searchTerm, mtrLines, inputEmail, selectedSupplier } = useSelector(state => state.supplierOrder)
  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([])


  // useEffect(() => {

  //   if (!selectedMarkes) {
  //     router.push('/dashboard/product/brands')
  //   }
  // }, [])




  const fetch = async () => {
    try {
      let res = await axios.post('/api/product/apiProductFilters', {
        action: 'filterCategories2',
        searchTerm: searchTerm,
        skip: lazyState.first,
        limit: lazyState.rows,
        categoryID: category?.softOne.MTRCATEGORY,
        groupID: group?.softOne.MTRGROUP,
        subgroupID: subgroup?.softOne.cccSubgroup2,
        mtrmark: selectedMarkes?.mtrmark,
      },
      )
      console.log(data.result)
      setData(res.data.result);
      setTotalRecords(prev => {
        if (prev === res.data.totalRecords) {
          return prev;
        } else {
          return res.data.totalRecords
        }
      })
    } catch (e) {
      console.log(e)
    }

  }
  useEffect(() => {
    fetch();
  }, [selectedMarkes, lazyState.rows, lazyState.first, searchTerm, category, group, subgroup])

  useEffect(() => {
    dispatch(setLazyState({ ...lazyState, first: 0 }))

  }, [selectedMarkes])

  const onSelectionChange = (e) => {
    dispatch(setSelectedProducts(e.value))
    dispatch(setMtrLines(e.value))
  }

  const onPage = (event) => {
    dispatch(setLazyState({ ...lazyState, first: event.first, rows: event.rows }))
  };



  const Search = () => {
    return (
      <>
        <div className="flex justify-content-start w-20rem ">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search " />
            <InputText value={searchTerm} placeholder='Αναζήτηση Προϊόντος' onChange={(e) => dispatch(setSearchTerm(e.target.value))} />
          </span>
        </div>
      </>
    )
  }

  const handleFinalSubmit = async () => {
    let { data } = await axios.post('/api/createOrder', {
      action: 'updateBucket',
      products: mtrLines,
      MTRMARK: selectedMarkes.mtrmark,
    })
    dispatch(setSelectedProducts([]))
    router.push('/dashboard/supplierOrder/summary')
  }
  return (
    <AdminLayout>
      <StepHeader text="Προσθήκη Προϊόντων στο bucket" />
      <DataTable
        value={data}
        paginator
        loading={loading}
        rows={lazyState.rows}
        rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
        first={lazyState.first}
        lazy
        totalRecords={totalRecords}
        onPage={onPage}
        selectionMode={'checkbox'}
        selection={selectedProducts}
        onSelectionChange={onSelectionChange}
        className='border-1 border-round-sm	border-50 mt-4'
        size="small"
        filterDisplay="row"
        id={'_id'}

      >
        <Column selectionMode="multiple" headerStyle={{ width: '30px' }}></Column>
        <Column field="brandName" header="Όνομα Μάρκας"></Column>
        <Column field="NAME" filter showFilterMenu={false} filterElement={Search} header="Προϊόν"></Column>
        <Column field="CATEGORY_NAME" header="Εμπορική Κατηγορία" filter filterElement={CategoriesRowFilterTemplate} showFilterMenu={false}></Column>
        <Column field="GROUP_NAME" showFilterMenu={false} filter filterElement={GroupRowFilterTemplate} header="Ομάδα" ></Column>
        <Column field="SUBGROUP_NAME" header="Υποομάδα" filter showFilterMenu={false}   filterElement={SubGroupsRowFilterTemplate}></Column>

      </DataTable>
      <div className='mt-3'>
        <Button severity='success' icon="pi pi-arrow-left" onClick={() => router.back()} />
        <Button className='ml-2' icon="pi pi-arrow-right" severity='success' onClick={handleFinalSubmit} />

      </div>

    </AdminLayout>
  )
}





export default ChooseProducts;