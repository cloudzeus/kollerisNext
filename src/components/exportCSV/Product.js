import { Button } from 'primereact/button';
import React from 'react';
import * as XLSX from 'xlsx';

function XLSXDownloadButton({products}) {
    const handleDownload = () => {
        const rows = products.map((product) => ({
            NAME: product.NAME,
            CATEGORY: product.CATEGORY_NAME,
            GROUP: product.GROUP_NAME,
            SUBGROUP: product.SUBGROUP_NAME,
            AVAILABLE: product?.availability?.DIATHESIMA,
            BRAND: product.BRAND_NAME,
            EANCODE: product.CODE,
            PRICE: product.PRICER,


        }));
    
        // create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rows);
    
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    
        // // customize header names
        // XLSX.utils.sheet_add_aoa(worksheet, [
        //   ["Product ID", "Product Name", "Product Category"],
        // ]);
    
        XLSX.writeFile(workbook, "products.xlsx", { compression: true });
      };
      return (
        <div >
            <Button disabled={!products?.length} label="Download XLSX" severity="success" icon="pi pi-download" onClick={handleDownload} />
        </div>
      )
  };

  

export default XLSXDownloadButton;