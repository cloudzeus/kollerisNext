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
    padding: 40px;
    min-width: 600px;
    border-radius: 4px;
    @media (max-width: 601px) {
      min-width: 90%;
    }
  }

  .form h2 {
    font-size: 17px;
    margin-top: 20px;
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
  
`

export const GridActions = styled.div`

    /* background-color: #fafafa; */
    /* border-top: 1px solid #d5d4d5; */
    display: flex;
    padding: 10px;
    display: flex;
    button {
    height: 35px;
    border: none;
    background-color: transparent;
    display: flex;
    align-items: center;
    color:#737384;
    padding: 5px 10px;
    border-radius: 4px;
    }
    button:hover, .top-div button:active {
    background-color: #d5d4d5;
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
`