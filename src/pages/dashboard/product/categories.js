import AdminLayout from "@/layouts/Admin/AdminLayout";
import React from 'react'
import GridTable from "@/components/Grids/GridMarkes";
import CategoriesTreeGrid from "@/components/Grids/GridCategories";
const Categories = () => {
  return (
    <AdminLayout>
        <CategoriesTreeGrid  />
    </AdminLayout>
  )
}

export default Categories;