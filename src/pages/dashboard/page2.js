import AdminLayout from 'src/layouts/Admin/AdminLayout';
import React, { useRef, useEffect } from 'react';
import {SpreadsheetComponent} from '@syncfusion/ej2-react-spreadsheet';
import styled from 'styled-components';
import Button from '@/components/Buttons/Button';

//Icons:
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useTheme } from 'styled-components';
const Page2 = () => {
	const beforeOpen = () => { };
	const spreadsheetRef = useRef(null);
	const theme = useTheme();



	useEffect(() => {
		let spreadsheet = spreadsheetRef.current;
		// console.log(spreadsheet)

	}, []);
	const onActionBegin = (pasteArgs) => {
		// console.log('action begin')
		// console.log(pasteArgs)
	};

	const handleSavetoDatabase = async () => {
		let spreadsheet = spreadsheetRef.current;
		let json = await spreadsheet.saveAsJson();
		// console.log(json)

	}
	return (
		<AdminLayout>

			<Container className="box">
				<h2 className="boxHeader">SpreadSheet</h2>
				<div className="icon-container">
					<IconBtn>
						<FolderOpenIcon style={{ fontSize: '18px', color: `${theme.palette.primary.main}` }} />
					</IconBtn>
					<IconBtn>
						<SaveAltIcon style={{ fontSize: '18px', color: `${theme.palette.primary.main}` }} />
					</IconBtn>

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
				<Button mt="20" size="140px">Eνημέρωση Βάσης</Button>
			</Container >
			<Container className="box">
				<h2 className="boxHeader">SpreadSheet</h2>
				<div className="icon-container">
					<IconBtn>
						<FolderOpenIcon style={{ fontSize: '18px', color: `${theme.palette.primary.main}` }} />
					</IconBtn>
					<IconBtn>
						<SaveAltIcon style={{ fontSize: '18px', color: `${theme.palette.primary.main}` }} />
					</IconBtn>

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
				<Button mt="20" size="140px">Eνημέρωση Βάσης</Button>
			</Container >
			<Container className="box">
				<h2 className="boxHeader">SpreadSheet</h2>
				<div className="icon-container">
					<IconBtn>
						<FolderOpenIcon style={{ fontSize: '18px', color: `${theme.palette.primary.main}` }} />
					</IconBtn>
					<IconBtn>
						<SaveAltIcon style={{ fontSize: '18px', color: `${theme.palette.primary.main}` }} />
					</IconBtn>

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
				<Button mt="20" size="140px">Eνημέρωση Βάσης</Button>
			</Container >

		</AdminLayout>
	)
}

const Container = styled.div`
	margin-bottom: 20px;
	.icon-container {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}
	

	
`

const IconBtn = styled.button`
	border: none;
	padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: ${props => props.theme.palette.primary.light};
		border-radius: 5px;
		color: white;
		font-size: 12px;
		margin-right: 10px;
		cursor: pointer;
		transition: transform 0.3s, background-color 0.3s;
		box-shadow: rgba(0, 0, 0, 0.10) 0px 1px 2px;
		&:active {
			transform: scale(0.8);
			background-color: ${props => props.theme.palette.primary.light50};
			border-radius: 8px;
		}
`




export default Page2