import React, { useState, cloneElement } from 'react'
import styled from 'styled-components'

const DialogContainer = ({children, title}) => {
  const [show, setSHow] = useState(false)
  const handleClick= () => {
    setSHow((prev) => !prev)
  }


  
  return (
 
    <Container>
        <div className="top-div" >
          <button onClick={handleClick}>Add</button>
         
        </div>
        {show && (
          <div className="dialogForm">
            <div  className="form">
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
`