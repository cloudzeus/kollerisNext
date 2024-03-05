
import { useRef } from 'react';
import { Avatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import styled from 'styled-components';
const GridOverlay = ({ children, title, }) => {
    const op = useRef(null);
    const [value, setValue] = useState(null);

    return (
        <Container onClick={(e) => op.current.toggle(e)} >
            <i className="pi pi-info-circle "></i>
            <div className='right-div'>
                <span className="value">{title}</span>
                <i className="pi pi-angle-down"></i>
            </div>
            <OverlayPanel className='shadow-5 ' ref={op}>
                {children}
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

export default GridOverlay;