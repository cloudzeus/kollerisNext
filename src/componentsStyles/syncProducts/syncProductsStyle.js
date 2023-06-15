import styled from 'styled-components';

const Section = styled.section`
    
    .border-div  {
        border-bottom: 2px solid ${props => props.theme.palette.background};
    }

    .top-div {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    .data-to-sync {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-column-gap: 10px;
    }
    
    .info-div {
        display: flex;
        align-items: center;
        justify-content: center;
        & p {
            font-weight: 600;
            margin-right: 10px;
        }
        & * {
            margin-right: 2px;
        }
    }

    .check-div {
        padding: 5px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid ${props => props.theme.palette.border};
        & svg {
            font-size: 18px;
            color: ${({ theme }) => theme.palette.primary.main};
        }
    }
    .formsContainer {
        border: 1px solid ${props => props.theme.palette.border};
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 10px;
        position: relative;
        box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);
        -webkit-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);
        -moz-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.04);
    }

    .formsContainer:hover {
        box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.05);
        -webkit-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.05);
        -moz-box-shadow: 1px 1px 6px 2px rgba(0,0,0,0.05);
    }

  

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 50px;
        grid-column-gap:  10px;
        box-shadow: rgba(99, 99, 99, 0.05) 0px 1px 5px 0px;
    }

    .synced {
        display: none;
    }
    .formsContainer h2 {
        font-size: 12px;
        letter-spacing: 0.2px;
  
    }

    .formsContainer span.input {
        font-size: 13px;
        align-items: center;
        border: 1px solid ${props => props.theme.palette.border};
        display: flex;
        align-items: center;
        padding-left: 20px;
        border-radius: 5px;
        color: grey;
    }
   
  
    .sync-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: ${props => props.theme.palette.primary.main};
        /* background-color:#e4ac1b; */
        border-radius: 5px;
        border: none;
        outline: none;
        width: auto;
        color: white;
        padding: 10px 2px;
        margin-left: 10px;
        
    }
    .sync-button svg {
        color: white;
        font-size: 20px;
    }
    .item-primary-key {
        margin-bottom: 10px;
        span {
            font-size: 11px;
          
        }
        span:nth-child(2) {
            font-weight: 600;
            margin-left: 5px;
        }
    }

    .spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .prog-div {
        width: 80px;
        height: 80px;
        

    }
`





const Box = styled.div`
    margin-bottom: 20px;
    background-color: white;
    border-radius: 5px;     
        /* box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; */
        box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
        -webkit-box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
        -moz-box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
        padding: ${props => props.p ? props.p : '20px'};
        height: auto; 
`

const TopDiv = styled.div`
    border-bottom: 2px solid ${props => props.theme.palette.background};
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const MainDiv = styled.div`
    padding: 20px;
    .intro {
        margin: 20px 0;
    }
`


export {
    Section,
    TopDiv,
    Box,
    MainDiv,
}