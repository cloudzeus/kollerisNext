import React from 'react';
import { Chip } from 'primereact/chip';
import styled from 'styled-components';
export default function UserRoleChip(data) {



    const contentTemplate = () => {
        switch (data) {
            case 'admin':
                return (
                    <StyledChip color='#6366F1'>
                        <span className="first">A</span>
                        <span className="second">Admin</span>
                    </StyledChip>
                )
            case 'employee':
                return (
                    <StyledChip color='#38c74c'>
                        <span className="first">E</span>
                        <span className="second">Employee</span>
                    </StyledChip>
                )
            case 'manager':
                return (
                    <StyledChip color='#48aab7'>
                    <span className="first">M</span>
                    <span className="second">Manager</span>
                </StyledChip>
                )
            case 'user':
                return (
                    <StyledChip color={'#e89917'}>
                    <span className="first">U</span>
                    <span className="second">User</span>
                </StyledChip>
                )
        }
    }
  

    return (
        <div >
                {contentTemplate()}
        </div>
    );
}


const StyledChip = styled.span`
    display: inline-flex;
    align-items: center;
    background-color:#e7e7e7 ;
    border-radius: 30px;
    width: 90px;
    padding: 4px;
    .first {
        background-color: ${props => props.color ? props.color : '#e7e7e7'};
        border-radius: 50%;
        color: white;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
    }
    .second {
        display: inline-block;
        margin-left: 5px;
        font-size: 13px;
        
    }
`