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
    
    .list-bottom-actions-div {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid ${props => props.theme.palette.border};
    }
    .list-bottom-actions-div_actions {
           
            button {
                margin-left: 10px;
                border: none;
                padding: 5px;
                border-radius: 4px;
                box-shadow: rgba(0, 0, 0, 0.13) 1.90px 1.90px 2.6px;
                width: 35px;
                height: 35px;
               
               
            }
            svg {
                font-size: 18px;
            }
    }
`


export {
    ListContainer,
    ExpandableItems,
   
}