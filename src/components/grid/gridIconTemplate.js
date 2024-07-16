
import { Avatar } from 'primereact/avatar';

const GridIconTemplate = ({value, icon, color, backgroundColor }) => {

    return (
           <>
             <Avatar 
                className='mr-2'
              icon={"pi " + icon} 
              style={{backgroundColor: backgroundColor,  color: color }} shape="circle" />
             <span className="value">{value}</span>
           </>

    )
}


export default GridIconTemplate;