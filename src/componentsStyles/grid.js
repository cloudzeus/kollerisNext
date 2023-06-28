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

const ImageDiv = styled.div`
    width: 55px;
    height: 40px;
    padding: 10px;
    /* border-radius: 50%; */
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
   
    img {
        object-fit: contain;
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

export {
    DropDownDetails,
    ImageDiv, 
    ActionDiv,
    DisabledDisplay ,
};
