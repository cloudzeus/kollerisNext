import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';
import styled from 'styled-components';
import StepHeader from '@/components/StepHeader';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';


const UploadCatalog = () => {
    const [loading, setLoading] = useState(false);
    const [gridData, setGridData] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);
    const [headers, setHeaders] = useState(null);
    const fileInputRef = useRef(null);
    const [fileLoading, setFileLoading] = useState(false)



    const handleFileUpload = async (e) => {
        setFileLoading(true)
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            setGridData(parsedData.slice(0, 20));

            if (parsedData.length > 0) {
                const firstRow = parsedData[0];
                const headers = Object.keys(firstRow).map((key) => ({
                    field: key,
                    header: key,
                }));

                setHeaders(headers);
            }
        };
        setFileLoading(false)
    };

    const onSelectionChange = (e) => {
        setSelectedKey(e.value);
    };



    const Start = () => {
        return (
            <p>Πίνακας</p>
        )
    }
    const End = () => {
        return (
            <i className='pi pi-angle-down cursor' style={{ margin: '4px 4px 0 0' }}></i>
        )
    }

    return (
        <>
            <StepHeader text="Ανεβάστε Αρχείο" />
            <UploadBtn>
                <input className="hide" ref={fileInputRef} type="file" onChange={handleFileUpload} />
                <Button loading={fileLoading} onClick={() => fileInputRef.current.click()} label="Ανέβασμα αρχείου" icon="pi pi-plus"></Button>
            </UploadBtn>
            {headers ? (
                <div>
                      <Toolbar start={Start} end={End} />
            <DataTable
                loading={loading}
                selectionMode="radiobutton"
                selection={selectedKey}
                onSelectionChange={onSelectionChange}
                paginator
                rows={10}
                rowsPerPageOptions={[20, 50, 100, 200]}
                value={gridData}
                tableStyle={{ minWidth: '50rem' }}
            >
                {headers.map((header) => (
                    <Column key={header.field} field={header.field} header={header.header} />
                ))}
            </DataTable>
            <div className='flex'>
            <ChooseKey headers={headers} selectedKey={selectedKey} setSelectedKey={setSelectedKey}/>
            </div>
           
            <div>
                <Button
                    severity="success"
                    label="STEP 2"
                    disabled={selectedKey === null}
                    icon="pi pi-arrow-right"
                    className="mb-2 mt-3 bg-success"
                    onClick={() => {
                        // Your navigation logic here
                    }}
                />
            </div>
                </div>
            ) : null}
          
        </>
    );
};





const ChooseKey = ({headers, selectedKey, setSelectedKey}) => {
    return (
        <Dropdown value={selectedKey} onChange={(e) => setSelectedKey(e.value)} options={headers} optionLabel="field" placeholder="Επιλογή Τιμής Κόστους" 
            filter  className="w-full md:w-14rem" />
    )
}

const UploadBtn = styled.div`
  .hide {
    display: none;
  }
  display: inline-block;
`;

export default UploadCatalog;