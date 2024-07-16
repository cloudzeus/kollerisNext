import React,  {useState} from 'react'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios'
import { Button } from 'primereact/button';
import Input from '@/components/Forms/PrimeInput';
import { useToast } from '@/_context/ToastContext';
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const [submit, setSubmit] = useState(false)
  const {showMessage} = useToast()
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const schema = yup.object().shape({
    email: yup.string().email('Λάθος format email').required('Συμπληρώστε το email'),
});
const {  handleSubmit, formState: { errors }, reset, control } = useForm({
  resolver: yupResolver(schema),
  defaultValues: {
    email: '',
  }
});

  const onSubmit = async (formData) => {
    setLoading(true)
    try {
      const {data} = await axios.post('/api/user/resetPassword', {email: formData.email, action: 'sendResetEmail'})
      if(data.success){
        showMessage({
          severity: 'success',
          summary: 'Επιτυχία',
          message: data.message
        })
        setSubmit(true)
      } else {
        showMessage({
          severity: 'error',
          summary: 'Αποτυχία',
          message:data.message
        })
      } 
    } catch (e) {
      showMessage({
        severity: 'error',
        summary: 'Αποτυχία',
        message: 'Σφάλμα κατά την αποστολή email'
      })
    } finally {
      setLoading(false)
      reset();
    }

    
  }
  return (
    <div className='login_layout'>
      <div  className="form_container">
      {!submit ? (
          <>
            <Button
              onClick={() => router.back()}
              className='back_button '  
              // label="Επιστροφή"
              severity='secondary'
              icon="pi pi-arrow-left"
            />
            <p className='mb-3 text-lg'>
            Εισάγετε την διεύθυνση email σας και θα σας στείλουμε έναν σύνδεσμο για την επαναφορά του κωδικού πρόσβασης.
            </p>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                   <Input
                    label={'email'}
                    name={'email'}
                    mb={'10px'}
                    required
                    control={control}
                    error={errors.email}
                    placeholder={'example@gmail.com'}
                />
                  <Button type="submit" label="Αποστολή συνδέσμου στο Email" loading={loading} style={{width: '100%'}} />
            </form>
            
          </>
        ) : (
          <SuccessMessage />
        )}
      </div >
    </div>

  )
}

const SuccessMessage = () => {
  const router = useRouter()
  return (
    <>
      <div className="success">
      <div className='flex mb-1'>
      <i className="pi pi-check mr-2" style={{ color: 'slateblue' }}></i>
      <h3>Το email στάλθηκε</h3>
      </div>
      </div>
      <p>Ελέγξτε το email σας και πατήστε τον σύνδεσμο αλλαγής κωδικού</p>
      <Button 
      onClick={() => router.push('/auth/signin')}
      type="submit" 
      label="Επιστροφή στην Σύνδεση" 
      icon="pi pi-arrow-left"
      style={{width: '100%', marginTop: '10px'}} 
      />

    </>
  )
}





export default ResetPassword