import format from "date-fns/format";
import el from "date-fns/locale/el";


const CreatedAt = ({ createdAt }) => {
    if(!createdAt) return;
    const currentDate = new Date(createdAt);
    const formattedDate = format(currentDate, 'dd-MM-yyyy HH:mm:ss', { locale: el });
    return (
        <div className='flex align-items-center'>
        <i className="pi pi-calendar mr-2 text-primary" style={{ fontSize: '13px' }}></i>
        <div>
            <span className="font-medium mr-2">{formattedDate}</span>
        </div>
    </div>
    )
}

export default CreatedAt;
