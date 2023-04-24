import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import Spinner from '../Spinner';


const AuthWrapper = ({children}) => {
  const { isAuthenticated } = useSelector(state => state.user)
  const router = useRouter();
 
  useEffect(() => {
    if(!isAuthenticated) {
      router.push('/auth/login');
    }
   
  }, [])

  return (
    <>
      {!isAuthenticated ? <Spinner/> :(
        <>
          {children}
        </>
      ) }
    </>
  )
}

export default AuthWrapper