import { Avatar } from 'primereact/avatar';

const RegisterUserActions = ({ 
    actionFrom, 
    backgroundColor, 
    color 
}) => {
 
    return (
                <>
            {actionFrom ? (
                    <div className="user-actions-wrapper">
                        <Avatar 
                            icon={"pi pi-user"}  
                            className="avatar-icon"
                            style={{ 
                                backgroundColor: backgroundColor, 
                                color: color
                            }} 
                            shape="circle" 
                        />
                        <div className="user-info">
                            <span className="user-name">{actionFrom}</span>
                        </div>
                    </div>
            ) : null}
        </>
    )
}
export default RegisterUserActions;