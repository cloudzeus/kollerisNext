import React from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import {  useSelector } from 'react-redux';
import StepCalcPrice from './(steps)/stepCalculatePrice';
import StepsSelectKeys from './(steps)/stepSelectKeys';
import UploadProducts from './(steps)/uploadProducts';
import StepCorrelateProducts from './(steps)/stepCorrelateProducts';
import StepshowData from './(steps)/stepShowData';


const PageContainer = () => {
    const { currentPage} = useSelector((state) => state.catalog)

    return (
        <AdminLayout>  
            {currentPage == 1 ? (
                <UploadProducts />
            ) : null}
            {currentPage == 2 ? (
                <StepCalcPrice /> 
            ): null}
          
            {currentPage == 3 ? (
                <StepsSelectKeys /> 
            ): null}
            {currentPage == 4 ? (
                <StepCorrelateProducts /> 
            ): null}
           
            {currentPage == 5 ? (
                <StepshowData/> 
            ): null}
           
        </AdminLayout>
    )
}

export default PageContainer;