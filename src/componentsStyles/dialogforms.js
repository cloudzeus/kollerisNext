import styled from "styled-components";

const FormTitle = styled.h2`
    font-size: 1.2rem;
    margin-bottom: 15px;
    margin-top: 20px;
    position: relative;
    &:after {
        content: '';
        display: block;
        width: 20px;
        height: 3px;
        border-radius: 30px;
        position: absolute;
        left: 0;
        bottom: -7px;
        background-color: ${props => props.theme.palette.primary.main};
    }
`

export {
    FormTitle
}