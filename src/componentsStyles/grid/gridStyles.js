import styled from "styled-components";



const IndexWrapper = styled.div`
    padding: 0px !important;
    .header {
        padding: 20px;
        border-bottom: 2px solid ${props => props.theme.palette.background};
    }
    //grid Component: header:
    .boxHeader {
      margin-bottom: 10px ;
    }


    //style the border of the actual grid component that dispalys the data:
    .grid-wrapper {
        border: 1px solid ${props => props.theme.palette.border};
        border-radius: 6px;
        border-top: 0px;
    }
    .grid-wrapper .percentage {
        width: 60;
        height: 60;
    }
  .dialogForm {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 199;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  
  h2 {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .innerContainer {
    padding: 30px;
  }

   button.grid-icon {
    padding: 10px;
	background-color: ${props => props.theme.palette.primary.light};
	margin-right: 5px;
    outline: none;
    border: none;
  }
`

const GridActions = styled.div`
    border: 1px solid ${props => props.theme.palette.border};
    display: inline-flex;
    padding: 5px;
    margin-bottom: 10px;
    border-radius: 5px;
    width: auto;
    button {
    height: 30px;
    border: none;
    background-color: transparent;
    display: flex;
    align-items: center;
    color:#737384;
    padding: 5px 10px;
    border-radius: 4px;
    position: relative;
    }

    button:hover, .top-div button:active {
		background-color: ${props => props.theme.palette.primary.light50};
    color: ${props => props.theme.palette.primary.main};
    font-weight: 500;
  }
    button:hover svg {
		  color: ${props => props.theme.palette.primary.main};
  }
    button:active {
      scale: 0.9;
    }
    button svg {
      font-size: 16px;
      font-weight: 600;
      color: #737384;
      margin-right: 2px;
    }
    .disabled {
      color: #dedede;
    }
    .disabled:hover {
      background-color: transparent;
      color: #dedede;
    }
    .disabled:hover svg {
      color: #dedede;
    }


`


const FormWrapper = styled.form`
    background-color: white;
    border: 1px solid ${props => props.theme.palette.border};
    padding: 30px;
    border-radius: 4px;
   
  .grid-form_header {
    font-weight: 400;
    font-size: 20px;
    position: relative;
    margin-bottom: 40px;
    & span {
      font-weight: 700;
    }
  }

  .grid-form_header::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 20px;
    height: 2px;
    border-radius: 4px;
    background-color: ${props => props.theme.palette.accent};

  }

  .grid-form_subheader {
    font-size: 18px;
    font-weight: 500;
    position:relative;
    margin-bottom: 30px;
    margin-top: 40px;
    color:#727273;
  }

  .grid-form_subheader::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 15px;
    height: 2px;
    border-radius: 4px;
    background-color: ${props => props.theme.palette.accent};

  }
  .grid-form_buttondiv {
    margin-top: 30px;
  }
  .grid-form_back {
	background-color: ${props => props.theme.palette.primary.light};
	margin-right: 5px;
    outline: none;
    border: none;
    margin-left: 10px;
    height:  40px;
    width: 40px;
    border-radius: 4px;
  }

 
  

`

const ImageDiv = styled.div`
    width: 50px;
    height: 50px;
    object-fit: contain;
    border-radius: 4px;
    background-color: white;
    position: relative;
    overflow: hidden;
    border: 2px solid ${({ theme }) => theme.palette.border};
   
`

const GridContainer = styled.div`
    display: grid;
    height: auto;
    grid-template-columns: ${props => props.repeat ? `repeat(${props.repeat}, 1fr)` : 'repeat(2, 1fr)'};
    grid-column-gap: 30px;
    @media (max-width: 1400px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 1000px) {
        grid-template-columns: repeat(1, 1fr);
    }
`

const SyncItemsContainer = styled.div`
    .header-top {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            margin-top: 20px;
            
        }

    .header-top div {
        display: flex;
        align-items: center;
        margin-right: 10px;
        border-radius: 4px;
        border: 1px solid ${props => props.theme.palette.border};
        padding: 10px;
        font-size: 13px;
        height: 40px;
        cursor: pointer;
    }

    .header-top div svg {
        color: ${props => props.theme.palette.primary.main};
    }

    h1 {
        font-size: 15px;
    }
  
    .syncDiv p {
        font-size: 13px;
        font-weight: bold;
        /* color: ${props => props.theme.palette.primary.main}; */
        font-weight: 300;
    }
    .syncDiv p span {
        font-size: 16px;
        font-weight: bold;
        /* color: ${props => props.theme.palette.primary.main}; */
    }
    .syncDiv svg {
        margin-right: 10px;
    }
   


    .formsContainer {
        border: 1px solid ${props => props.theme.palette.border};
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 20px;
        min-height: 115px;
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
   
    @keyframes fillAnimation {
    0% {
        width: 0%;
    }
    100% {
        width: 100%;
    }
    }

    .filled-border {
    position: relative;
    }

    .filled-border::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px; /* Adjust the height of the filled border as needed */
    background-color: blue; /* Adjust the color of the filled border as needed */
    animation: fillAnimation 0.4s linear forwards; /* Adjust the animation duration as needed */
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
`

const MissingItemsContainer = styled.div`
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
`

const List = styled.div`

`

const GridItemPercentage = styled.div`
    width: 65px;
    height: 65px;
    padding: 5px;
`

export {
    IndexWrapper,
    GridActions,
    ImageDiv,
    GridContainer,
    SyncItemsContainer,
    MissingItemsContainer,
    FormWrapper,
    List,
    GridItemPercentage 
}