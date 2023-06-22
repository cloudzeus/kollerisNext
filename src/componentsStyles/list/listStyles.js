import styled from "styled-components";




const ListContainer = styled.div`
        background-color: white;
        border: 1px solid ${props => props.theme.palette.border};
        border-radius: 5px;
        margin-bottom: 10px;
        position: relative;
        box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);
        -webkit-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);
        -moz-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);

    &:hover {
        box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.07);
        -webkit-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.07);
        -moz-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.07);
    }


    .list-header-div {
        cursor: pointer;
        font-size: 14px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        position: relative;
        span:nth-child(1) {
            font-weight: 600;
        }
        span:nth-child(2) {
            margin-left: 10px;
        }
    }
    
    .list-header-div-left {
        display: flex;
        width: 100%;
        align-items: center;
        padding: 10px;
        align-items: center;
        justify-content: space-between;
        border-right: 1px solid ${props => props.theme.palette.border};
    }
    .list-header-div-rigth {
        padding: 10px;
    }
    
`

const ExpandableItems = styled.div`
padding: 20px;
 background-color: white;
 border-top: 2px solid ${props => props.theme.palette.background};
    .divider {
        width: 100%;
        height: 1px;
        background-color: ${props => props.theme.palette.border};
        margin: 20px 0;

    }
    .image-div {
        width: 70px;
        height: 50px;
        background-color: red;
        position: relative;

    }
    
    

`

const NestedListA = styled.div`
    margin-left: 40px;
    .inner-items {
        background-color: white;
        border: 1px solid ${props => props.theme.palette.border};
        margin: 10px 0px;
        border-radius: 5px;
        box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.02);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .inner-items-header {
        padding: 20px;
    }
    .inner-items-expand {
        padding: 30px;
        border-top: 1px solid ${props => props.theme.palette.border};
    }
    .inner-items-btn-container {
        display: grid;
        width: 80px;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 10px;
    }
    .inner-items-btn-container button {
        width: 35px;
        height: 35px;
        border: 1px solid ${props => props.theme.palette.border};
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border-radius: 4px;
        box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.02);
    }

    .inner-items-btn-container svg {
        color: #9a9a97;
        font-size: 20px;
    }
    
`
export {
    ListContainer,
    ExpandableItems,
    NestedListA
}