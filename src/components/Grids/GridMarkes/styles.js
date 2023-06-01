import styled from "styled-components";

export const Container = styled.div`
    padding: 0px !important;
    .header {
        padding: 20px;
        border-bottom: 2px solid ${props => props.theme.palette.background};
    }

    .boxHeader {
      margin-bottom: 10px ;
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
  .form {
    background-color: white;
    border: 1px solid ${props => props.theme.palette.border};
    padding: 40px;
    /* min-width: 600px; */
    border-radius: 4px;
    /* @media (max-width: 601px) {
      min-width: 90%;
    } */
  }

  .form h2 {
    font-size: 15px;
    margin-top: 20px;
    letter-spacing: 0.4px;
  }
  .form div.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;
  }

  
  h2 {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .innerContainer {
    padding: 30px;
  }
`

export const GridActions = styled.div`
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

  /* @media (max-width: 700px) {
    width: 50px;
    height: 50px;
    button {
      display: none;
    }
  } */
`


export const GridContainer = styled.div`
    border: 1px solid ${props => props.theme.palette.border};
    border-radius: 6px;
    border-top: 0px;
`