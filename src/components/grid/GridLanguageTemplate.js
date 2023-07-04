
import { useRef } from 'react';
import { Avatar } from 'primereact/avatar';
import { TemplateContainer } from "@/componentsStyles/grid";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import styled from 'styled-components';
const GridLanguageTemplate = ({ localized }) => {
    const op = useRef(null);
    const [value, setValue] = useState(null);


    return (
        <Container  onClick={(e) => op.current.toggle(e)} >
             <Avatar icon={"pi pi-language"} shape="circle" />
            <div className='right-div'>
                <span className="value">Γλώσσες</span>
                <i className="pi pi-angle-down"></i>
            </div>
            {/* <Button type="button" icon="pi pi-image" label="Image" onClick={(e) => op.current.toggle(e)} /> */}
            <OverlayPanel ref={op}>
                <DataTable
                    value={localized}
                    scrollable
                    showGridlines
                    dataKey="_id"
                >
                    <Column field="locale" header="Locale" ></Column>
                    <Column field="name" header="Name" ></Column>
                </DataTable>
            </OverlayPanel>
        </Container >
    )

}

const Container = styled.div`
    display: flex;
    /* background-color: #e6e6e6; */
    align-items: center;
    border-radius: 30px;
    padding: 4px;
    cursor: pointer;

    i {
        margin-left: 5px;
        margin-top: 3px;
    }
    .right-div {
        display: flex;
        align-items: center;
        margin-left: 8px;
    }
`

export default GridLanguageTemplate;