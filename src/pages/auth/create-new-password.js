import { useEffect, useState } from "react";
import styled from "styled-components";
import LoginLayout from "@/layouts/Auth/loginLayout";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputStyled, InputPass } from "@/components/Forms/FormInput";
import Button from "@/components/Buttons/Button";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

const registerSchema = yup.object().shape({
	password: yup.string().required('Συμπληρώστε τον κωδικό').min(5, 'Tουλάχιστον 5 χαρακτήρες').max(15, 'Μέχρι 15 χαρακτήρες'),
    passwordConfirm: yup.string().required('Συμπληρώστε τον κωδικό')
    .test('passwords-match', 'Passwords must match', function(value){
      return this.parent.password === value
    })
});



const CreateNewPassword = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
		resolver: yupResolver(registerSchema),
	});
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    console.log(router.query)
    console.log(router)
    const onSubmit = async (data) => {
        setLoading(true)
        if(data) {

        }
        const resp = await axios.post('/api/user/resetPassword', {password: data.password, email: router.query.email , action: 'finalReset'})
        if(resp.data.success) {
            setLoading(false)
            router.push('/auth/login')
        } else {
            setLoading(false)
            toast.error('Κάτι πήγε στραβά')
        }


    }
    return (
        <LoginLayout>
            <Container className="box">
                <h1 className="primaryHeader">ΑΛΛΑΓΗ ΚΩΔΙΚΟΥ</h1>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
					<InputPass
						label="Κωδικός"
						name="password"
						register={register}
						error={errors.password}
					/>
					<InputStyled
						label="Eπιβεβαίωση"
						name="passwordConfirm"
                        type="password"
						register={register}
						// error={passwordNoMatch ? {message:  'Δεν ταιριάζουν οι κωδικοί'} : errors.password }
						error={errors.passwordConfirm}
					/>

					{/* Checkbox row */}
					
					<Button size={'100%'} loading={loading}>Αποστολή</Button>
				</form>
            </Container>
        </LoginLayout>
    )
}


const Container = styled.div`
    padding: 20px;
    min-width: 450px;
    h1 {
        font-size: 20px;
        margin-bottom: 20px;
    }
`

export default CreateNewPassword;