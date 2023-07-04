
import { Avatar } from 'primereact/avatar';
import { TemplateContainer } from "@/componentsStyles/grid";

const GridIconTemplate = ({value, icon, color, backgroundColor }) => {

    return (
        <TemplateContainer>
            <Avatar icon={"pi " + icon} style={{backgroundColor: backgroundColor,  color: color }} shape="circle" />
            <span className="value">{value}</span>
        </TemplateContainer>

    )
}





export default GridIconTemplate;