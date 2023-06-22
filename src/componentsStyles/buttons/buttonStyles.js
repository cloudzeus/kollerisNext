import styled from "styled-components"

const NavigateArrowButton = styled.button`
    background-color: ${props => props.theme.palette.primary.light};
    border: none;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 1px 4px 1px rgba(0,0,0,0.08);
    svg {
        /* margin-right: 2px; */
        font-size: 16px;
        
    }
    span {
        margin-left: 2px;
    }
    
`


export {
    NavigateArrowButton,
}