import styled from "styled-components";
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
const RegisterUserActions = ({ actionFrom, at, backgroundColor, color }) => {
    return (
        <>
            {actionFrom ? (
                <div>
                    <Container>
                        <Avatar icon={"pi pi-user"}  style={{ backgroundColor: backgroundColor, color: color, width: '25px', height: '25px' }} shape="circle" />
                        <div className="right-div">
                            <span className="value">{actionFrom}</span>
                            <span className="dateAt">{at.split('T')[0]}</span>
                        </div>
                    </Container>

                </div>
            ) : null}
        </>
    )
}


const Container = styled.div`
    display: flex;
    align-items: center;
 
    .right-div {
        margin-left: 5px;
        display: flex;
        flex-direction: column;

    }
    .value {
        font-size: 14px;
    }

    .dateAt {
        font-size: 10px;
        font-style: italic;
    }

    .p-avatar-icon {
        font-size: 12px;
    }
`

export default RegisterUserActions;