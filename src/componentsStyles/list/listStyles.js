import styled from "styled-components";

const ListContainer = styled.div`
    
        border: 1px solid ${props => props.theme.palette.border};
        /* display: flex;
        align-items: center;
        justify-content: space-between; */
        padding: 20px;
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
        font-size: 14px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        span:nth-child(1) {
            font-weight: 600;
        }
        span:nth-child(2) {
            margin-left: 10px;
        }
    }
`

const ExpandableItems = styled.div`
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
    .inner-items-container {
        padding: 20px;
        border: 1px solid ${props => props.theme.palette.border};
        border-radius: 5px;
    }
    .inner-items {
        border: 1px solid ${props => props.theme.palette.border};
        padding: 20px;
        margin-bottom: 10px;
    }
    

`


export {
    ListContainer,
    ExpandableItems,
}