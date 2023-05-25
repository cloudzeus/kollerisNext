import AdminLayout from 'src/layouts/Admin/AdminLayout';
import React, { useRef, useEffect } from 'react';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { SpreadsheetComponent, SheetsDirective, SheetDirective, RangesDirective } from '@syncfusion/ej2-react-spreadsheet';
import { RangeDirective, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-spreadsheet';

const Page2 = () => {
  const beforeOpen = () => {};
  const spreadsheetRef = useRef(null);


  useEffect(() => {
    let spreadsheet = spreadsheetRef.current;
    console.log(spreadsheet)
    
}, []);
const onActionBegin = (pasteArgs) => {
    console.log('action begin') 
    console.log(pasteArgs)
};

  const handleSavetoDatabase = async () => {
    let spreadsheet = spreadsheetRef.current;
    let json = await spreadsheet.saveAsJson();
    console.log(json)

  }
  return (
    <AdminLayout>
       <div> 
            <button onClick={handleSavetoDatabase}>Save to database</button>
          </div>
      <SpreadsheetComponent  
      ref={spreadsheetRef} 
      actionBegin={onActionBegin}
      allowOpen={true} 
      openUrl='https://services.syncfusion.com/react/production/api/spreadsheet/open'
      saveUrl='https://services.syncfusion.com/react/production/api/spreadsheet/save'
      Open={beforeOpen} 
      allowSave={true}
      />
    </AdminLayout>
  )
}

export default Page2