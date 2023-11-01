import { Button } from 'primereact/button';
import React from 'react';
import * as XLSX from 'xlsx';

function XLSXDownloadButton({data, fileName, disabled}) {

    const handleDownload = () => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        console.log(worksheet)
        XLSX.utils.book_append_sheet(workbook, worksheet, "data");
        const date = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(workbook, `${fileName}.${date}.xlsx` , { compression: true });
      };
    
      return (
        <div >
            <Button  disabled={disabled} className='w-full' label=".xlsx" severity="success" icon="pi pi-download" onClick={handleDownload} />
        </div>
      )
  };

  

export default XLSXDownloadButton;