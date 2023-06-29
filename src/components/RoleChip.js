import React from 'react';
import { Chip } from 'primereact/chip';
import styled from 'styled-components';
export default function UserRoleChip(data) {



    const contentTemplate = () => {
        switch (data) {
            case 'admin':
                return (
                    <StyledChip>
                        <span className="first">A</span>
                        <span className="second">Admin</span>
                    </StyledChip>
                )
            case 'employee':
                return (
                    <StyledChip>
                        <span className="first">E</span>
                        <span className="second">Employee</span>
                    </StyledChip>
                )
            case 'manager':
                return (
                    <StyledChip>
                    <span className="first">M</span>
                    <span className="second">Manager</span>
                </StyledChip>
                )
            case 'user':
                return (
                    <StyledChip color={''}>
                    <span className="first">U</span>
                    <span className="second">User</span>
                </StyledChip>
                )
        }
    }
  

    return (
        <div >
            <StyledChip>
                {contentTemplate()}
            </StyledChip>
        </div>
    );
}


const StyledChip = styled.span`
    display: inline-flex;
    align-items: center;
    background-color:#e7e7e7 ;
    border-radius: 30px;
    width: 90px;
    padding: 2px;
    .first {
        background-color: var(--primary-color);
        border-radius: 50%;
        color: white;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .second {
        display: inline-block;
        margin-left: 5px;
        font-size: 14px;
    }
`