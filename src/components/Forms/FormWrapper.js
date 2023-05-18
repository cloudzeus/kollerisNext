import React from 'react'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from '../Buttons/Button';
const FormWrapper = ({ children, onSubmit, btnSize, btnText }) => {
   
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
      } = useForm({
        resolver: yupResolver(schema),
        
      });
    
      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {React.Children.map(children, (child) => {
              // Pass register and errors props to each child component
              return React.cloneElement(child, { register, errors });
            })}
            <Button size={btnSize} type="submit">{btnText}</Button>
          </form>
        </div>
      );
    
}

export default FormWrapper