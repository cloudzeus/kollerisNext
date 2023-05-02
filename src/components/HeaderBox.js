import React from 'react'
import styled from 'styled-components'

export const HeaderBox = ({ children, title }) => {
  return (
    <Container>
      <div className="top_div">
        <h2 className="header_text">{title}</h2>
      </div>
      <div className="bottom_div">{children}</div>
    </Container>
  )

}
export const HeaderBoxShadow = ({ children, title }) => {
  return (
    <ContainerShadow>
      <div className="top_div">
        <h3 className="subheader_text">{title}</h3>
      </div>
      <div className="bottom_div">{children}</div>
    </ContainerShadow>
  )
}



const Container = styled.div`
  border-radius: 8px;
  background-color: white;
  margin-top: 10px;
    -webkit-box-shadow: -2px 2px 6px -5px rgba(41,41,41,0.09);
  -moz-box-shadow: -2px 2px 6px -5px rgba(41,41,41,0.09);
  box-shadow: -2px 2px 6px -5px rgba(41,41,41,0.09);
  .top_div {
    display: flex;
    align-items: center;
    padding: 25px;
    border-bottom: 2px solid ${({ theme }) => theme.palette.background};
    color: black;
    
  }
  .bottom_div {
    display: flex;
    align-items: center;
    padding: 20px;
  }

  .header_text {
    font-weight: 600;
    font-size: 18px;
  }

 
  
`

const ContainerShadow = styled.div`
   border-radius: 8px;
  background-color: white;
  margin-top: 10px;
  border: 1px solid #e8e8e7;
  margin-right: 20px;
  &:hover {
    -webkit-box-shadow: -2px 2px 11px -5px rgba(41,41,41,0.14);
    -moz-box-shadow: -2px 2px 11px -5px rgba(41,41,41,0.14);
    box-shadow: -2px 2px 11px -5px rgba(41,41,41,0.14);
  }

  .top_div {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e8e8e7;
  }
  .bottom_div {
    display: flex;
    align-items: center;
    padding: 10px;
    flex-direction: column;
  }

  .subheader_text {
    font-size: 13px;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.text.main};
    letter-spacing: 0.8px;
  }




`