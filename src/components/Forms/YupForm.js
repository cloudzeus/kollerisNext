
import { useForm } from "react-hook-form";

const YupForm = ({children, onSubmit, className}) => {
    const { handleSubmit } = useForm({})

  return (
    <div>
        <form 
            className={className} 
            noValidate 
            onSubmit={handleSubmit(onSubmit)}>
            {children}
        </form>
    </div>
  )
}

export default YupForm;