import styled from "styled-components";

const SoftoneStatusTemplate = ({ softoneStatus }) => {

    if(softoneStatus == 'undefined') {
        return null
    }

    if(softoneStatus == true) {
        return (
            <StatusDiv>
               <i className="pi pi-check" style={{ color: 'green' }}></i>
                <span>In Softone </span>
            </StatusDiv>
        )
    }
    if(softoneStatus == false) {
        return (
            <StatusDiv>
               <i className="pi pi-times" style={{ color: 'red' }}></i>
                <span>Not In Softone </span>
            </StatusDiv>
        )
    }
   
}

const StatusDiv = styled.div`
    display: flex;
i {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        font-size: 10px;
        border: 2px solid ${props => props.color};
        display: flex;
        font-weight: bold;
        align-items: center;
        justify-content: center;
        color: ${props => props.color};
        margin-right: 8px;
    }
`

const Container = styled.div`
   
    

    

    span {
        display: inline-block;
        margin-left: 8px;
    }
   
   
`

export default SoftoneStatusTemplate;