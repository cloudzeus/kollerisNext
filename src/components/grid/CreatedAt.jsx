const CreatedAt = ({ createdAt }) => {
    const date = createdAt.split('T')[0];
    const time = createdAt.split('T')[1].split('.')[0];
    const newtime = time.slice(0, 5)
    return (
        <div className='flex align-items-center'>
            <i className="pi pi-calendar mr-2 text-primary" style={{ fontSize: '13px' }}></i>
            <div>
                <span className="font-medium mr-2">{date}</span>
                <span>{newtime}</span>
            </div>
        </div>
    )
}

export default CreatedAt;
