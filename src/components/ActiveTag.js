import styled from "styled-components";


const ActiveTag = ({isActive}) => {
    return (
        <StyledDiv isActive={isActive} >
            <p>{isActive ? 'ΕΝΕΡΓΟ' : 'ανενεργό'}</p>
        </StyledDiv>
    )
}



const StyledDiv = styled.div`
    background-color: ${props => props.isActive ? '#13ec1d' : 'red'};
    padding: 3px;
    border-radius: 30px;
    width: 60px;
    font-size: 12px;
    text-align: center;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
   
    p {
        color: white;
        font-weight: 300;
        font-size: 10px;
        letter-spacing: 0.9px;
        color: ${props => props.isActive ? '#188709': 'white'};
    }

`

export default ActiveTag;