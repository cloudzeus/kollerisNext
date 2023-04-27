import React from "react"
import { Btn } from "./styles"

const Button = ({children}) => {
  return (
    <Btn>
      {children}
    </Btn>
  )
}

export default Button;