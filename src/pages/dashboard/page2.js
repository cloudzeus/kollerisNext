import AdminLayout from 'src/layouts/Admin/AdminLayout';
import React, { useRef, useEffect } from 'react';
import { SpreadsheetComponent, SheetsDirective, SheetDirective, RangesDirective } from '@syncfusion/ej2-react-spreadsheet';
import styled from 'styled-components';
import Button from '@/components/Buttons/Button';

const Page2 = () => {
	const beforeOpen = () => { };
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
			
			<div >
				<Button2
					className="boxShadow"
					onClick={handleSavetoDatabase}>Save to database</Button2>
			</div>
			<div className="box">
			<h2 className="boxHeader">SpreadSheet</h2>
				<SpreadsheetComponent
					ref={spreadsheetRef}
					actionBegin={onActionBegin}
					allowOpen={true}
					openUrl='https://services.syncfusion.com/react/production/api/spreadsheet/open'
					saveUrl='https://services.syncfusion.com/react/production/api/spreadsheet/save'
					Open={beforeOpen}
					allowSave={true}
				/>
				<Button mt="40">Load</Button>
			</div>

		</AdminLayout>
	)
}

const Container = styled.div`

`

const Button2 = styled.button`
  background-color: #FAFAFA;
  border: none;
  outline: none;
  padding: 10px 20px;
  border-radius: 4px;
  margin-bottom: 10px;
`

export default Page2