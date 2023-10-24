import { Button } from 'primereact/button';
import React from 'react';
import * as XLSX from 'xlsx';

function XLSXDownloadButton({data}) {
    console.log('sefsefefssefjs;slejfj')
    console.log(data)
    const handleDownload = () => {
        // flatten object like this {id: 1, title:'', category: ''};
    
      
        // create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, "data");
        XLSX.writeFile(workbook, "data.xlsx", { compression: true });
      };
      return (
        <div >
            <Button  label="Download XLSX" severity="success" icon="pi pi-download" onClick={handleDownload} />
        </div>
      )
  };

  

export default XLSXDownloadButton;