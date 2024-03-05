import styled from "styled-components"

const LoginLayout = ({ children }) => {
  return (
    <Box>
      {children}
    </Box>

  )
}

const Box = styled.div`
  height: 100vh;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  background-color: white;
`

export default LoginLayout