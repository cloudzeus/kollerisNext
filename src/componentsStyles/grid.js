import styled from "styled-components";


const DropDownDetails = styled.div`
    .tab-div {
        margin-bottom: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .tab-title {
        font-size: 1rem;
        margin-bottom: 2px;
        font-weight: 600;
        display: block;
    }
    .tab-details {
    }

    .tab-url {
        font-weight: 600;
        color: ${props => props.theme.palette.primary.main};
    }
`



const ActionDiv = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    button {
        box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
        margin-left: 2px;
        margin-right: 2px;
    }


`

const  DisabledDisplay  = styled.div`
    .disabled-card{
        margin-bottom: 10px;
        display: flex;
        width: 100%;
        flex-direction: column;
        & label {
            margin-bottom: 5px;
        }
    }

`

const SyncButtonContainer = styled.div`
    position: relative;
`
const  SubGridStyles = styled.div`
    padding: 20px;
    /* padding-top: 20px;
    padding-bottom: 20px; */
    .subgrid-title {
        display: block;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 8px;
        margin-left: 2px;
    }
    .data-table {
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 3px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
    }

`


const TemplateContainer = styled.div`
    display: flex;
    align-items: center;
    
    span.value {
        margin-left: 10px;
    }
    .p-avatar .p-avatar-icon {
        font-size: 12px;
    }

`

export {
    DropDownDetails,
    ActionDiv,
    DisabledDisplay ,
    SyncButtonContainer,
    SubGridStyles,
    TemplateContainer
};
