import styled from "styled-components";
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
const GridIconTemplate = ({value, icon, color, backgroundColor }) => {

    return (
        <TemplateContainer>
            <Avatar icon={"pi " + icon} style={{backgroundColor: backgroundColor,  color: color }} shape="circle" />
            <span className="value">{value}</span>
        </TemplateContainer>

    )
}

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



export default GridIconTemplate;