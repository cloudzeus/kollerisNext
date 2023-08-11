import React from 'react'
import DeletePopup from '@/components/deletePopup';
import { Button } from 'primereact/button';
import styled from 'styled-components';


const GridActions = ({ rowData, onEdit, onDelete }) => {
    return (
        <ActionDiv>
            <Button disabled={!rowData.status} style={{ width: '35px', height: '35px' }} icon="pi pi-pencil" onClick={() => onEdit(rowData)} />
            <DeletePopup onDelete={() => onDelete(rowData._id)} status={rowData.status} />
        </ActionDiv>
    )
}

export default GridActions


const ActionDiv = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    button {
        box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
        margin-left: 2px;
        margin-right: 2px;
       
    }

    span {
        font-size: 12px;
    }


`