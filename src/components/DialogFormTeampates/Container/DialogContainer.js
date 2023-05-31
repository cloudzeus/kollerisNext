import React, { useState, cloneElement } from 'react'
import styled from 'styled-components'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const DialogContainer = ({ children, title }) => {
  const [show, setShow] = useState(false)
  const handleClick = () => {
    setShow((prev) => !prev)
  }



  return (

    <Container>
      <div className="top-div" >
        <button onClick={handleClick}>
          <AddIcon /> Προσθήκη
        </button>
        <button onClick={handleClick}>
          <EditIcon /> Διόρθωση
        </button>
        <button onClick={handleClick}>
          <DeleteIcon  /> Διαγραφή
        </button>
      </div>
      {show && (
        <div className="dialogForm">
          <div className="form">
            <div className="header">
              <h2>Προσθήκη Νέου</h2>
              <button onClick={handleClick}>Close</button>
            </div>
            {children}

          </div>
        </div>
      )}
    </Container>
  )
}

export default DialogContainer


const Container = styled.div`
 
  background-color: #fafafa;
  display: flex;
  padding: 10px;
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
    padding: 20px;
    min-width: 600px;
    border-radius: 4px;
    @media (max-width: 601px) {
      min-width: 90%;
    }
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
  .top-div {
    display: flex;
  }

  .top-div button {
    height: 35px;
    border: none;
    background-color: transparent;
    display: flex;
    align-items: center;
    color:#737384;
    padding: 5px 10px;
    border-radius: 4px;

  }

  .top-div button:hover, .top-div button:active {
    background-color: #d5d4d5;
  }
  .top-div button:active {
    scale: 0.9;
  }
  .top-div button svg {
    font-size: 16px;
    font-weight: 600;
    color: #737384;
    margin-right: 2px;
  }
`