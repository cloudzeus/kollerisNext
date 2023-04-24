import styled from "styled-components";




const CenterBox = (props) => {
  return (
    <Box padding={props.padding}>{props.children}</Box>
  )
}


const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: ${props => props.padding  ? props.padding : '10px'}
`

export default CenterBox